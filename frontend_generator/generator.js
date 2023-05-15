const handlebars = require("handlebars");
const fs = require("fs/promises");
const axios = require("axios");

class FrontendGenerator {
  constructor(templatesDir) {
    this.Handlebars = handlebars;
    this.api = axios.create({
      baseURL: process.env.BASE_URL || "127.0.0.1",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    this.templatesDir = templatesDir;
    this.initHelpers();
  }

  initHelpers() {
    this.Handlebars.registerHelper("toLowerCase", function (str) {
      return str.toLowerCase();
    });
    this.Handlebars.registerHelper("capitalize", function (str) {
      return str[0].toUpperCase() + str.slice(1);
    });
    this.Handlebars.registerHelper("stringArray", function (arr) {
      return JSON.stringify(arr).replaceAll("\"", "'");
    });
    this.Handlebars.registerHelper({
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
        return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      }
    });
  }

  async generateCode() {
    const modelsInfo = await this.fetchModelsInfo();
    this.generateFile(
      "routes.hbs",
      "../vue_app/src/router/admin.ts",
      modelsInfo
    );
    Object.entries(modelsInfo.models).forEach(([modelName, { fields }]) => {
      this.generateFile(
        "modelTable.hbs",
        `../vue_app/src/views/admin/${modelName}Table.vue`,
        { modelName },
      );
      this.generateFile(
        "modelItem.hbs",
        `../vue_app/src/views/admin/${modelName}Item.vue`,
        { modelName, fields },
      );
    });
  }

  async fetchModelsInfo() {
    // const { data } = await this.api.get("/models/list");
    // return data;
    return {
      models: {
        User: {
          fields: [
            {
              type: "input",
              inputType: "string",
              label: "ID",
              model: "id",
              disabled: true
            },
            {
              type: "input",
              inputType: "string",
              label: "Name",
              model: "name",
              placeholder: "Fill in name",
              required: true
            },
            {
              type: "input",
              inputType: "string",
              label: "Surname",
              model: "surname",
              placeholder: "Fill in surname",
            },
            {
              type: "input",
              inputType: "number",
              label: "Age",
              model: "age",
            },
            {
              type: "input",
              inputType: "string",
              label: "Email",
              model: "email",
              placeholder: "Fill in email",
            },
            {
              type: "input",
              inputType: "string",
              label: "Address",
              model: "address",
              placeholder: "Fill in address",
              required: true,
            },
          ],
        },
        Pet: {
          fields: [
            {
              type: "input",
              inputType: "string",
              label: "ID",
              model: "id",
              disabled: true
            },
            {
              type: "input",
              inputType: "string",
              label: "Name",
              model: "name",
              placeholder: "Fill in name",
              required: true
            },
            {
              type: "select",
              label: "Skills",
              model: "skills",
              options: ["Javascript", "VueJS", "CSS3", "HTML5"]
            },
            {
              type: "input",
              inputType: "email",
              label: "E-mail",
              model: "email",
              placeholder: "E-mail address"
            },
            {
              type: "checkbox",
              label: "Status",
              model: "status",
              default: true
            }
          ],
        }
      }
    };
  }

  async generateFile(templateName, outputName, data) {
    if (!data) {
      throw new Error("Data not specified, cannot render template");
    }
    const source = await this.readFile(`${this.templatesDir}/${templateName}`);
    const res = this.renderTemplate(source, data);
    await this.writeFile(outputName, res);
  }

  async readFile(filename) {
    return await fs.readFile(filename, { encoding: "utf8" });
  }

  async writeFile(filename, data) {
    return await fs.writeFile(filename, data, { encoding: "utf8", flag: "w" })
  }

  renderTemplate(source, data) {
    const template = this.Handlebars.compile(source);
    return template(data);
  }
}

module.exports = FrontendGenerator;
