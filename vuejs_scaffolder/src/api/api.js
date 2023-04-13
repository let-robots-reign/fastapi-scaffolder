import axios from "axios";

class Api {
  constructor() {
    this.baseUrl = import.meta.env.BASE_URL;
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
  constructor(props) {
    super(props);
    this.urlPrefix = "/admin";
  }

  async modelsList() {
    return await this.instance.get(`${this.urlPrefix}/models/list`);
  }

  async list(modelName) {
    return await this.instance.get(`${this.urlPrefix}/${modelName}`);
  }

  async getOne(modelName, modelId) {
    return await this.instance.get(`${this.urlPrefix}/${modelName}/${modelId}`);
  }

  async create(modelName, modelObject) {
    return await this.instance.post(`${this.urlPrefix}/${modelName}`, modelObject);
  }

  async edit(modelName, modelId, modelObject) {
    return await this.instance.put(`${this.urlPrefix}/${modelName}/${modelId}`, modelObject);
  }

  async delete(modelName, modelId) {
    return await this.instance.delete(`${this.urlPrefix}/${modelName}/${modelId}`);
  }
}

export default {
  admin: new AdminApi(),
}
