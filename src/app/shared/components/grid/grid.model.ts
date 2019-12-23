export interface GridConfig {
    displayCheckBox?: boolean;
    gridCls?: string;
    enableCellEdit?: boolean;
    enableRowEdit?: boolean;
    noRecord?: Function;
    allItemsChecked?: Function;
    checkBoxDisable?: Function;
    allItemsSelected?: boolean;
    enableSecondHeader ? : boolean;   
}

export interface ColumnConfig {
    width?: number;
    type?: any;
    name: string;
    title?: string;
    render?: Function;
    cellClick?: Function;
    enableSorting?: boolean;
    actionItems?: any;
    sortDirection?: string;
    editable?: Function;
    cellEdit?: any;
    row?: any;
    requiredIcon?: boolean;
    sortIndex ?: string; 
    headerEdit?: any;
    headerEditable ? : boolean; 
    sub_title?: any[];
    renderColumn? : string;
    isSubHeader?: string;
    hasChild?:number;
    backgroundColor? : any;
}

export interface ActionGridItemsConfig {
    label?: string;
    actionClass?: string;
    click: Function;
    disable?: Function;
    iconClass?: string;
    btnCls?: string;
    iconTooltip: string;
    iconsTooltipMethod ? : Function;
    iconClassMethod ? : Function;
    hideBtn ? : Function;
}

export interface CellEditConfig {
    type: string;
    options?: Function;
    defaultOptionsValue? :string,
    defaultDisplayLabel ? : string,
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
    keyPress ? : Function;
    keyUp ? : Function;
    keyDown? : Function;
    onInput? : Function;
    min ? : number;
    max ? : number;
    readOnly ? : Function; 
    minDate ? : Function;
    maxDate ? : Function;
    showDefaultDate? : boolean;
    hidden ? : Function;
    defaultValue?:any;
    datepickerCls?:string;
    value ? : Function;
    name ? : string;
    checked ? : Function;
    inputClick ? : Function;
    paste ? : Function;  
    maxlength ? : number;
}

export interface HeaderEditConfig {
    type: string;
    options?: any;
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
    keyPress ? : Function;
    keyUp ? : Function;
    min ? : number;
    max ? : number;
    readOnly ? : Function; 
    minDate ? : Function;
    maxDate ? : Function;
    showDefaultDate? : boolean;
    hidden ? : Function;
    defaultValue?:any;
    datepickerCls?:string;
    value ? : Function;
    maxlength ? : number;
}