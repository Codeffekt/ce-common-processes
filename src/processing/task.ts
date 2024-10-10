import * as dotenv from "dotenv";
import { ProcessingListener } from "@codeffekt/ce-node-worker";
import { TasksFactory } from "./TasksFactory";
import { CeService, RemoteApiService } from "@codeffekt/ce-node-express";

export async function task(processingListener: ProcessingListener) {
    
    if (process.env.ENV_SCRIPT) {
        const envScript = process.env.ENV_SCRIPT;
        dotenv.config({ path: envScript });
    }

    CeService.get(RemoteApiService).setConfig({
        server: process.env.CE_FORMS_BASE_URL,
            learning: null,
            token: process.env.CE_FORMS_TOKEN,
    });

    await CeService.get(TasksFactory).callTask(processingListener);    

    processingListener.onDone({ message: "End of processing"});
}


