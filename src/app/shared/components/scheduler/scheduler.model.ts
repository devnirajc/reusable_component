import { ValidatorFn } from '@angular/forms';
export interface SchedulerConfig {
    validation?: ValidatorFn[];
    name?: any;
    title?: any;
    width?: any;
    sub_title?: any[];
}

export interface SchedulerGridConfig {
    noRecord?: Function;
}


