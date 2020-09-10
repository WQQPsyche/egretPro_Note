export declare function sort(theme: EgretEUIThemeConfig, exmls: EXMLFile[], clear?: boolean): void;
export interface EgretEUIThemeConfig {
    path: string;
    skins?: {
        [host: string]: string;
    };
    exmls?: Array<any>;
    autoGenerateExmlsList?: boolean;
    styles?: any;
}
export interface EXMLFile {
    filename: string;
    contents: string;
    preload?: boolean;
    theme?: string;
}
