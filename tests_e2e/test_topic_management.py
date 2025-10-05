import re
import datetime
import requests
from playwright.sync_api import expect


class TestTopicManagement:
    """
    Tests for the topic management page, using the shared org creation + login context.
    """

    @staticmethod
    def get_current_topics(context_dict, only_active: bool = False):
        """
        Helper function to fetch the current or active topics from the server.
        """
        if only_active:
            next_url = f"{context_dict['cloud_run_host']}/api/v1/topics/list_active/"
        else:
            next_url = f"{context_dict['cloud_run_host']}/api/v1/topics/"

        results = []
        while next_url:
            resp = requests.get(next_url, headers=context_dict['analyst_headers'])
            resp.raise_for_status()
            resp_json = resp.json()

            results.extend(resp_json['results'])
            next_url = resp_json['next']
        return results

    @staticmethod
    def extract_name_and_description(topics_data: list[dict]):
        return {t['name']: t['description'] for t in topics_data}

    @staticmethod
    def create_topic_in_ui(topic_name: str, topic_description: str, page):
        """
        Go through the steps required in order to create a topic via the UI
        :param topic_name: str, Topic name
        :param topic_description: str, Topic description
        :param page: playwright page to be used for testing
        """
        page.get_by_test_id("creation-modal-button").click()
        page.get_by_test_id("creation-activity-switch").get_by_label("").check()
        page.get_by_test_id("name-input").fill(topic_name)
        page.get_by_test_id("description-input").fill(topic_description)
        page.get_by_test_id("submit-button").click()

    @staticmethod
    def edit_topic_in_ui(row_number: int, topic_name: str, page, topic_description: str = None):
        """
        Go through the steps required in order to edit an existing topic via the UI
        :param row_number: int, Row number of topic to edit
        :param topic_name: str, Topic name
        :param topic_description: str, optional Topic description
        :param page: playwright page to be used for testing
        """
        page.locator(f"div:nth-child({row_number}) > div:nth-child(4) > button").first.click()
        page.get_by_test_id("name-input").click()
        page.get_by_test_id("name-input").fill(topic_name)
        if topic_description:
            page.get_by_test_id("description-input").click()
            page.get_by_test_id("description-input").fill(topic_description)
        page.get_by_test_id("submit-button").click()

    def test_topic_create(self, test_org_context, login_page, frontend_path):
        """
        Verify that creating a new topic via the UI actually stores it in the DB.
        """

        initial_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))

        topic_name = "Test Topic"
        topic_desc = "Important Topic"

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/topics")

        # Create a new topic
        self.create_topic_in_ui(topic_name, topic_desc, login_page)

        # Verify it appears in the UI
        expect(login_page.get_by_role("heading", name=topic_name)).to_be_visible()
        expect(login_page.get_by_text(topic_desc)).to_be_visible()

        # Verify date/time references, for example:
        today_str = datetime.date.today().strftime('%-d %b %Y')
        expect(login_page.get_by_text(f"Last modified: {today_str}")).to_be_visible()
        expect(login_page.get_by_text(f"Created: {today_str}")).to_be_visible()

        # Finally, confirm it was written to the DB
        updated_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))
        newly_added = dict(set(updated_topics.items()) - set(initial_topics.items()))
        assert newly_added == {topic_name: topic_desc}, "New topic not found in DB"

    def test_topic_create_duplicate_name(self, test_org_context, login_page, frontend_path):
        """
        Verify that creating a new topic with the name of an existing one raises an error.
        """

        initial_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/topics")

        # Create a new topic with the details of the previous test
        self.create_topic_in_ui("Test Topic", "Important Topic", login_page)

        # Verify creation is not allowed at the UI
        expect(login_page.get_by_text("You already have a topic with")).to_be_visible()
        expect(login_page.get_by_test_id("submit-button")).to_be_visible()

        # Finally, confirm it was not written to the DB
        updated_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))
        newly_added = dict(set(updated_topics.items()) - set(initial_topics.items()))
        assert len(newly_added.keys()) == 0

    def test_topic_edit(self, test_org_context, login_page, frontend_path):
        """
        Verify that it is possible to edit a topic.
        """

        initial_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))

        new_name = "New Topic"
        new_desc = "Crazy new description"

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/topics")

        # Edit an existing topic
        with login_page.expect_response(
          lambda r: "api/v1/topics/" in r.url and r.request.method == "PATCH" and r.status == 200
        ):
            self.edit_topic_in_ui(1, new_name, login_page, new_desc)

        # Reload the page
        login_page.goto(f"{frontend_path}/topics")
        login_page.wait_for_url(f"{frontend_path}/topics")

        # Verify modification in the UI
        login_page.get_by_role("heading", name=new_name).wait_for(state="visible")
        login_page.get_by_text(new_desc).wait_for(state="visible")

        # Finally, confirm it was written to the DB
        updated_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))
        newly_added = dict(set(updated_topics.items()) - set(initial_topics.items()))
        assert len(newly_added.keys()) == 1
        assert new_name in newly_added
        assert newly_added[new_name] == new_desc

    def test_topic_edit_duplicate_name(self, test_org_context, login_page, frontend_path):
        """
        Verify that it is not possible to edit a topic to the name of an existing topic.
        """

        initial_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))

        second_name = "Second Topic"  # Make sure alphabetically after other topic
        second_desc = "Second description"

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/topics")

        # Create second topic
        self.create_topic_in_ui(second_name, second_desc, login_page)

        # Edit an existing topic to name of second topic
        self.edit_topic_in_ui(1, second_name, login_page)

        # Verify creation is not allowed at the UI
        expect(login_page.get_by_text("You already have a topic with")).to_be_visible()
        expect(login_page.get_by_test_id("submit-button")).to_be_visible()

        # Finally, confirm it was not written to the DB
        updated_topics = self.extract_name_and_description(self.get_current_topics(test_org_context))
        newly_added = dict(set(updated_topics.items()) - set(initial_topics.items()))
        assert len(newly_added.keys()) == 1
        assert second_name in newly_added
        assert newly_added[second_name] == second_desc

    def test_topic_active_toggle(self, test_org_context, login_page, frontend_path):
        """
        Verify that the active state button works as expected
        """

        initial_topics = self.get_current_topics(test_org_context)

        login_page.goto(f"{frontend_path}/topics")

        # Check that all topics are initially active
        assert all([topic['is_active'] for topic in initial_topics])

        # De-activate the first topic (Wait for the PATCH call to finish with status 200.)
        with login_page.expect_response(
            lambda r: "api/v1/topics/" in r.url and r.request.method == "PATCH" and r.status == 200
        ):
            login_page.locator(".font-inherit").first.uncheck()

        # Check the expected results
        expect(login_page.locator(".font-inherit").first).not_to_be_checked()

        topics_altered = self.get_current_topics(test_org_context)
        inactive = [topic for topic in topics_altered if not topic['is_active']]
        assert len(inactive) == 1

        targeted_topic = inactive[0]['name']
        active_topics = self.get_current_topics(test_org_context, only_active=True)
        assert targeted_topic not in [topic['name'] for topic in active_topics]

        # Re-activate the first topic
        with login_page.expect_response(
          lambda r: "api/v1/topics/" in r.url and r.request.method == "PATCH" and r.status == 200
        ):
            login_page.locator(".font-inherit").first.check()

        # Check the expected results
        expect(login_page.locator(".font-inherit").first).to_be_checked()
        topics_final = self.get_current_topics(test_org_context)
        inactive = [topic for topic in topics_final if not topic['is_active']]
        assert len(inactive) == 0

        active_topics = self.get_current_topics(test_org_context, only_active=True)
        assert len(active_topics) == 2
        assert targeted_topic in [topic['name'] for topic in active_topics]

    def test_topic_delete(self, test_org_context, login_page, frontend_path):
        """
        Verify deletion of topics through the UI
        """

        login_page.goto(f"{frontend_path}/topics")

        initial_topics = self.get_current_topics(test_org_context)
        targeted_topic = initial_topics[0]['name']
        targeted_topic_desc = initial_topics[0]['description']
        today_str = datetime.date.today().strftime('%-d %b %Y')

        # Click on the delete button
        (
            login_page
            .locator("div")
            .filter(has_text=re.compile(
                rf"^{targeted_topic}{targeted_topic_desc}Last modified: {today_str}Created: {today_str}$"
            ))
            .get_by_test_id("confirmation-modal-button")
            .click()
        )

        # Check the verification page
        expect(login_page.get_by_text(f'Do you really want to delete the topic "{targeted_topic}"?')).to_be_visible()

        # Confirm deletion
        with login_page.expect_response(
          lambda r: "api/v1/topics/" in r.url and r.request.method == "DELETE" and r.status == 204
        ):
            login_page.get_by_test_id("confirm-button").click()

        # Check expected results
        expect(login_page.get_by_role("heading", name=targeted_topic)).not_to_be_visible()

        # EXTRA WAITING TIME NEEDED HERE (Wait for DELETE to /api/v1/topics/{id}/ to return 204)
        current_topics = self.get_current_topics(test_org_context)
        assert len(current_topics) == 1
        assert targeted_topic not in [topic['name'] for topic in current_topics]

    def test_suggested_topics_visibility(self, test_org_context, login_page, frontend_path):
        """
        Verify that the suggested topics functionality works correctly:
        - Button is not visible since no suggested topics exist
        """
        # Navigate to the topics page
        login_page.goto(f"{frontend_path}/topics")

        # Verify the suggested topics button is not visible
        expect(login_page.get_by_test_id("suggested-topics-button")).not_to_be_visible()

        # Note: If there was a way to create suggested topics, this would be what we would test
        # Click the suggested topics button
        # login_page.get_by_test_id("suggested-topics-button").click()

        # Verify that "Suggested Topics" text appears in the main section
        # expect(login_page.locator("#main")).to_contain_text("Suggested Topics")

