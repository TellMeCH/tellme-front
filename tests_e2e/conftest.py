import os
import re
import secrets
import string
import logging
import requests
import pytest
import firebase_admin
from firebase_admin import auth
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

    def get_superuser_token(email):
        user = auth.get_user_by_email(email)
        custom_token = auth.create_custom_token(user.uid)
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={firebase_api_key}"
        payload = {
            "token": custom_token.decode("utf-8"),
            "returnSecureToken": True
        }
        resp = requests.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()["idToken"]

    token = get_superuser_token(superuser_email)
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

    def user_id_token(user_email: str) -> str:
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

    def delete_surrogate_data(org_url: str):
        """
        Delete the test analyst (if found), then delete the test organization.
        """
        # Delete the test analyst if it exists
        analyst_response = requests.get(
            f"{cloud_run_host}/api/v1/employees/",
            headers=superuser_headers
        )
        analyst_list = analyst_response.json()["results"]
        for analyst in analyst_list:
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

    # 1) Check if there's an existing org with the same name
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

    # 2) Create the organization
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

    # 3) Create the analyst user
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

    # 4) Mark the new Analyst user as verified, set password
    analyst_user = auth.get_user_by_email(analyst_email)
    auth.update_user(
        analyst_user.uid,
        email_verified=True,
        password=analyst_password
    )

    # 5) Obtain an ID token for that user
    analyst_id_token = user_id_token(analyst_email)
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


@pytest.fixture(scope="session")
def playwright_context(test_org_context):
    """
    Spin up a single browser (session scope). Log the analyst user in once,
    store the login state, and re-use in test scripts.
    """
    # Frontend path
    FRONTEND_PATH = os.getenv('FRONTEND_PATH')
    if not FRONTEND_PATH:
      raise EnvironmentError("FRONTEND_PATH environment variable not set.")

    # Pull data for logging in
    analyst_email = test_org_context["analyst_email"]
    analyst_password = test_org_context["analyst_password"]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # Set headless=False for debugging
        context = browser.new_context()

        page = context.new_page()
        page.goto(f"{FRONTEND_PATH}")

        # Perform the login steps
        page.get_by_test_id("email-input").fill(analyst_email)
        page.get_by_test_id("email-input").press("Enter")

        page.get_by_test_id("password-input").fill(analyst_password)
        page.get_by_test_id("submit-button").click()

        page.wait_for_url(f"{FRONTEND_PATH}/dashboard")

        # Save the logged-in state
        stored = context.storage_state(path="state.json")
        print('STORED STATE:', stored)

        yield {
            "browser": browser,
            "storage_path": "state.json",
            "frontend_url": FRONTEND_PATH
        }

        # Close the browser after the entire session finishes
        browser.close()
