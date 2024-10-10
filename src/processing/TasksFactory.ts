import { Service } from "@codeffekt/ce-node-express";
import { ProcessingListener } from "@codeffekt/ce-node-worker";
import { UpdateRootsFromSpace } from "./spaces/UpdateRootsFromSpace";
import { FormWrapper } from "@codeffekt/ce-core-data";

@Service()
export class TasksFactory {

    private elts: { [key: string]: (p: ProcessingListener) => Promise<void> } = {
        [UpdateRootsFromSpace.PROCESSING_NAME]: UpdateRootsFromSpace.getFactoryElt(),
    };

    constructor() {

    }

    async callTask(processingListener: ProcessingListener): Promise<void> {

        const processingForm = processingListener.getContext().processing;
        const name = FormWrapper.getFormValue("name", processingForm);

        const processingTask = this.elts[name];

        if(!processingTask) {
            throw new Error(`Task name ${name} not found`);
        }
        
        await processingTask(processingListener);
    }
}