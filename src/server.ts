import * as dotenv from "dotenv";
import {
    CeService, EventsRootFactory,
    FormsMessagesQueues,
    MessagesApplication, MessagesServer
} from "@codeffekt/ce-node-express";
import { FormEvent } from "@codeffekt/ce-core-data";

async function bootstrap() {

    if (process.env.ENV_SCRIPT) {
        const envScript = process.env.ENV_SCRIPT;
        dotenv.config({ path: envScript });
    }

    await CeService.get(MessagesApplication).runAppFromEnv();

    CeService.get(MessagesServer).setMessageListener<FormEvent>(
        FormsMessagesQueues.FORMS_ROOT,
        CeService.get(EventsRootFactory)
    );
}

bootstrap();