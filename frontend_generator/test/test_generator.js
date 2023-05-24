const FrontendGenerator = require("../generator");
const fs = require("fs/promises");

jest.mock("fs/promises");

describe("FrontendGenerator", () => {
  let frontendGenerator;

  beforeEach(() => {
    frontendGenerator = new FrontendGenerator("templates");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("initHelpers", () => {
    it("should register Handlebars helpers", () => {
      expect(frontendGenerator.Handlebars.registerHelper).toHaveBeenCalledTimes(4);
    });
  });

  describe("fetchModelsInfo", () => {
    it("should fetch models info from API", async () => {
      const expectedData = {
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

      const mockApiData = { data: expectedData };
      frontendGenerator.api.get = jest.fn(() => Promise.resolve(mockApiData));

      const result = await frontendGenerator.fetchModelsInfo();

      expect(result).toEqual(expectedData);
      expect(frontendGenerator.api.get).toHaveBeenCalledWith("/models/list");
    });
  });

  describe("generateFile", () => {
    it("should render and write the file", async () => {
      const templateName = "template.hbs";
      const outputName = "output.txt";
      const data = { key: "value" };
      const source = "Template source";
      const renderedTemplate = "Rendered template";

      frontendGenerator.readFile = jest.fn(() => Promise.resolve(source));
      frontendGenerator.renderTemplate = jest.fn(() => renderedTemplate);
      fs.writeFile = jest.fn();

      await frontendGenerator.generateFile(templateName, outputName, data);

      expect(frontendGenerator.readFile).toHaveBeenCalledWith(
        `templates/${templateName}`
      );
      expect(frontendGenerator.renderTemplate).toHaveBeenCalledWith(
        source,
        data
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        outputName,
        renderedTemplate,
        { encoding: "utf8", flag: "w" }
      );
    });

    it("should throw an error if data is not specified", async () => {
      const templateName = "template.hbs";
      const outputName = "output.txt";
      const data = null;

      expect(
        frontendGenerator.generateFile(templateName, outputName, data)
      ).rejects.toThrow("Data not specified, cannot render template");
    });
  });

  describe("renderTemplate", () => {
    it("should render the template with the provided data", () => {
      const source = "Template source";
      const data = { key: "value" };
      const renderedTemplate = "Rendered template";

      const mockCompile = jest.fn(() => renderedTemplate);
      frontendGenerator.Handlebars.compile = mockCompile;

      const result = frontendGenerator.renderTemplate(source, data);

      expect(mockCompile).toHaveBeenCalledWith(source);
      expect(result).toEqual(renderedTemplate);
    });
  });
});
