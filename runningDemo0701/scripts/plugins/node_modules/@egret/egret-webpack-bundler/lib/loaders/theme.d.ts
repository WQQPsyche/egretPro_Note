import * as webpack from 'webpack';
interface ThemePluginOptions {
    dirs?: string[];
    exmlDeclare?: string;
}
declare module 'webpack' {
    namespace compilation {
        interface CompilerHooks {
        }
    }
}
export default class ThemePlugin {
    private options;
    constructor(options: ThemePluginOptions);
    private errors;
    private fs;
    private compiler;
    private dirs;
    private thmJS;
    private ret;
    private buildTimestamp;
    apply(compiler: webpack.Compiler): void;
}
export {};
