import { EditableCellConfig } from '@app/shared/components';
export class EditCellConfiguration {
    public config: any;
    constructor(cfg: EditableCellConfig) {
        this.config = cfg;
    }
}