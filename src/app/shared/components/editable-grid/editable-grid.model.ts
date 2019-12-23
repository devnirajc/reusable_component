import { ValidatorFn } from '@angular/forms';
export interface EditableGridColConfig {
    validation?: ValidatorFn[];
    name?: any;
    title?: any;
    width?: any;
    sub_title?: any[];
    render?: Function;
    dblclick?: Function;
    type?: any;
    editCell?: any;
    keyPress?: Function;
    editable?: Function;
    ruleId?: any;
    backgroundColor?: any;
    rowSpan?: Function;
    isSubHeader?: string;
    renderColumn?: any;
    renderHeader?: string;
    hasChild?: number;
    showField?: boolean;
    actionItems?: any;
    enableSorting?: boolean;
    sortDirection?: string;
    sortIndex?: string;
    validate?: boolean;
    tooltip?: Function;
    hasClass?: any;
}

export interface EditableGridConfig {
    noRecord?: Function;
}

export interface EditableCellConfig {
    type: string;
    options?: Function;
    defaultOptionsValue?: string,
    defaultDisplayLabel?: string,
    blur?: Function;
    change?: Function;
    placeholder?: string;
    disabled?: Function;
    displayCellEdit?: boolean;
    errorMsg?: string;
    subType?: string;
    printErrorMsg?: Function;
    showErrorMsg?: Function;
    dirty?: boolean;
    focus?: Function;
    inputClass?: string;
    keyPress?: Function;
    keyUp?: Function;
    keyDown?: Function;
    min?: number;
    max?: number;
    readOnly?: Function;
    minDate?: Function;
    maxDate?: Function;
    showDefaultDate?: boolean;
    hidden?: Function;
    defaultValue?: any;
    datepickerCls?: string;
    value?: Function;
    name?: string;
    checked?: Function;
    inputClick?: Function;
    paste?: Function;
    maxlength?: number;
    focusout?: Function;
    validate?: boolean;
    tooltip?: Function;
}

export interface EditableGridActionItemConfig {
    label?: string;
    actionClass?: string;
    click: Function;
    disable?: Function;
    iconClass?: string;
    btnCls?: string;
    iconTooltip: string;
    iconsTooltipMethod?: Function;
    iconClassMethod?: Function;
    hideBtn?: Function;
}



