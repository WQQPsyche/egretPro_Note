export declare type Target_Type = "web" | "native" | "mygame" | "wxgame" | "baidugame" | "qgame" | "oppogame" | "vivogame" | 'bricks' | 'ios' | 'android' | "any" | "none";
export declare type EgretProperty = {
    "engineVersion": string;
    "compilerVersion"?: string;
    "modules": EgretPropertyModule[];
    "target"?: {
        "current": string;
    };
    "template"?: {};
    "wasm"?: {};
    "native"?: {
        "path_ignore"?: string[];
    };
    "publish"?: {
        "web": number;
        "native": number;
        "path": string;
    };
    "egret_version"?: string;
};
export declare type EgretPropertyModule = {
    name: string;
    version?: string;
    path?: string;
};
export declare type Package_JSON = {
    /**
     * 废弃属性
     */
    modules?: PACKAGE_JSON_MODULE[];
    typings: string | null;
};
export declare type PACKAGE_JSON_MODULE = {
    files: string[];
    name: string;
    root: string;
};
declare type SourceCode = {
    debug: string;
    release: string;
    platform: Target_Type;
};
declare class EgretProjectData {
    private egretProperties;
    projectRoot: string;
    init(projectRoot: string): void;
    hasEUI(): boolean;
    reload(): void;
    /**
     * 获取项目的根路径
     */
    getProjectRoot(): string;
    getFilePath(fileName: string): string;
    getReleaseRoot(): string;
    getVersionCode(): number;
    getVersion(): string | undefined;
    getIgnorePath(): Array<any>;
    getCurrentTarget(): string;
    getCopyExmlList(): Array<string>;
    private getModulePath2;
    private getAbsolutePath;
    private getModulePath;
    getLibraryFolder(): string;
    getModulesConfig(platform: Target_Type): {
        name: string;
        target: SourceCode[];
        sourceDir: string;
        targetDir: string;
    }[];
    isWasmProject(): boolean;
    getResources(): string[];
    get useTemplate(): boolean;
    hasModule(name: string): boolean;
}
export declare const projectData: EgretProjectData;
declare class EgretLauncherProxy {
    getEgretToolsInstalledByVersion(checkVersion: string): string;
}
export declare var launcher: EgretLauncherProxy;
export {};
