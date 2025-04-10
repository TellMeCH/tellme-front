import re
from datetime import datetime
import requests
from playwright.sync_api import expect


class TestMainDashboard:
    def test_general_overview(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that the generic organization overview is visible in the resulting UI
        """
        # Retrieve Organization Overview
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/organizations/overview/",
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        resp_json = resp.json()
        overview = resp_json.get(test_org_context['org_id']).get('general')

        # Retrieve Organization Data
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/organizations/{test_org_context['org_id']}/",
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        org_data = resp.json()

        login_page.goto(f"{frontend_path}/dashboard")

        # Check Page Title
        expect(login_page.get_by_role("heading", name=org_data["name"])).to_be_visible()

        # Shown month
        latest_month = sorted([month for month in overview['count'].keys() if month != 'change'])[1]
        latest_month_str = datetime.strptime(latest_month, '%Y-%m').strftime('%b')
        expect(login_page.get_by_text(latest_month_str).nth(1)).to_be_visible()

        # Check all overview KPIs are shown
        kpi_title = {
            'avg_sentiment': 'Customer Engagement',
            'count': 'Call Count',
            'avg_duration': 'Call Duration'
        }
        for kpi, title in kpi_title.items():
            change_str = f'{"+" if overview[kpi]['change'] > 0 else "-"}{abs(overview[kpi]['change']):.0f}'
            container_str = f"{title}{change_str}%{overview[kpi][latest_month]:.0f}{latest_month_str}"
            expect(login_page.get_by_text(container_str)).to_be_visible()

        # Check most popular topic is shown
        topic_regex = re.compile(rf"^{overview['most_popular_topic'][latest_month]}$")
        expect(login_page.get_by_role("paragraph").filter(has_text=topic_regex)).to_be_visible()


