import * as dotenv from "dotenv";
import { CeService, ProcessingApplication, Task } from "@codeffekt/ce-node-express";

async function bootstrap() {

    if (process.env.ENV_SCRIPT) {
        const envScript = process.env.ENV_SCRIPT;
        dotenv.config({ path: envScript });
    }

    CeService.get(ProcessingApplication).runAppFromEnv({
        task: new Task("../dist/server/processing/task"),
        workerModulePath: "./worker/ce-node-worker.cjs",
    });
}

bootstrap();