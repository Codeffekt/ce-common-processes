import { FormEvent } from '@codeffekt/ce-core-data';
import { EventListener, Service } from '@codeffekt/ce-node-express';
import { FormsRootUpdate } from './formsroot/FormsRootUpdate';

@Service()
export class EventsRootFactory implements EventListener {
    
    private elts: { [key: string]: (evt: FormEvent) => Promise<void> } = {
        "update": FormsRootUpdate.processEvent,
    };

    onMessage(evt: FormEvent) {
        const process = this.elts[evt.type];

        if(!process) {
            throw new Error(`Process for event ${evt.type} not found`);
        }

        console.log(`[EventsRootFactory] : process event ${JSON.stringify(evt)}`);

        process(evt);
    }
}