import * as webpack from 'webpack';
export declare function generateContent(content: string): string;
export declare function unescapeRequire(content: string): string;
export declare function addWatchIgnore(compiler: webpack.Compiler, ignored: string): void;
export declare function isEntry(compiler: webpack.Compiler, resourcePath: string): boolean;
export declare function relative(parent: string, relative: string): string;
export declare function updateFileTimestamps(compiler: webpack.Compiler, filePath: string): void;
