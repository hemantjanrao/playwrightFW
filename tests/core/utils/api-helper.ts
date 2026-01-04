import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { logger } from './logger';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string | number>;
  form?: Record<string, string>;
}

export class ApiHelper {
  private request: APIRequestContext;
  private authToken?: string;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Set authentication token for subsequent requests
   * @param token - Authentication token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    logger.info('Authentication token set');
  }

  /**
   * Clear authentication token
   */
  public clearAuthToken(): void {
    this.authToken = undefined;
    logger.info('Authentication token cleared');
  }

  /**
   * Get default headers including auth token if set
   * @param customHeaders - Additional headers to merge
   * @returns Merged headers object
   */
  private getHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Perform GET request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async get(
    url: string,
    options?: ApiRequestOptions
  ): Promise<APIResponse> {
    logger.info(`GET request to: ${url}`, options);
    const response = await this.request.get(url, {
      headers: this.getHeaders(options?.headers),
      params: options?.params
    });
    logger.info(`GET response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform POST request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async post(
    url: string,
    options?: ApiRequestOptions
  ): Promise<APIResponse> {
    logger.info(`POST request to: ${url}`, options);
    const response = await this.request.post(url, {
      headers: this.getHeaders(options?.headers),
      data: options?.data,
      form: options?.form,
      params: options?.params
    });
    logger.info(`POST response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform PUT request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async put(
    url: string,
    options?: ApiRequestOptions
  ): Promise<APIResponse> {
    logger.info(`PUT request to: ${url}`, options);
    const response = await this.request.put(url, {
      headers: this.getHeaders(options?.headers),
      data: options?.data,
      params: options?.params
    });
    logger.info(`PUT response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform DELETE request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async delete(
    url: string,
    options?: ApiRequestOptions
  ): Promise<APIResponse> {
    logger.info(`DELETE request to: ${url}`, options);
    const response = await this.request.delete(url, {
      headers: this.getHeaders(options?.headers),
      params: options?.params
    });
    logger.info(`DELETE response status: ${response.status()}`);
    return response;
  }

  /**
   * Assert response status code
   * @param response - API response
   * @param expectedStatus - Expected status code
   */
  public async assertStatusCode(
    response: APIResponse,
    expectedStatus: number
  ): Promise<void> {
    const actualStatus = response.status();
    expect(
      actualStatus,
      `Expected status ${expectedStatus} but got ${actualStatus}`
    ).toBe(expectedStatus);
    logger.info(`Status code assertion passed: ${actualStatus}`);
  }

  /**
   * Assert response contains specific data
   * @param response - API response
   * @param expectedData - Expected data in response
   */
  public async assertResponseContains(
    response: APIResponse,
    expectedData: Record<string, unknown>
  ): Promise<void> {
    const responseBody = await response.json();
    Object.keys(expectedData).forEach((key) => {
      expect(responseBody[key]).toBe(expectedData[key]);
    });
    logger.info('Response data assertion passed');
  }

  /**
   * Get response body as JSON
   * @param response - API response
   * @returns Parsed JSON response
   */
  public async getJsonResponse<T>(response: APIResponse): Promise<T> {
    const json = await response.json();
    logger.debug('Response body:', json);
    return json as T;
  }

  /**
   * Get response body as text
   * @param response - API response
   * @returns Response text
   */
  public async getTextResponse(response: APIResponse): Promise<string> {
    const text = await response.text();
    logger.debug('Response text:', text);
    return text;
  }

  /**
   * Assert response time is within acceptable range
   * @param response - API response
   * @param maxTime - Maximum acceptable response time in ms
   */
  public assertResponseTime(response: APIResponse, maxTime: number): void {
    const headers = response.headers();
    const responseTime = parseInt(headers['x-response-time'] || '0');

    if (responseTime > 0) {
      expect(
        responseTime,
        `Response time ${responseTime}ms exceeds maximum ${maxTime}ms`
      ).toBeLessThanOrEqual(maxTime);
      logger.info(
        `Response time assertion passed: ${responseTime}ms <= ${maxTime}ms`
      );
    }
  }
}
