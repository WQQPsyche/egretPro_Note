/// <reference types="node" />
export declare class CachedFile {
    private compiler;
    filePath: string;
    private hash;
    constructor(filePath: string, compiler: import("webpack").Compiler);
    update(content: string | Buffer): void;
}
