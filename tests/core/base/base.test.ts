/**
 * Base test configuration
 *
 * NOTE: This file is now deprecated in favor of using custom fixtures.
 * Import test and expect from './fixtures' instead of '@playwright/test'
 *
 * The custom browser launch logic has been removed as it was an anti-pattern.
 * Playwright's built-in fixtures handle browser, context, and page creation automatically.
 *
 * Migration guide:
 * - Old: import { test } from '@playwright/test'; import { page } from '../core/base/base.test';
 * - New: import { test, expect } from '../core/base/fixtures';
 *
 * The new fixture-based approach provides:
 * - Automatic page object instantiation
 * - Better test isolation
 * - Simplified test code
 * - Proper cleanup
 */

// This file is kept for backwards compatibility but should not be used in new tests
export {};
