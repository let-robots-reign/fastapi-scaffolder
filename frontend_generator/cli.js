#!/usr/bin/env node

const FrontendGenerator = require("./generator");
const generator = new FrontendGenerator("templates");
generator.generateCode();
