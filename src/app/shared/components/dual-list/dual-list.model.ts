export interface DualListButtonsConfig {
    iconCls ? : string;
    text? : string;
    click ? : Function;
    iconTooltip ? : string;
    disabled ? : Function;
    hidden ? : Function;
    moveFrom ? : string;
    moveTo ?: string;
}