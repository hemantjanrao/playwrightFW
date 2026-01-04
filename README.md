# Playwright Testing Framework

A modern, scalable Playwright testing framework with enhanced architecture, comprehensive utilities, and best practices for E2E and API testing.

[![Playwright Tests](https://github.com/hemantjanrao/withplaywright/actions/workflows/playwright.yml/badge.svg)](https://github.com/hemantjanrao/withplaywright/actions/workflows/playwright.yml)

## 📊 Allure Reports
View live test reports: [https://hemantjanrao.github.io/withplaywright/](https://hemantjanrao.github.io/withplaywright/)

## ✨ Features

- **Modern Architecture**: Built on Playwright's fixture pattern for better test isolation and reusability
- **Page Object Model**: Enhanced base page with 30+ utility methods for common operations
- **Smart Logging**: Structured logger with color-coded output and Allure integration
- **Multi-Environment Support**: Easy configuration for dev, staging, and production environments
- **API Testing**: Comprehensive API helper with authentication and assertion utilities
- **Test Data Management**: Builder pattern and data generators for flexible test data creation
- **Enhanced Reporting**: Custom reporter with formatted output, test statistics, and multiple report formats
- **Type Safety**: Full TypeScript support with strict typing
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd withplaywright

# Install dependencies
yarn install
# or
npm install

# Install Playwright browsers
npx playwright install
```

## 🧪 Running Tests

```bash
# Run tests (default: Chromium only)
yarn test

# Run all browsers
yarn test:all

# Run in headed mode
yarn test:headed

# Run in debug mode
yarn test:debug

# Run with Playwright UI mode
yarn test:ui

# Run specific browser
yarn test:chromium
yarn test:firefox
yarn test:webkit

# Run mobile tests
yarn test:mobile

# Run tests by tag
yarn test:smoke
yarn test:api

# Run tests for specific environment
yarn test:env:dev
yarn test:env:staging
yarn test:env:prod
```

## 📝 Viewing Reports

```bash
# Open HTML report
yarn report:html

# Generate and open Allure report
yarn report:allure

# View trace files
yarn trace:show
```

## 🏗️ Framework Architecture

```
tests/
├── core/              # Core framework utilities
│   ├── base/          # Base classes and fixtures
│   │   ├── base.page.ts      # Enhanced base page object
│   │   ├── base.test.ts      # Deprecated (now using fixtures)
│   │   └── fixtures.ts       # Custom Playwright fixtures
│   ├── config/        # Configuration management
│   │   └── config.ts         # Multi-environment config
│   ├── data/          # Test data management
│   │   └── test-data.ts      # Test data builders
│   ├── utils/         # Utility functions
│   │   ├── logger.ts         # Structured logging
│   │   └── api-helper.ts     # API testing utilities
│   └── listners/      # Custom reporters
│       └── reporter.ts       # Enhanced test reporter
└── spec/              # Test specifications
    ├── page/          # Page object models
    │   └── login.page.ts
    ├── test.ts        # UI tests
    └── api-test.spec.ts       # API tests
```

## 📚 Writing Tests

### UI Test Example

```typescript
import { test, expect } from '../core/base/fixtures';
import { LoginTestData } from '../core/data/test-data';

test('Login test @smoke', async ({ loginPage, page }) => {
  const user = LoginTestData.getValidUser();
  
  await loginPage.navigate();
  await loginPage.login(user.username, user.password);
  
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

### API Test Example

```typescript
import { test, expect } from '../core/base/fixtures';

test('API test @api', async ({ apiHelper }) => {
  const response = await apiHelper.post('/api/endpoint', {
    data: { key: 'value' }
  });
  
  await apiHelper.assertStatusCode(response, 200);
});
```

### Creating Page Objects

```typescript
import BasePage from '../../core/base/base.page';
import { Locator, Page } from '@playwright/test';

export default class MyPage extends BasePage {
  private myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = this.page.locator('#my-button');
  }

  async clickButton() {
    await this.click(this.myButton);
  }
}
```

## 🔧 Configuration

### Environment Variables

Set the `ENVIRONMENT` variable to switch between environments:

```bash
ENVIRONMENT=dev yarn test
ENVIRONMENT=staging yarn test
ENVIRONMENT=prod yarn test
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Timeout settings
- Browser configurations
- Reporter options
- Retry strategies
- Screenshot/video capture

## 🛠️ Tech Stack

- **Playwright** - Modern end-to-end testing framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - JavaScript runtime
- **Allure** - Beautiful test reporting
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 📖 Best Practices

1. **Use Fixtures**: Import test and expect from `./fixtures` for automatic setup
2. **Page Objects**: Keep selectors and actions in page object classes
3. **Test Data**: Use the test data builder pattern for creating test data
4. **Logging**: Use the logger utility for structured, searchable logs
5. **Assertions**: Add descriptive messages to assertions for better error reporting
6. **Tags**: Tag tests (@smoke, @api, @regression) for easier filtering

## 🤝 Contributing

1. Run linting before committing: `yarn lint`
2. Format code: `yarn format`
3. Ensure all tests pass: `yarn test:all`
4. Pre-commit hooks will run automatically via Husky

## 📄 License

ISC

## 👥 Author

Hemant Janrao

---

For more information, see the [architecture documentation](docs/ARCHITECTURE.md) and [examples](docs/EXAMPLES.md).
