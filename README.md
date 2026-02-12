# 🧪 SauceDemo Test Suite

[![Playwright Tests](https://i.ytimg.com/vi/jtKrINOzQ3A/maxresdefault.jpg)

A comprehensive End-to-End testing suite for [saucedemo.com](https://www.saucedemo.com) built with Playwright and TypeScript, implementing best practices and industry-standard patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Users](#test-users)
- [CI/CD](#cicd)
- [Reports](#reports)
- [Architecture](#architecture)
- [Contributing](#contributing)

## 🎯 Overview

This project demonstrates a professional-grade E2E testing setup for the SauceDemo e-commerce application. It includes:

- ✅ **100+ test cases** covering all user flows
- 🎭 **Page Object Model (POM)** pattern for maintainability
- 📊 **HTML reports** with screenshots and videos
- 🔄 **CI/CD pipeline** with GitHub Actions
- 🌐 **Cross-browser testing** (Chrome, Firefox, Safari)
- 📱 **Mobile testing** (Chrome Mobile, Safari Mobile)
- 🎨 **TypeScript** for type safety
- 📦 **Monorepo structure** for scalability

## ✨ Features

### Test Coverage

- **Authentication Tests**
  - Login with all user types (standard, problem, performance_glitch, error, visual)
  - Login failures (locked_out_user, invalid credentials)
  - Input validation and error messages
  - Logout functionality

- **Product Tests**
  - Product display and listing
  - Product sorting (name A-Z, Z-A, price low-high, high-low)
  - Product details page
  - Add/remove items to/from cart

- **Cart Tests**
  - Cart navigation
  - Empty cart handling
  - Cart item management
  - Cart badge updates
  - Cart persistence

- **Checkout Tests**
  - Complete checkout flow (3 steps)
  - Form validation
  - Order summary verification
  - Tax and total calculations
  - Order completion

- **Navigation Tests**
  - Burger menu functionality
  - Page navigation
  - Browser back/forward buttons
  - URL verification
  - Footer links

- **API/Data Layer Tests**
  - User session management
  - Cart state persistence
  - Product data integrity
  - State management during checkout
  - Error handling and validation

## 📁 Project Structure

```
saucedemo-test-suite/
├── .github/
│   └── workflows/
│       └── test.yml                 # GitHub Actions CI/CD pipeline
├── tests/
│   ├── e2e/
│   │   ├── auth.spec.ts            # Authentication tests
│   │   ├── products.spec.ts        # Product browsing & filtering
│   │   ├── cart.spec.ts            # Cart management tests
│   │   ├── checkout.spec.ts        # Checkout flow tests
│   │   └── navigation.spec.ts      # Navigation tests
│   ├── api/
│   │   └── data-layer.spec.ts      # API/Data layer tests
│   └── fixtures/
│       ├── test-users.ts           # Test user credentials
│       └── test-data.ts            # Test data & constants
├── page-objects/
│   ├── base.page.ts                # Base page with common methods
│   ├── login.page.ts               # Login page object
│   ├── inventory.page.ts           # Products/Inventory page object
│   ├── product-details.page.ts     # Product details page object
│   ├── cart.page.ts                # Cart page object
│   ├── checkout-step-one.page.ts   # Checkout info page object
│   ├── checkout-step-two.page.ts   # Checkout overview page object
│   └── checkout-complete.page.ts   # Order complete page object
├── utils/
│   ├── constants.ts                # App constants & selectors
│   └── helpers.ts                  # Helper functions
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

## 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/saucedemo-test-suite.git
cd saucedemo-test-suite
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npx playwright install
```

## 🚀 Running Tests

### Run all tests

```bash
npm test
```

### Run E2E tests only

```bash
npm run test:e2e
```

### Run API tests only

```bash
npm run test:api
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run tests with UI mode

```bash
npm run test:ui
```

### Run specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run specific test file

```bash
npx playwright test tests/e2e/auth.spec.ts
```

### Run specific test by name

```bash
npx playwright test -g "should login successfully"
```

## 👥 Test Users

The following test users are available on saucedemo.com:

| Username              | Password     | Description                                      |
|-----------------------|--------------|--------------------------------------------------|
| `standard_user`       | `secret_sauce` | Standard user with full access                  |
| `locked_out_user`     | `secret_sauce` | User that has been locked out                   |
| `problem_user`        | `secret_sauce` | User with issues (images, sorting)              |
| `performance_glitch_user` | `secret_sauce` | User experiencing performance issues         |
| `error_user`          | `secret_sauce` | User encountering errors during checkout        |
| `visual_user`         | `secret_sauce` | User for visual testing                         |

**Note:** All users share the same password: `secret_sauce`

## 🔄 CI/CD

### GitHub Actions

The project includes a comprehensive CI/CD pipeline that:

1. **Runs on**:
   - Push to `main`, `master`, or `develop` branches
   - Pull requests to these branches
   - Manual workflow dispatch

2. **Test Matrix**:
   - Desktop browsers: Chrome, Firefox, Safari
   - Mobile browsers: Chrome Mobile, Safari Mobile

3. **Artifacts**:
   - Test results (JSON, JUnit XML)
   - HTML reports
   - Screenshots on failure
   - Videos on failure

4. **Reports**:
   - Automatically uploaded as workflow artifacts
   - **Automatically deployed to GitHub Pages** after each test run

### Viewing Reports from Artifacts

After the workflow completes:

1. Go to the **Actions** tab in GitHub
2. Click on the workflow run
3. Download the **playwright-report** artifact
4. Extract and open `index.html`

### 🌐 GitHub Pages - Automatic Report Publishing

Test reports are automatically published to GitHub Pages after each push to `main` or `master` branch. This provides a convenient way to view the latest test results without downloading artifacts.

#### Enabling GitHub Pages (Required One-Time Setup)

To enable automatic report deployment, you need to configure GitHub Pages in your repository settings:

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on **Settings** tab

2. **Configure GitHub Pages**
   - In the left sidebar, click **Pages** (under "Code and automation")
   - Under **Build and deployment**:
     - **Source**: Select **GitHub Actions**
   - Click **Save** if prompted

3. **Verify Workflow Permissions**
   - Go to **Settings** → **Actions** → **General**
   - Scroll to **Workflow permissions**
   - Ensure **Read and write permissions** is selected
   - Check **Allow GitHub Actions to create and approve pull requests** if needed

#### Accessing Published Reports

Once GitHub Pages is enabled and the workflow runs:

- **Report URL format**: `https://<username>.github.io/<repository-name>/`
- Example: `https://yourname.github.io/saucedemo-test-suite/`

The report will be automatically updated after each successful workflow run on `main` or `master` branch.

#### Important Notes

- Reports are deployed **even if tests fail** (so you can always see what went wrong)
- Reports are only deployed from `main` and `master` branches (not from pull requests)
- The `.nojekyll` file ensures GitHub Pages serves the report correctly without Jekyll processing
- Previous reports are overwritten with each new deployment

## 📊 Reports

### HTML Report

After running tests locally, view the HTML report:

```bash
npm run report
```

This opens an interactive report showing:
- Test results by browser
- Screenshots on failure
- Video recordings on failure
- Execution traces
- Test duration and statistics

### Report Features

- 📸 **Screenshots**: Captured on test failures
- 🎥 **Videos**: Recorded for failed tests
- 📈 **Traces**: Full execution traces for debugging
- 📊 **Statistics**: Pass/fail rates, duration, trends

## 🏗️ Architecture

### Page Object Model (POM)

The project follows the Page Object Model pattern:

```typescript
// Example: LoginPage
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Benefits

- **Maintainability**: Changes in UI require updates in one place
- **Reusability**: Page objects can be reused across tests
- **Readability**: Tests read like user stories
- **Type Safety**: TypeScript ensures correct usage

### Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('should do something', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 🎨 Code Quality

### TypeScript

All code is written in TypeScript for:
- Type safety
- Better IDE support
- Easier refactoring
- Self-documenting code

### Linting & Formatting

```bash
# Add these scripts to package.json if needed
npm run lint
npm run format
```

## 🐛 Debugging

### Debug specific test

```bash
npx playwright test tests/e2e/auth.spec.ts --debug
```

### Show browser while testing

```bash
npx playwright test --headed
```

### Slow down execution

```bash
npx playwright test --headed --slow-mo=1000
```

### Open Playwright Inspector

```bash
npx playwright test --debug
```

## 📝 Writing New Tests

### 1. Create Page Object (if needed)

```typescript
// page-objects/new-page.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NewPage extends BasePage {
  readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = page.locator('.selector');
  }

  async doSomething(): Promise<void> {
    await this.element.click();
  }
}
```

### 2. Create Test File

```typescript
// tests/e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test';
import { NewPage } from '../../page-objects/new-page.page';

test.describe('New Feature', () => {
  let newPage: NewPage;

  test.beforeEach(async ({ page }) => {
    newPage = new NewPage(page);
  });

  test('should work correctly', async () => {
    await newPage.doSomething();
    expect(true).toBeTruthy();
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Testing framework
- [SauceDemo](https://www.saucedemo.com) - Test application
- [TypeScript](https://www.typescriptlang.org/) - Programming language

## 📞 Support

For questions or issues:
- Open an [issue](https://github.com/yourusername/saucedemo-test-suite/issues)
- Check [Playwright documentation](https://playwright.dev/docs/intro)

## 🎯 Roadmap

- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Add accessibility tests (a11y)
- [ ] Add API contract tests
- [ ] Add database state verification
- [ ] Add test data generation
- [ ] Add parallel execution optimization
- [ ] Add test coverage reporting

---

**Happy Testing! 🎭**
