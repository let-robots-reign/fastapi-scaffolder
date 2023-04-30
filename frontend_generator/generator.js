const handlebars = require("handlebars");

class FrontendGenerator {
  constructor() {
    this.Handlebars = handlebars;
  }

  renderTemplate(source, data) {
    const template = this.Handlebars.compile(source);
    return template(data);
  }
}

module.exports = FrontendGenerator;
