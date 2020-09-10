export interface ThemeData {
    skins: {
        [componentName: string]: string;
    };
    autoGenerateExmlsList: boolean;
    exmls: string[];
}
export declare class ThemeFile {
    private projectRoot;
    filePath: string;
    data: ThemeData;
    private _dependenceMap;
    private _preloads;
    constructor(projectRoot: string, filePath: string);
    sort(exmls: any[], clear?: boolean): void;
    private getDependence;
    private getDependenceClasses;
    private sortExmls;
    private sortFileName;
}
