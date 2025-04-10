import os
import re
import time
import secrets
import random
import hashlib
import string
import logging
import requests
import pytest
import firebase_admin
from firebase_admin import auth
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright

logger = logging.getLogger(__name__)


@pytest.fixture(scope="session")
def firebase_app():
    """
    Initialize Firebase Admin once per session.
    """
    app = firebase_admin.initialize_app()
    yield app
    firebase_admin.delete_app(app)


@pytest.fixture(scope="session")
def frontend_path():
    """
    Simply returns the frontend path from the environment
    """
    FRONTEND_PATH = os.getenv("FRONTEND_PATH")
    if not FRONTEND_PATH:
      raise EnvironmentError("FRONTEND_PATH environment variable not set.")
    return FRONTEND_PATH


def user_id_token(user_email: str, firebase_api_key: str) -> str:
    """
    Exchange a Firebase custom token for an ID token using Identity Toolkit.
    """
    user = auth.get_user_by_email(user_email)
    custom_token = auth.create_custom_token(user.uid)
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={firebase_api_key}"
    payload = {
        "token": custom_token.decode("utf-8"),
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    return resp.json()["idToken"]


@pytest.fixture(scope="session")
def superuser_headers(firebase_app):
    """
    Grab the superuser ID token once and produce a 'superuser_headers'
    dict for repeated use in tests.
    """
    firebase_api_key = os.getenv("FIREBASE_WEB_API_KEY")
    tellme_env = os.getenv("TELLME_ENV")

    if not firebase_api_key or not tellme_env:
        raise EnvironmentError("Missing FIREBASE_WEB_API_KEY or TELLME_ENV environment variable.")

    superuser_email = f"app.admin.{tellme_env}@tell-me.ch"

    token = user_id_token(superuser_email, firebase_api_key)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def test_org_context(superuser_headers):
    """
    Create a single test organization and test analyst user, once per session.
    Also handle final teardown. Returns a dict that includes
    org_id, analyst email/password, analyst headers, etc.
    """
    cloud_run_host = os.getenv("CLOUD_RUN_HOST")
    firebase_api_key = os.getenv("FIREBASE_WEB_API_KEY")
    analyst_email = os.getenv("TEST_USER_EMAIL")

    if not cloud_run_host:
        raise EnvironmentError("CLOUD_RUN_HOST environment variable not set.")
    if not firebase_api_key:
        raise EnvironmentError("FIREBASE_WEB_API_KEY environment variable not set.")
    if not analyst_email:
        raise EnvironmentError("TEST_USER_EMAIL environment variable not set.")

    def delete_surrogate_data(org_url: str):
        """
        Delete the test analyst, then delete the organization.
        """
        analyst_response = requests.get(
            f"{cloud_run_host}/api/v1/employees/",
            headers=superuser_headers
        )
        analyst_list = analyst_response.json()["results"]
        for analyst in analyst_list:
            if analyst.get('user'):
                if analyst['user']['email'] == analyst_email:
                    requests.delete(
                        analyst['url'],
                        headers=superuser_headers
                    )
                    logger.info(f"Deleted test analyst {analyst['user']['email']}")

        # Finally, delete the test organization
        requests.delete(org_url, headers=superuser_headers)
        logger.info(f"Deleted test organization {org_url}")

    def generate_password(length=16):
        special_chars = "!@#$%^&*()"

        password_chars = [
          secrets.choice(string.ascii_uppercase),
          secrets.choice(string.ascii_lowercase),
          secrets.choice(string.digits),
          secrets.choice(special_chars)
        ]
        all_chars = string.ascii_uppercase + string.ascii_lowercase + string.digits + special_chars
        password_chars += [
          secrets.choice(all_chars)
          for _ in range(length - 4)
        ]
        secrets.SystemRandom().shuffle(password_chars)
        return ''.join(password_chars)

    # 1) Check for existing "TestOrg-Suite", delete if found
    org_name = "TestOrg-Suite"
    org_list_resp = requests.get(
        f"{cloud_run_host}/api/v1/organizations/",
        headers=superuser_headers
    )
    org_list_resp.raise_for_status()

    for org in org_list_resp.json().get("results", []):
        if org["name"] == org_name:
            logger.info(f"Found existing org: {org['url']}. Deleting it...")
            delete_surrogate_data(org["url"])

    # 2) Create a new org
    org_data = {
        "name": org_name,
        "max_user_count": 10,
        "max_topic_count": 20,
    }
    resp = requests.post(
        f"{cloud_run_host}/api/v1/organizations/",
        json=org_data,
        headers=superuser_headers
    )
    resp.raise_for_status()
    org_json = resp.json()
    org_id = re.search(r"/organizations/([^/]+)/", org_json["url"]).group(1)
    logger.info(f"Created test organization {org_id}")

    # 3) Create analyst user
    analyst_password = generate_password()
    analyst_data = {
        "role": "ANALYST",
        "organization": org_id,
        "is_organization_admin": False,
        "user": {
            "email": analyst_email,
            "first_name": "John",
            "last_name": "Doe",
            "auth_type": "password"
        }
    }
    resp = requests.post(
        f"{cloud_run_host}/api/v1/employees/",
        json=analyst_data,
        headers=superuser_headers
    )
    resp.raise_for_status()
    employee_json = resp.json()
    analyst_id = employee_json['id']
    logger.info(f"Created analyst with email: {employee_json['user']['email']}")

    # 4) Mark the new Analyst user as verified; set password
    analyst_user = auth.get_user_by_email(analyst_email)
    auth.update_user(
        analyst_user.uid,
        email_verified=True,
        password=analyst_password
    )

    # 5) Obtain an ID token for that user, if needed in direct requests:
    analyst_id_token = user_id_token(analyst_email, firebase_api_key)
    analyst_headers = {
        "Authorization": f"Bearer {analyst_id_token}"
    }

    # Return context to use in tests
    context = {
        "cloud_run_host": cloud_run_host,
        "org_id": org_id,
        "analyst_email": analyst_email,
        "analyst_password": analyst_password,
        "analyst_id": analyst_id,
        "analyst_headers": analyst_headers,
        "superuser_headers": superuser_headers,
    }

    yield context

    # Final teardown: delete the org + test user
    delete_surrogate_data(f"{cloud_run_host}/api/v1/organizations/{org_id}/")


@pytest.fixture(scope="function")
def login_page(test_org_context, frontend_path):
    """
    A function-scoped fixture that:
      - Opens a new browser + context
      - Logs in from scratch
      - Returns a Page object that is now logged in
    Will run fresh for every test function.
    """
    # Data for the login
    analyst_email = test_org_context["analyst_email"]
    analyst_password = test_org_context["analyst_password"]

    # Start a new browser each test
    playwright = sync_playwright().start()
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    page = context.new_page()
    page.goto(frontend_path)

    # The login steps
    page.get_by_test_id("email-input").fill(analyst_email)
    page.get_by_test_id("email-input").press("Enter")

    page.get_by_test_id("password-input").fill(analyst_password)
    page.get_by_test_id("submit-button").click()

    # Wait for redirect or some "dashboard" route
    page.wait_for_url(f"{frontend_path}/dashboard")

    yield page  # or yield (page, browser) if you need the browser instance

    # Teardown: close everything
    context.close()
    browser.close()
    playwright.stop()


@pytest.fixture(scope="session")
def extended_test_data(test_org_context):
    """
    Creates:
      - 1 agent
      - 3 topics
      - 1 customer
      - 15 conversations total:
         * 6 in the 'month before the previous month' (M-2)
         * 9 in 'last month' (M-1)
         * Among the 9 'last month' convs: distribution is 4/3/2 across the 3 topics.

    Returns a dict with IDs and any other metadata you want to reference in tests.
    """
    cloud_run_host = test_org_context["cloud_run_host"]
    org_id = test_org_context["org_id"]
    superuser_headers = test_org_context["superuser_headers"]

    # Single agent
    agent_email = "test.agent@tell-me.ch"
    agent_data = {
        "role": "AGENT",
        "organization": org_id,
        "is_organization_admin": False,
        "user": {
          "email": agent_email,
          "first_name": "Agent",
          "last_name": "Test",
          "auth_type": "password"
        }
    }
    create_agent_resp = requests.post(
        f"{cloud_run_host}/api/v1/employees/",
        json=agent_data,
        headers=superuser_headers
    )
    create_agent_resp.raise_for_status()
    agent_id = create_agent_resp.json()["id"]

    # Create 3 topics
    TOPIC_DATA = [
        {"name": "Topic Alpha"},
        {"name": "Topic Beta"},
        {"name": "Topic Gamma"},
        {"name": "Topic Omega"}  # Empty topic
    ]
    topic_id_mapping = {}
    for i, topic in enumerate(TOPIC_DATA, start=1):
        topic['organization'] = org_id
        topic['is_active'] = True  # You can decide if all are active
        topic['description'] = 'Test topic description'
        create_topic_resp = requests.post(
          f"{cloud_run_host}/api/v1/topics/",
          json=topic,
          headers=superuser_headers,
        )
        create_topic_resp.raise_for_status()
        topic_id_mapping[i] = create_topic_resp.json()["id"]

    # Create 1 customer
    customer_data = {
        'external_id': hashlib.sha256(f'customer-{int(time.time())}'.encode()).hexdigest(),
        'organization': org_id
    }
    create_customer_resp = requests.post(
        f"{cloud_run_host}/api/v1/customers/",
        json=customer_data,
        headers=superuser_headers,
    )
    create_customer_resp.raise_for_status()
    customer_id = create_customer_resp.json()["id"]

    # Create 15 conversations: 6 = month before the previous month (M-2), 9 = last month (M-1)
    # Among those 9, distribution of topics = 4 / 3 / 2
    first_of_this_month = datetime(datetime.today().year, datetime.today().month, 1)

    # M-1 (last month)
    m1_end = first_of_this_month - timedelta(days=1)
    m1_start = datetime(m1_end.year, m1_end.month, 1)

    # M-2 (month before last)
    m2_end = m1_start - timedelta(days=1)
    m2_start = datetime(m2_end.year, m2_end.month, 1)

    # For the 9 conv in M-1: topic distribution is 4/3/2
    m1_distribution = {
        1: 4,
        2: 3,
        3: 2
    }

    # For the 6 conv in M-2, distribute 2 per topic just for clarity
    m2_distribution = {
        1: 2,
        2: 2,
        3: 2
    }

    conversation_ids = []

    def random_date_in_range(start_dt, end_dt):
        """Returns a random datetime between start_dt and end_dt."""
        delta = end_dt - start_dt
        random_days = random.randint(0, delta.days)
        return start_dt + timedelta(days=random_days)

    # Helper to create the conversation via POST
    def create_conversation(date_val, topic_idx):
        sentiment = random.uniform(0, 5)
        duration = random.randint(30, 1800)
        payload = {
          'path': f'/random/path/{secrets.token_hex(4)}',
          'date': date_val.isoformat() + 'Z',
          'duration': duration,
          'transcript': "This is a sample transcript",
          'sentiment': sentiment,
          'title': f"Conversation with {agent_email}",
          'summary': "This is a sample summary",
          'input_tokens': random.randint(50, 200),
          'output_tokens': random.randint(20, 100),
          'customer': customer_id,
          'agent': agent_id,
          'topics': [topic_id_mapping[topic_idx]]
        }
        resp = requests.post(
          f"{cloud_run_host}/api/v1/conversations/",
          json=payload,
          headers=superuser_headers,
        )
        resp.raise_for_status()
        return resp.json()["id"]

    # Create the 6 conv in M-2
    for topic_idx, count in m2_distribution.items():
        for _ in range(count):
            date_val = random_date_in_range(m2_start, m2_end)
            cid = create_conversation(date_val, topic_idx)
            conversation_ids.append(cid)

    # Create the 9 conv in M-1 (4/3/2 distribution)
    for topic_idx, count in m1_distribution.items():
        for _ in range(count):
            date_val = random_date_in_range(m1_start, m1_end)
            cid = create_conversation(date_val, topic_idx)
            conversation_ids.append(cid)

    # Pre-generate topic summaries
    requests.get(
        f'{cloud_run_host}/api/v1/topics/all_summaries/',
        headers=test_org_context['analyst_headers']
    )

    def delete_conversations(context):
        """
        Delete all conversations in the organization and their associated agent.
        """
        org_id = context['org_id']
        cloud_run_host = context['cloud_run_host']
        superuser_headers = context['superuser_headers']
        analyst_headers = context['analyst_headers']

        next_url = f"{cloud_run_host}/api/v1/organizations/{org_id}/conversations/"
        all_conversations = []
        while next_url:
            conv_response = requests.get(
                next_url,
                headers=superuser_headers
            )
            all_conversations.extend(conv_response.json()['results'])
            next_url = conv_response.json()['next']

        for conv in all_conversations:
            requests.delete(
                conv['url'],
                headers=superuser_headers
            )
            logger.info(f"Deleted test conversation {conv['title']}")

        next_url = f"{cloud_run_host}/api/v1/topics/"
        all_topics = []
        while next_url:
            topic_response = requests.get(
              next_url,
              headers=test_org_context['analyst_headers']
            )
            all_topics.extend(topic_response.json()['results'])
            next_url = topic_response.json()['next']

        for topic in all_topics:
            requests.delete(
                topic['url'],
                headers=analyst_headers
            )
            logger.info(f"Deleted test topic {topic['name']}")

        requests.delete(f'{cloud_run_host}/api/v1/employees/{agent_id}', headers=superuser_headers)

    # Yield any data that might be useful in tests
    yield {
        "agent_id": agent_id,
        "agent_email": agent_email,
        "topic_ids": topic_id_mapping,
        "customer_id": customer_id,
        "conversation_ids": conversation_ids,
    }

    # Delete conversations (the rest should be deleted by deleting the organization)
    delete_conversations(test_org_context)
