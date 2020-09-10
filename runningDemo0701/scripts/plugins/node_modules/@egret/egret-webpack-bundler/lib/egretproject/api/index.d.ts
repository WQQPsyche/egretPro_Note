export declare type LauncherAPI = {
    getAllEngineVersions(): {
        [version: string]: {
            version: string;
            root: string;
        };
    };
    getInstalledTools(): {
        name: string;
        version: string;
        path: string;
    }[];
    getTarget(targetName: string): string;
    getUserID(): string;
    sign(templatePath: string, uid: string): void;
};
export declare function getApi(): LauncherAPI;
