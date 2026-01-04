import { config } from '../config/config';

/**
 * Test data for login functionality
 */
export class LoginTestData {
  public static getValidUser() {
    return config.getTestUsers().validUser;
  }

  public static getInvalidUser() {
    return config.getTestUsers().invalidUser;
  }

  public static getAdminUser() {
    return config.getTestUsers().adminUser;
  }
}

/**
 * Builder pattern for creating test data
 */
export class UserBuilder {
  private username = '';
  private password = '';
  private firstName = '';
  private lastName = '';
  private address = '';
  private city = '';
  private state = '';
  private zipCode = '';
  private phone = '';
  private ssn = '';

  public withUsername(username: string): UserBuilder {
    this.username = username;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  public withFirstName(firstName: string): UserBuilder {
    this.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): UserBuilder {
    this.lastName = lastName;
    return this;
  }

  public withAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  public withCity(city: string): UserBuilder {
    this.city = city;
    return this;
  }

  public withState(state: string): UserBuilder {
    this.state = state;
    return this;
  }

  public withZipCode(zipCode: string): UserBuilder {
    this.zipCode = zipCode;
    return this;
  }

  public withPhone(phone: string): UserBuilder {
    this.phone = phone;
    return this;
  }

  public withSSN(ssn: string): UserBuilder {
    this.ssn = ssn;
    return this;
  }

  public build() {
    return {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      phone: this.phone,
      ssn: this.ssn
    };
  }

  /**
   * Create a valid user with default test data
   */
  public static defaultValidUser(): UserBuilder {
    const timestamp = Date.now();
    return new UserBuilder()
      .withUsername(`testuser_${timestamp}`)
      .withPassword('Test@1234')
      .withFirstName('John')
      .withLastName('Doe')
      .withAddress('123 Test Street')
      .withCity('TestCity')
      .withState('CA')
      .withZipCode('12345')
      .withPhone('555-1234')
      .withSSN('123-45-6789');
  }
}

/**
 * Generate random test data
 */
export class TestDataGenerator {
  public static randomString(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static randomEmail(): string {
    return `test_${this.randomString(8)}@example.com`;
  }

  public static randomNumber(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static randomPhoneNumber(): string {
    return `555-${this.randomNumber(1000, 9999)}`;
  }

  public static randomSSN(): string {
    return `${this.randomNumber(100, 999)}-${this.randomNumber(
      10,
      99
    )}-${this.randomNumber(1000, 9999)}`;
  }

  public static randomZipCode(): string {
    return this.randomNumber(10000, 99999).toString();
  }
}
