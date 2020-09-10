import { ThemeFile } from './theme';
declare type EgretProperties = {
    eui: {
        themes: string[];
    };
};
export declare function initilize(root: string): void;
export declare function getThemes(): ThemeFile[];
export declare function getFilePathRelativeProjectRoot(p: string): string;
export declare function getEgretProperties(): EgretProperties;
export {};
