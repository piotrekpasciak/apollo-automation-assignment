# apollo-automation-assignment
Playwright solution to Apollo.io - Automation Testing Task

## Installation Instructions

This project uses [Playwright](https://playwright.dev/) for end-to-end and request testing. In previous 
interview steps it was mentioned that Apollo.io is planning to migrate to this tool from Cypress and I wanted to 
demonstrate I would be capable using it.

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) in v23.11 version
- npm 

### 🚀 Getting Started

1. **Clone the repository:**

    ```bash
    git clone git@github.com:piotrekpasciak/apollo-automation-assignment.git
    cd apollo-automation-assignment
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Install Playwright and required browsers:**

    ```bash
    npx playwright install
    ```

4. **Set up environment variables:**

    Copy the example .env file and fill in the required values:

    ```bash
    cp .env.example .env
    ```

5. **Run tests:**

    To run all tests:
    ```bash
    npx playwright test
    ```

    To run a specific test file:
    ```bash
    npx playwright test tests/e2e/emi-calculator/homeLoanTab.spec.ts --project=chromium
    ```

6. **View test report:** 
    After running tests, you can open the HTML test report:
    ```bash
    npx playwright show-report
    ```
