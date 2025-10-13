import re
import requests
from playwright.sync_api import expect


class TestTopicAnalysis:
    def test_topic_summaries(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that every topic's summaries are visible in this page
        """
        # Retrieve all summaries
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/topics/all_summaries/",
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        summaries = resp.json()

        # Retrieve Organization Overview per Topic
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/organizations/overview/",
          params={'per_topic': True},
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        resp_json = resp.json()
        overview = resp_json.get(test_org_context['org_id'])

        # Check that every recently active topic has a link to their topic dashboard
        for topic_name in overview.keys():
            login_page.goto(f"{frontend_path}/dashboard")
            login_page.get_by_role("link", name=topic_name).click()

            # Check that the page title is visible
            expect(login_page.get_by_role("heading", name=topic_name)).to_be_visible()
            login_page.get_by_role("button", name="year").click()
            login_page.get_by_role("button", name="months").click()
            login_page.get_by_role("button", name="1 month").click()

            for summ in summaries.values():
                if summ['name'] == topic_name:
                    # Check that every topic title is visible
                    for title, report in summ['summary'].items():
                        summ_regex = re.compile(rf'^{re.escape(title)}{re.escape(report[:10])}')
                        expect(login_page.get_by_text(summ_regex)).to_be_visible()
                    break
