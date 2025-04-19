import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
                                                                                           
const serverUrl =
    process.env.SWAGGER_SERVER_URL || "http://localhost:8000/api/v1";
const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Management API Documentation",
            version: "1.0.0",
            description:
                "This is the API documentation for the Task Management applciation.",
        },
        server: [
            {
                url: serverUrl,
                description:
                    process.env.NODE_ENV === "production"
                        ? "Production Server"
                        : "Local Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/models/*.ts"],
};
const swaggerDocs: any = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: Express): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export const generateSwaggerDocs = (): object => {
    return swaggerJsDoc(swaggerOptions);
};

export default setupSwagger;