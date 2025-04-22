import re
import datetime
import requests
from playwright.sync_api import expect


class TestEmployeeManagement:
    """
    Tests for the employee management page, using the shared org creation + login context.
    """
    EMPLOYEE_DATA = {
      'first_name': 'Testy',
      'last_name': 'McGee',
      'email': 'testy.mcgee@tell-me.ch'
    }

    @staticmethod
    def get_employees(context_dict):
        """
        Helper function to fetch the current employees from the server.
        """
        next_url = f"{context_dict['cloud_run_host']}/api/v1/employees/"

        results = []
        while next_url:
            resp = requests.get(next_url, headers=context_dict['analyst_headers'])
            resp.raise_for_status()
            resp_json = resp.json()

            results.extend(resp_json['results'])
            next_url = resp_json['next']
        return results

    @staticmethod
    def create_employee_in_ui(first_name: str, last_name: str, email: str, page):
        """
        Go through the steps required in order to create an employee via the UI
        :param first_name: str, First name of employee
        :param last_name: str, Last name of employee
        :param email: str, Email of employee
        :param page: playwright page to be used for testing
        """
        page.get_by_test_id("employee-modal-button").click()
        page.get_by_test_id("first-name-input").click()
        page.get_by_test_id("first-name-input").fill(first_name)
        page.get_by_test_id("last-name-input").click()
        page.get_by_test_id("last-name-input").fill(last_name)
        page.get_by_test_id("email-input").click()
        page.get_by_test_id("email-input").fill(email)
        page.get_by_test_id("submit-button").click()

    def test_employee_kpis(self, test_org_context, login_page, frontend_path):
        # Retrieve Organization Overview
        resp = requests.get(
          f"{test_org_context['cloud_run_host']}/api/v1/organizations/{test_org_context['org_id']}",
          headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        overview = resp.json()

        login_page.goto(f"{frontend_path}/administration")

        kpi_mapping = {
            "Registered employees": "employee_count",
            "Maximum number of registered accounts": "max_user_count",
            "Conversations count": "conversation_count"
        }

        for title, field in kpi_mapping.items():
            expect(login_page.get_by_text(f"{title}{overview[field]}")).to_be_visible()

    def test_employee_create(self, test_org_context, login_page, frontend_path):
        """
        Verify that creating a new employee via the UI actually stores it in the DB.
        """

        initial_employees = self.get_employees(test_org_context)

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/administration")

        # Create a new employee
        self.create_employee_in_ui(**self.EMPLOYEE_DATA, page=login_page)

        # Verify it appears in the UI
        full_name = f'{self.EMPLOYEE_DATA["first_name"]} {self.EMPLOYEE_DATA["last_name"]}'
        expect(login_page.get_by_role("rowheader", name=full_name)).to_be_visible()
        expect(login_page.get_by_text(self.EMPLOYEE_DATA["email"])).to_be_visible()

        # Finally, confirm it was written to the DB
        updated_employees = self.get_employees(test_org_context)
        newly_added = [emp for emp in updated_employees if emp not in initial_employees]
        assert len(newly_added) == 1
        newly_added = newly_added[0]
        assert 'user' in newly_added
        for field in 'first_name', 'last_name', 'email':
            assert field in newly_added['user']
            assert newly_added['user'][field] == self.EMPLOYEE_DATA[field], "New employee not found in DB"

    def test_employee_create_duplicate_email(self, test_org_context, login_page, frontend_path):
        """
        Verify that creating a new employee with the email of an existing one raises an error
        """
        initial_employees = self.get_employees(test_org_context)

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/administration")

        # Create a new employee
        self.create_employee_in_ui(**self.EMPLOYEE_DATA, page=login_page)

        # Verify creation is not allowed in the UI
        expect(login_page.get_by_text("User with this email already")).to_be_visible()

        # Confirm no changes were done to the DB
        updated_employees = self.get_employees(test_org_context)
        newly_added = [emp for emp in updated_employees if emp not in initial_employees]
        assert len(newly_added) == 0

    def test_employee_admin_toggle(self, test_org_context, login_page, frontend_path):
        """
        Test that it's possible to give admin rights to an employee
        """

        login_page.goto(f"{frontend_path}/administration")

        full_name = f'{self.EMPLOYEE_DATA["first_name"]} {self.EMPLOYEE_DATA["last_name"]}'

        # Set as admin in the UI
        login_page.get_by_role("row", name=full_name).get_by_test_id("employee-actions").click()

        with login_page.expect_response(
            lambda r: "api/v1/employees/" in r.url and r.request.method == "PATCH" and r.status == 200
        ):
            login_page.get_by_text("Give admin permissions").click()

        # Check that the admin label appears
        expect(login_page.get_by_role("row", name=f"{full_name} Admin").get_by_test_id("admin-label")).to_be_visible()

        # Check the changes at the DB
        updated = self.get_employees(test_org_context)
        assert [emp['is_organization_admin'] for emp in updated if emp['user']['email'] == self.EMPLOYEE_DATA['email']][0]

        # Unset the admin rights
        login_page.get_by_role("row", name=f"{full_name} Admin").get_by_test_id("employee-actions").click()

        with login_page.expect_response(
            lambda r: "api/v1/employees/" in r.url and r.request.method == "PATCH" and r.status == 200
        ):
            login_page.get_by_text("Revoke admin permissions").click()

        # Check that the changes are visible
        expect(login_page.get_by_text(f"{full_name} no longer has access")).to_be_visible()

        # Check the changes at the DB
        updated = self.get_employees(test_org_context)
        assert not [emp['is_organization_admin'] for emp in updated if emp['user']['email'] == self.EMPLOYEE_DATA['email']][0]

    def test_employee_delete(self, test_org_context, login_page, frontend_path):
        """
        Test that employees can be deleted
        """
        initial_employees = self.get_employees(test_org_context)

        full_name = f'{self.EMPLOYEE_DATA["first_name"]} {self.EMPLOYEE_DATA["last_name"]}'

        # The page we get from login_page is already logged in
        login_page.goto(f"{frontend_path}/administration")

        # Delete in the UI
        login_page.get_by_role("row", name=full_name).get_by_test_id("employee-actions").click()
        login_page.get_by_text("Delete profile").click()

        with login_page.expect_response(
            lambda r: "api/v1/employees/" in r.url and r.request.method == "DELETE" and r.status == 204
        ):
            login_page.get_by_test_id("confirm-button").click()

        expect(login_page.get_by_role("rowheader", name=full_name)).not_to_be_visible()

        # Confirm deletion in the DB
        updated_employees = self.get_employees(test_org_context)
        deleted = [emp for emp in initial_employees if emp not in updated_employees]
        assert len(deleted) == 1
        assert deleted[0]['user']['email'] == self.EMPLOYEE_DATA['email']
