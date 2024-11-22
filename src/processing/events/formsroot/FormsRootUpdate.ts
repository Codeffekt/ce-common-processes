import { DbArrayRes, EltNotFoundError, FormEvent, FormInstance, IndexType } from "@codeffekt/ce-core-data";
import { FormsRootService, FormUpgradeFacade, Inject } from "@codeffekt/ce-node-express";
import { FormsOperator } from "../../forms-operations/FormsOperator";

export class FormsRootUpdate {

    @Inject(FormsRootService)
    private formsRootService: FormsRootService;

    private constructor(private event: FormEvent) {

    }

    static async processEvent(event: FormEvent) {
        const updator = new FormsRootUpdate(event);
        await updator.process();
    }

    async process() {
        for (const root of this.event.elts) {
            console.log(`[FormsRootUpdate]: upgrading root ${root}`);
            await this.upgradeFormsFromRoot(root);
        }
    }

    private async upgradeFormsFromRoot(id: IndexType) {

        const root = await this.formsRootService.getFormRoot(id);

        if (!root) {
            throw new EltNotFoundError(`Cannot find root ${id}`, { id });
        }

        await FormsOperator.fromQuery(
            {
                queryFields: [{
                    op: "=",
                    onMeta: true,
                    field: "root",
                    value: id
                }]
            }, {
            operate: async (res: DbArrayRes<FormInstance>) => {                
                const op = new FormUpgradeFacade(this.event.author);
                await op.upgradeFromForms(root, res);                
            }
        });

    }
}