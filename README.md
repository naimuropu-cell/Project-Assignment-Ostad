# SQA Project Assignment - Ostad

This repository contains the complete submission for the Ostad Software Quality Assurance (SQA) course project assignment. The project is divided into UI Automation (Part A), Manual Testing (Part B), and API Automation (Part D), structured with a clean Page Object Model (POM) and automated execution workflows.

---

## Tech Stack & Tools

- **UI Automation**: Playwright (`@playwright/test`) with TypeScript
- **Design Pattern**: Page Object Model (POM)
- **API Automation**: Postman & Newman (`newman`, `newman-reporter-htmlextra`)
- **Test Data**: Dynamic data generation using `@faker-js/faker`
- **Reporting**: Playwright HTML Reporter, Allure Report (`allure-playwright`), Newman HTML Extra Reporter
- **Manual Testing**: Excel (`.xlsx`), CSV, and Markdown documentation

---

## Project Structure

```text
Project-Assignment-Ostad/
│
├── automation/                        # Part A: UI Automation (Playwright POM)
│   ├── pages/                         # Page Object Model classes
│   │   ├── BasePage.ts                # Shared navigation & alert utilities
│   │   ├── LoginPage.ts               # Login locators and authentication actions
│   │   ├── DashboardPage.ts           # Header, sidebar navigation & logout
│   │   ├── PimPage.ts                 # Add employee, search & verification
│   │   ├── AdminPage.ts               # User search, edit role/status & persistence
│   │   └── LeavePage.ts               # Apply leave, My Leave verification & cancel
│   │
│   ├── tests/                         # Playwright Test Specs
│   │   ├── q1-invalid-login.spec.ts   # Q1: Invalid credentials error validation
│   │   ├── q2-add-employee.spec.ts    # Q2: Add employee (random data), search & logout
│   │   ├── q3-admin-user.spec.ts      # Q3: User search, edit role/status & persistence
│   │   ├── q4-apply-leave.spec.ts     # Q4: Apply leave, check My Leave & cancel
│   │   └── all-scenarios.spec.ts      # Full sequential test suite (Q1 - Q4)
│   │
│   └── utils/                         # Configuration and utilities
│       ├── config.ts                  # URLs and test credentials
│       └── dataGenerator.ts           # Dynamic random data generator (Faker)
│
├── api-testing/                       # Part D: API Automation
│   ├── collections/                   # Postman collection & environment
│   │   └── JsonPlaceholder_Users.postman_collection.json
│   └── runner/                        # Local CLI test runner
│       └── run-api.js                 # Newman runner with HTML Extra report
│
├── manual-testing/                    # Part B: Manual Testing
│   ├── SQA_Manual_Test_Cases.xlsx     # 12 detailed manual test cases (Excel)
│   ├── SQA_Manual_Test_Cases.csv      # CSV format for direct GitHub view
│   ├── Traceability_Matrix.md         # Requirements Traceability Matrix (RTM)
│   ├── Bug_Report_OrangeHRM.md        # Formal bug report with reproduction steps
│   └── screenshots/                   # Bug evidence screenshot
│       └── bug_evidence_empty_field_validation.png
│
├── playwright.config.ts               # Playwright test configuration
├── package.json                       # Scripts and project dependencies
├── tsconfig.json                      # TypeScript configuration
├── .gitignore                         # Ignored files (node_modules, reports, logs)
└── README.md                          # Project documentation
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18 or higher installed on your system
- **npm**: v9 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/naimuropu-cell/Project-Assignment-Ostad.git
   cd Project-Assignment-Ostad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browser binaries:
   ```bash
   npx playwright install chromium
   ```

---

## Test Execution

All test suites can be executed independently or all together via npm scripts.

### 1. Run All UI Tests Sequentially (Part A)
Executes all 4 UI scenarios (Q1 to Q4) sequentially in headless mode:
```bash
npm run test:ui
```

To run with browser visible (headed mode):
```bash
npm run test:ui:headed
```

### 2. Run UI Scenarios Individually

- **Q1: Invalid Login Error Validation** (10 Marks):
  ```bash
  npm run test:q1
  ```
- **Q2: PIM - Add Employee with Random Data & Verify** (15 Marks):
  ```bash
  npm run test:q2
  ```
- **Q3: Admin - User Search, Edit Role/Status & Persist Check** (15 Marks):
  ```bash
  npm run test:q3
  ```
- **Q4: Leave - Apply Leave, Check My Leave & Cancel** (10 Marks):
  ```bash
  npm run test:q4
  ```

### 3. Run API Automation Suite (Part D)
Executes the Postman collection via Newman locally against `https://jsonplaceholder.typicode.com/users`:
```bash
npm run test:api
```

This validates:
- GET all users returns status `200` with valid schema (`id`, `name`, `email`).
- User ID extraction into variable.
- PUT update with dynamically generated values (`name`, `email`, `company.name`).
- Status `200`, ID match, and non-empty `phone` field.

### 4. Combined Execution (UI + API)
Runs all UI tests sequentially, immediately followed by the API test suite:
```bash
npm run test:all
```

---

## Viewing Test Reports

### Playwright HTML Report
After running the UI tests, view the interactive HTML report:
```bash
npm run report:ui
```

### Newman API HTML Report
The Newman runner generates a comprehensive HTML report located at:
```text
newman/api-report.html
```
Open this file directly in any web browser to view response times, headers, payloads, and assertion results.

---

## Part B — Manual Testing Artifacts

Located inside the [`manual-testing/`](./manual-testing/) folder:
1. **[SQA_Manual_Test_Cases.xlsx](./manual-testing/SQA_Manual_Test_Cases.xlsx)** & **[.csv](./manual-testing/SQA_Manual_Test_Cases.csv)**: 12 manual test cases across Login, PIM, Admin, and Leave modules covering positive, negative, security, and boundary scenarios not duplicated in Part A.
2. **[Traceability_Matrix.md](./manual-testing/Traceability_Matrix.md)**: Requirements Traceability Matrix mapping all 16 automated and manual test cases to system features.
3. **[Bug_Report_OrangeHRM.md](./manual-testing/Bug_Report_OrangeHRM.md)**: Formal defect report (`BUG-ORANGE-001`) with severity, environment, steps to reproduce, expected vs actual result, and attached screenshot evidence.
