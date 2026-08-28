import path from "path";
import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import env from "../env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test APP API",
      description: "API endpoints for a test app services documented on swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: env.app.baseUrl,
        description: "API Base URL",
      },
    ],
  },

  // looks for configuration in specified directories
  apis: [path.join(__dirname, "../controllers/**/*.controller.{js,ts}")],
};
const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app: Express) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
