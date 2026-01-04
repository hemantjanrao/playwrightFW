export enum Environment {
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  LOCAL = 'local'
}

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl?: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

export interface TestUser {
  username: string;
  password: string;
}

export interface TestUsers {
  validUser: TestUser;
  invalidUser: TestUser;
  adminUser?: TestUser;
}

class ConfigManager {
  private static instance: ConfigManager;
  private currentEnv: Environment;

  private readonly configs: Record<Environment, EnvironmentConfig> = {
    [Environment.DEV]: {
      baseUrl: 'https://parabank-dev.parasoft.com',
      apiUrl: 'https://parabank-dev.parasoft.com/parabank/services',
      timeout: 30000,
      retries: 2,
      headless: true
    },
    [Environment.STAGING]: {
      baseUrl: 'https://parabank-staging.parasoft.com',
      apiUrl: 'https://parabank-staging.parasoft.com/parabank/services',
      timeout: 30000,
      retries: 2,
      headless: true
    },
    [Environment.PROD]: {
      baseUrl: 'https://parabank.parasoft.com',
      apiUrl: 'https://parabank.parasoft.com/parabank/services',
      timeout: 60000,
      retries: 1,
      headless: true
    },
    [Environment.LOCAL]: {
      baseUrl: 'https://parabank.parasoft.com',
      apiUrl: 'https://parabank.parasoft.com/parabank/services',
      timeout: 30000,
      retries: 0,
      headless: false
    }
  };

  private readonly testUsers: Record<Environment, TestUsers> = {
    [Environment.DEV]: {
      validUser: { username: 'h-janrao', password: '@Test1234' },
      invalidUser: { username: 'invalid', password: 'invalid' }
    },
    [Environment.STAGING]: {
      validUser: { username: 'h-janrao', password: '@Test1234' },
      invalidUser: { username: 'invalid', password: 'invalid' }
    },
    [Environment.PROD]: {
      validUser: { username: 'h-janrao', password: '@Test1234' },
      invalidUser: { username: 'invalid', password: 'invalid' }
    },
    [Environment.LOCAL]: {
      validUser: { username: 'h-janrao', password: '@Test1234' },
      invalidUser: { username: 'invalid', password: 'invalid' }
    }
  };

  private constructor() {
    // Get environment from env variable or default to local
    const envString =
      process.env.TEST_ENV || process.env.ENVIRONMENT || 'local';
    this.currentEnv = this.parseEnvironment(envString);
  }

  private parseEnvironment(envString: string): Environment {
    const env = envString.toLowerCase();
    switch (env) {
      case 'dev':
      case 'development':
        return Environment.DEV;
      case 'staging':
      case 'stage':
        return Environment.STAGING;
      case 'prod':
      case 'production':
        return Environment.PROD;
      case 'local':
      default:
        return Environment.LOCAL;
    }
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): EnvironmentConfig {
    return this.configs[this.currentEnv];
  }

  public getTestUsers(): TestUsers {
    return this.testUsers[this.currentEnv];
  }

  public getCurrentEnvironment(): Environment {
    return this.currentEnv;
  }

  public setEnvironment(env: Environment): void {
    this.currentEnv = env;
  }

  public get baseUrl(): string {
    return this.configs[this.currentEnv].baseUrl;
  }

  public get apiUrl(): string {
    return (
      this.configs[this.currentEnv].apiUrl ||
      this.configs[this.currentEnv].baseUrl
    );
  }

  public get timeout(): number {
    return this.configs[this.currentEnv].timeout;
  }

  public get retries(): number {
    return this.configs[this.currentEnv].retries;
  }

  public get headless(): boolean {
    return this.configs[this.currentEnv].headless;
  }
}

export const config = ConfigManager.getInstance();
