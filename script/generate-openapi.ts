import fs from "fs";
import { generateSwaggerDocs } from "../config/swagger";

const swaggerOptions: object = generateSwaggerDocs();

fs.writeFileSync("./openapi.json", JSON.stringify(swaggerOptions, null, 2));

console.log("OpenAPI specification generated successfully!");