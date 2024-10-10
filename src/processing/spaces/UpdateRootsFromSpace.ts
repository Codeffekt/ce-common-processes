import {
    FormInstance,
    FormInstanceExt, FormRoot,
    FormSpaceEditorFormatWrapper, FormUtils, FormWrapper
} from "@codeffekt/ce-core-data";
import { IndexType } from "@codeffekt/ce-core-data/dist/public-api";
import { Inject, RemoteApiService } from "@codeffekt/ce-node-express";
import { ProcessingListener } from "@codeffekt/ce-node-worker";
import { FormsOperator } from "../forms-operations/FormsOperator";
import { DbArrayRes } from "@codeffekt/ce-core-data/dist/core/core.model";

export class UpdateRootsFromSpace {

    static PROCESSING_NAME = "update-roots-from-space";

    static getFactoryElt() {
        return (p: ProcessingListener) => {
            const processing = new UpdateRootsFromSpace(p);
            return processing.execute();
        };
    }

    private processingForm: FormInstanceExt;
    private spaceWrapper: FormSpaceEditorFormatWrapper;
    private roots: FormRoot[] = [];

    @Inject(RemoteApiService)
    private formsService: RemoteApiService;

    private constructor(private processingListener: ProcessingListener) {
        this.processingForm = this.processingListener.getContext().processing;
    }

    private async execute(): Promise<void> {
        // retrieve the space
        await this.retrieveSpace();

        // retrieve all the roots from the space
        await this.retrieveRoots();

        // upgrade all the forms
        await this.upgradeForms();
    }

    private async retrieveSpace() {
        const paramsForm = FormUtils.getFormField("params", this.processingForm);
        console.log(paramsForm);

        const spaceForm = await this.formsService.getFormQueryGeneric(
            FormWrapper.getFormValue("space", paramsForm),
            {
                extMode: true
            }
        );

        this.spaceWrapper = new FormSpaceEditorFormatWrapper(spaceForm);
    }

    private async retrieveRoots() {

        const elts = await this.formsService.getFormsRootQuery({
            limit: 0,
            ref: this.spaceWrapper.getRootsRef()
        });

        this.roots = elts.elts;

        console.log(this.roots);
    }

    private async upgradeForms() {

        for(const root of this.roots) {
            await this.upgradeFormsFromRoot(root.id);
        }

    }

    private upgradeFormsFromRoot(root: IndexType) {

        return FormsOperator.fromQuery(
            {
                queryFields: [{
                    op: "=",
                    onMeta: true,
                    field: "root",
                    value: root
                }]
            }, {
                operate: async (res: DbArrayRes<FormInstance>) => {
                    const indices = res.elts.map(elt => elt.id);
                    await this.formsService.formMutation({
                        indices,
                        type: "form",
                        op: "upgrade",
                        root,
                    })
                }
            }
        );

    }
}