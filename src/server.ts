import * as dotenv from "dotenv";
import { CeService, MessagesApplication, MessagesServer } from "@codeffekt/ce-node-express";
import { EventsRootFactory } from "./processing/events/EventsRootFactory";

async function bootstrap() {

    if (process.env.ENV_SCRIPT) {
        const envScript = process.env.ENV_SCRIPT;
        dotenv.config({ path: envScript });
    }

    await CeService.get(MessagesApplication).runAppFromEnv();

    CeService.get(MessagesServer).setFormsRootEventListener(
        CeService.get(EventsRootFactory)
    );
}

bootstrap();