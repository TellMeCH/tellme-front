import datetime
import pytest
import requests
from playwright.sync_api import expect


class TestTopicManagement:
    """
    Tests for the topic management page, using the shared org creation + login context.
    """

    def get_current_topics(self, context_dict):
        """
        Helper function to fetch the current topics from the server.
        """
        resp = requests.get(
            f"{context_dict['cloud_run_host']}/api/v1/topics/",
            headers=context_dict['analyst_headers']
        )
        resp.raise_for_status()
        topics_json = resp.json()
        return {t['name']: t['description'] for t in topics_json.get('results')}

    @pytest.mark.e2e
    def test_topic_creation(self, test_org_context, playwright_context):
        """
        Verify that creating a new topic via the UI actually stores it in the DB.
        """
        initial_topics = self.get_current_topics(test_org_context)

        topic_name = "Test Topic"
        topic_desc = "Important Topic"

        # Reuse the logged-in browser state, but create a fresh context/page for the test
        browser = playwright_context["browser"]
        state_path = playwright_context["storage_path"]
        frontend_url = playwright_context["frontend_url"]

        context = browser.new_context(storage_state=state_path)
        page = context.new_page()

        # Go to the Topics page
        page.goto(f"{frontend_url}/topics")

        # Create a new topic
        page.get_by_test_id("creation-modal-button").click()
        page.get_by_role("switch", name="Activate for Analysis").check()
        page.get_by_test_id("name-input").fill(topic_name)
        page.get_by_test_id("description-input").fill(topic_desc)
        page.get_by_test_id("submit-button").click()

        # Verify it appears in the UI
        expect(page.get_by_role("heading", name=topic_name)).to_be_visible()
        expect(page.get_by_text(topic_desc)).to_be_visible()

        # Verify date/time references, for example:
        today_str = datetime.date.today().strftime('%-d %b')  # e.g. "6 Apr"
        expect(page.get_by_text(f"Last modified: {today_str}")).to_be_visible()
        expect(page.get_by_text(f"Created: {today_str}")).to_be_visible()

        # Finally, confirm it was written to the DB
        updated_topics = self.get_current_topics(test_org_context)
        newly_added = dict(set(updated_topics.items()) - set(initial_topics.items()))
        assert newly_added == {topic_name: topic_desc}, "New topic not found in DB"
