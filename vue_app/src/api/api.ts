import axios, { type AxiosInstance } from "axios";

class Api {
  protected readonly baseUrl: string;
  protected readonly instance: AxiosInstance;

  constructor() {
    this.baseUrl = import.meta.env.BASE_URL || "127.0.0.1";
    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  }
}

class AdminApi extends Api {
  private readonly urlPrefix: string;

  constructor() {
    super();
    this.urlPrefix = "/admin";
  }

  async modelsList() {
    return await this.instance.get(`${this.urlPrefix}/models/list`);
  }

  async list(modelName: string) {
    return await this.instance.get(`${this.urlPrefix}/${modelName}`);
  }

  async getOne(modelName: string, modelId: number) {
    return await this.instance.get(`${this.urlPrefix}/${modelName}/${modelId}`);
  }

  // async getModelSchema(modelName: string) {
  //   return await this.instance.get(`${this.urlPrefix}/${modelName}/schema`);
  // }

  async create(modelName: string, modelObject: object) {
    return await this.instance.post(`${this.urlPrefix}/${modelName}`, modelObject);
  }

  async edit(modelName: string, modelId: number, modelObject: object) {
    return await this.instance.put(`${this.urlPrefix}/${modelName}/${modelId}`, modelObject);
  }

  async delete(modelName: string, modelId: number) {
    return await this.instance.delete(`${this.urlPrefix}/${modelName}/${modelId}`);
  }
}

export default {
  admin: new AdminApi(),
}
