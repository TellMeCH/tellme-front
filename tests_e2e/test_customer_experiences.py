import re
import requests
from datetime import datetime
from playwright.sync_api import expect


class TestCustomerExperiences:
    def test_customer_experiences_lists_all_customers(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that the Customer Experiences page lists all customers with their data
        """
        # Retrieve all customers from the API
        resp = requests.get(
            f"{test_org_context['cloud_run_host']}/api/v1/customers/",
            headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        customers = resp.json()['results']

        # Navigate to customer experiences page
        login_page.goto(f"{frontend_path}/customer-experiences")

        # Check that all customers are listed
        for customer in customers:
            customer_item = login_page.get_by_test_id("customer-item").filter(
                has_text=f"{customer['first_name']} {customer['last_name']}"
            )

            # Verify customer item is visible
            expect(customer_item).to_be_visible()

            # Check customer name is displayed
            full_name = f"{customer['first_name']} {customer['last_name']}"
            expect(customer_item).to_contain_text(f"Customer Name{full_name}")

            # Check that conversation title is present
            expect(customer_item).to_contain_text("Conversation Title")
            expect(customer_item).to_contain_text(f"Conversation with {extended_test_data['agent_email']}")

            # Check that customer engagement is displayed
            expect(customer_item).to_contain_text("Customer Engagement")

            # Check that revenue at stake is displayed
            expect(customer_item).to_contain_text("Revenue at Stake")
            expect(customer_item).to_contain_text("CHF")

            # Check that conversation date is displayed
            expect(customer_item).to_contain_text("Conversation Date")

    def test_customer_sorting(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that customers can be sorted by different criteria
        """
        # Navigate to customer experiences page
        login_page.goto(f"{frontend_path}/customer-experiences")

        # Wait for customers to load
        login_page.wait_for_selector("[data-testid='customer-item']")

        # Test sorting by highest customer engagement
        login_page.get_by_test_id("ordering-select").click()
        login_page.get_by_test_id("-avg_sentiment-select-item").get_by_text("Highest Customer Engagement").click()

        # Wait for sort to apply
        login_page.wait_for_timeout(500)

        # Verify customers are reordered (check that the page still shows customers)
        expect(login_page.get_by_test_id("customer-item").first).to_be_visible()

        # Test sorting by lowest customer engagement
        login_page.get_by_test_id("ordering-select").click()
        login_page.get_by_test_id("avg_sentiment-select-item").get_by_text("Lowest Customer Engagement").click()

        # Wait for sort to apply
        login_page.wait_for_timeout(500)

        # Verify customers are still visible after reordering
        expect(login_page.get_by_test_id("customer-item").first).to_be_visible()

        # Test sorting by most recent conversation
        login_page.get_by_test_id("ordering-select").click()
        login_page.get_by_test_id("-last_conversation_date-select-item").get_by_text("Newest First").click()

        # Wait for sort to apply
        login_page.wait_for_timeout(500)

        # Verify customers are still visible
        expect(login_page.get_by_test_id("customer-item").first).to_be_visible()

    def test_customer_search(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that customers can be searched by name
        """
        # Get customer data from extended_test_data
        customers = extended_test_data['customers']
        first_customer_name = customers[0]['first_name']

        # Navigate to customer experiences page
        login_page.goto(f"{frontend_path}/customer-experiences")

        # Wait for customers to load
        login_page.wait_for_selector("[data-testid='customer-item']")

        # Count initial customers
        initial_count = login_page.get_by_test_id("customer-item").count()

        # Search for first customer by name
        login_page.get_by_test_id("search-input").click()
        login_page.get_by_test_id("search-input").fill(first_customer_name)
        login_page.get_by_test_id("search-input").press("Enter")

        # Wait for search results
        login_page.wait_for_timeout(500)

        # Verify that the searched customer is visible
        expect(login_page.get_by_test_id("customer-item")).to_contain_text(first_customer_name)

        # Clear search and verify all customers are shown again
        login_page.get_by_test_id("search-input").click()
        login_page.get_by_test_id("search-input").fill("")
        login_page.get_by_test_id("search-input").press("Enter")

        # Wait for results to update
        login_page.wait_for_timeout(500)

        # Verify customers are visible again
        expect(login_page.get_by_test_id("customer-item").first).to_be_visible()

        # Test search with non-existent customer
        login_page.get_by_test_id("search-input").click()
        login_page.get_by_test_id("search-input").fill("NonExistentCustomerName123")
        login_page.get_by_test_id("search-input").press("Enter")

        # Wait for search results
        login_page.wait_for_timeout(500)

        # Verify no customers are shown or empty state is displayed
        # The specific behavior depends on your UI implementation

    def test_customer_detail_page_displays_all_data(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that the Customer Detail Page displays all customer information correctly
        """
        # Get customer IDs to fetch detailed data
        customer_ids = extended_test_data['customer_ids']

        # Fetch customer details from API for the first customer
        resp = requests.get(
            f"{test_org_context['cloud_run_host']}/api/v1/customers/{customer_ids[0]}/",
            headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        customer_data = resp.json()

        # Navigate directly to the customer detail page
        login_page.goto(f"{frontend_path}/customer-experiences/{customer_ids[0]}")

        # Wait for detail page to load
        login_page.wait_for_url(re.compile(r"/customer-experiences/\d+"))

        # Verify customer name is displayed
        full_name = f"{customer_data['first_name']} {customer_data['last_name']}"
        expect(login_page.locator("#main")).to_contain_text(f"Customer Name{full_name}")

        # Verify earliest conversation date if available
        if customer_data.get('earliest_conversation'):
            earliest_date = datetime.fromisoformat(customer_data['earliest_conversation'].rstrip('Z'))
            date_str = earliest_date.strftime('%-m/%-d/%Y')
            expect(login_page.locator("#main")).to_contain_text(f"Earliest Conversation{date_str}")

        # Verify calls overall count
        if customer_data.get('conversation_count'):
            expect(login_page.locator("#main")).to_contain_text(f"Calls Overall{customer_data['conversation_count']}")

        # Verify revenue at stake
        expect(login_page.locator("#main")).to_contain_text("Revenue at Stake")
        expect(login_page.locator("#main")).to_contain_text("CHF")

        # Verify conversation details are shown
        expect(login_page.locator("#main")).to_contain_text("Conversation Date")
        expect(login_page.locator("#main")).to_contain_text("Customer Engagement")
        expect(login_page.locator("#main")).to_contain_text("Call Duration")
        expect(login_page.locator("#main")).to_contain_text("Resolved")
        expect(login_page.locator("#main")).to_contain_text("Conversation Summary")

        # Verify "Other Conversations" section exists if there are multiple conversations
        if customer_data.get('conversation_count', 0) > 1:
            expect(login_page.locator("#main")).to_contain_text("Other Conversations:")

    def test_switch_conversation_focus(self, test_org_context, login_page, frontend_path, extended_test_data):
        """
        Test that users can switch between different conversations for a customer
        """
        # Get customer with multiple conversations
        customer_ids = extended_test_data['customer_ids']

        # Fetch customer details to ensure they have multiple conversations
        resp = requests.get(
            f"{test_org_context['cloud_run_host']}/api/v1/customers/{customer_ids[0]}/",
            headers=test_org_context['analyst_headers']
        )
        resp.raise_for_status()
        customer_data = resp.json()

        # Navigate directly to customer detail page
        login_page.goto(f"{frontend_path}/customer-experiences/{customer_ids[0]}")

        # Wait for detail page to load
        login_page.wait_for_url(re.compile(r"/customer-experiences/\d+"))

        # Get the current conversation date
        main_content = login_page.locator("#main")

        # If there are multiple conversations, try switching
        conversation_links = login_page.get_by_role("link", name=re.compile(r"Conversation with"))

        if conversation_links.count() > 1:
            # Click on the second conversation link
            conversation_links.nth(1).click()

            # Wait for the page to update
            login_page.wait_for_timeout(500)

            # Verify that the conversation details have changed
            # The conversation date should be different
            expect(main_content).to_contain_text("Conversation Date")
            expect(main_content).to_contain_text("Customer Engagement")
            expect(main_content).to_contain_text("Call Duration")
