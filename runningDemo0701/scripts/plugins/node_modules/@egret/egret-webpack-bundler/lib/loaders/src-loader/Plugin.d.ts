import * as webpack from 'webpack';
import Factory from './Factory';
interface SrcLoaderPluginOptions {
    dirs?: string[];
}
export interface NSLoaderContext {
    factory: Factory;
    deps: string[];
}
export default class SrcLoaderPlugin {
    static NS: string;
    options: SrcLoaderPluginOptions;
    constructor(options?: SrcLoaderPluginOptions);
    private nsLoaderContext;
    private dirs;
    private listHash;
    apply(compiler: webpack.Compiler): void;
}
export {};
