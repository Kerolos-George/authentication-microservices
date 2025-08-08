import axios, { AxiosInstance } from 'axios';

export class HttpService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async get(url: string, headers?: any) {
    return this.client.get(url, { headers });
  }

  async post(url: string, data: any, headers?: any) {
    return this.client.post(url, data, { headers });
  }

  async put(url: string, data: any, headers?: any) {
    return this.client.put(url, data, { headers });
  }

  async delete(url: string, headers?: any) {
    return this.client.delete(url, { headers });
  }
}