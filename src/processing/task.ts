import { ProcessingListener } from "@codeffekt/ce-node-worker";

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function task(processingListener: ProcessingListener) {

    console.log(processingListener.getContext());

    await timeout(3000);

    processingListener.onUpdate({ message: "Still running"});

    await timeout(5000);

    processingListener.onUpdate({ message: "Still still running"});   
    
    await timeout(4000);

    processingListener.onDone({ message: "End of processing"});
}


