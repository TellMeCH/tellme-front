import re
import time
from datetime import datetime
import requests
from playwright.sync_api import expect


class TestMainDashboard:
    def test_dashboard_overview_general(self, test_org_context, login_page, frontend_path, extended_test_data):
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
            if kpi == 'avg_sentiment':
                container_str = f"{title}{change_str}%{overview[kpi][latest_month]:.1f}/5{latest_month_str}"
            elif kpi == 'avg_duration':
                duration_str = time.strftime('%H:%M:%S', time.gmtime(overview[kpi][latest_month]))
                container_str = f"{title}{change_str}%{duration_str}{latest_month_str}"
            else:
                container_str = f"{title}{change_str}%{overview[kpi][latest_month]:.0f}{latest_month_str}"
            expect(login_page.get_by_text(container_str)).to_be_visible()

        # Check most popular topic is shown
        topic_regex = re.compile(rf"^{overview['most_popular_topic'][latest_month]}$")
        expect(login_page.get_by_role("paragraph").filter(has_text=topic_regex)).to_be_visible()

    def test_dashboard_overview_topics(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that the per topic overview is visible in the resulting UI
        """
        # Retrieve Organization Overview per Topic
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/organizations/overview/",
          params={'per_topic': True},
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        resp_json = resp.json()
        overview = resp_json.get(test_org_context['org_id'])

        login_page.goto(f"{frontend_path}/dashboard")

        # Check that per-topic KPIs are visible
        for topic_name, topic_data in overview.items():
            kpi_order = sorted([month for month in topic_data['count'].keys() if month != 'change'])
            kpi_order.reverse()
            frequency = ''.join([f'{topic_data['count'][month]:.0f}' for month in kpi_order])
            engagement = '51'.join([f"{topic_data['avg_sentiment'][month]:.0f}" for month in kpi_order])
            expect(login_page.get_by_role("link", name=topic_name)).to_be_visible()
            expect(login_page.get_by_text(f"Frequency{frequency}")).to_be_visible()
            expect(login_page.get_by_text(f"Customer Engagement1{engagement}5")).to_be_visible()

    def test_dashboard_summaries(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that topic summaries are visible in the dashboard
        """
        # Retrieve all summaries
        resp = requests.get(
            f"{test_org_context['cloud_run_host']}/api/v1/topics/all_summaries/",
            headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        summaries = resp.json()

        login_page.goto(f"{frontend_path}/dashboard")

        # Check that topic summaries are visible
        for topic_id, summary in summaries.items():
            if summary['summary_call_count'] > 0:
                summ_regex = re.compile(rf'^{summary["name"]}{summary["summary"]["Reasons for Calling"][:20]}')
                expect(login_page.get_by_text(summ_regex)).to_be_visible()



