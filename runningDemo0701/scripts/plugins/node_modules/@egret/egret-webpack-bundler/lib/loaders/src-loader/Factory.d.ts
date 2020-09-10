/// <reference types="node" />
import * as _fs from 'fs';
import { Defines, Dependencies } from './parse';
interface FactoryOptions {
    context: string;
    fs: typeof _fs;
}
export default class Factory {
    private options;
    files: {
        [name: string]: {
            mtime: number;
            isModule: boolean;
            dependencies: Dependencies;
            defines: Defines;
        };
    };
    identifiers: {
        [name: string]: Set<string>;
    };
    constructor(options: FactoryOptions);
    get(fileName: string): {
        mtime: number;
        isModule: boolean;
        dependencies: Dependencies;
        defines: Defines;
    };
    update(): void;
    private remove;
    private add;
    private findDependencyFiles;
    sortUnmodules(): string[];
}
export {};
