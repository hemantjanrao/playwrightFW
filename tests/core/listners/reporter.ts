/* eslint-disable no-console */
import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult
} from '@playwright/test/reporter';

class EnhancedReporter implements Reporter {
  private startTime = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private totalTests = 0;

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'passed':
        return '✓';
      case 'failed':
        return '✗';
      case 'skipped':
        return '○';
      case 'timedOut':
        return '⏱';
      default:
        return '?';
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'passed':
        return '\x1b[32m'; // Green
      case 'failed':
        return '\x1b[31m'; // Red
      case 'skipped':
        return '\x1b[33m'; // Yellow
      case 'timedOut':
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m'; // Reset
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    this.totalTests = suite.allTests().length;

    console.log('\n' + '='.repeat(80));
    console.log('\x1b[36m%s\x1b[0m', '  🎭 PLAYWRIGHT TEST EXECUTION STARTED');
    console.log('='.repeat(80));
    console.log(`\x1b[90m  Total Tests: ${this.totalTests}\x1b[0m`);
    console.log(`\x1b[90m  Workers: ${config.workers}\x1b[0m`);
    console.log(`\x1b[90m  Retry: ${config.projects[0]?.retries || 0}\x1b[0m`);
    console.log('='.repeat(80) + '\n');
  }

  onTestBegin(test: TestCase): void {
    const displayName = test.title;
    const suiteName = test.parent.title;
    console.log(`\x1b[90m▶ Running: ${suiteName} > ${displayName}\x1b[0m`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const status = result.status;
    const duration = this.formatDuration(result.duration);
    const icon = this.getStatusIcon(status);
    const color = this.getStatusColor(status);
    const resetColor = '\x1b[0m';

    // Update counters
    if (status === 'passed') this.passedTests++;
    else if (status === 'failed') this.failedTests++;
    else if (status === 'skipped') this.skippedTests++;

    const displayName = test.title;
    const suiteName = test.parent.title;

    console.log(
      `${color}${icon} ${suiteName} > ${displayName}${resetColor} \x1b[90m(${duration})\x1b[0m`
    );

    // Show error details for failed tests
    if (status === 'failed' && result.error) {
      console.log(`\x1b[31m  Error: ${result.error.message}\x1b[0m`);
      if (result.error.stack) {
        const stackLines = result.error.stack.split('\n').slice(1, 4);
        stackLines.forEach((line) => {
          console.log(`\x1b[90m  ${line.trim()}\x1b[0m`);
        });
      }
    }

    // Show retry information
    if (result.retry > 0) {
      console.log(`\x1b[33m  ⟳ Retry attempt: ${result.retry}\x1b[0m`);
    }
  }

  onEnd(result: FullResult): void {
    const totalDuration = this.formatDuration(Date.now() - this.startTime);
    const overallStatus = result.status;

    console.log('\n' + '='.repeat(80));
    console.log('\x1b[36m%s\x1b[0m', '  📊 TEST EXECUTION SUMMARY');
    console.log('='.repeat(80));

    // Test statistics
    console.log(`\x1b[32m  ✓ Passed:  ${this.passedTests}\x1b[0m`);
    console.log(`\x1b[31m  ✗ Failed:  ${this.failedTests}\x1b[0m`);
    console.log(`\x1b[33m  ○ Skipped: ${this.skippedTests}\x1b[0m`);
    console.log(`\x1b[90m  ─ Total:   ${this.totalTests}\x1b[0m`);

    // Pass rate
    const passRate =
      this.totalTests > 0
        ? ((this.passedTests / this.totalTests) * 100).toFixed(1)
        : 0;
    console.log(`\x1b[36m  📈 Pass Rate: ${passRate}%\x1b[0m`);

    // Duration
    console.log(`\x1b[90m  ⏱  Duration: ${totalDuration}\x1b[0m`);

    // Overall status
    const statusColor = overallStatus === 'passed' ? '\x1b[32m' : '\x1b[31m';
    console.log(
      `${statusColor}  Status: ${overallStatus.toUpperCase()}\x1b[0m`
    );

    console.log('='.repeat(80) + '\n');
  }

  onError(error: Error): void {
    console.error('\x1b[31m  ❌ Unexpected Error:\x1b[0m', error.message);
  }
}

export default EnhancedReporter;
