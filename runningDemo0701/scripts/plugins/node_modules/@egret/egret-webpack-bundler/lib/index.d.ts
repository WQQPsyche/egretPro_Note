/// <reference types="node" />
import webpack from 'webpack';
export declare type WebpackBundleOptions = {
    /**
     * 设置发布的库为 library.js 还是 library.min.js
     */
    libraryType: "debug" | "release";
    /**
     * 编译宏常量定义
     */
    defines?: any;
    /**
     * 是否启动 EXML 相关功能
     */
    exml?: {
        /**
         * EXML增量编译
         */
        watch: boolean;
    };
    /**
     * TypeScript 相关配置
     */
    typescript?: {
        /**
         * 编译模式
         * modern 模式为完全ES6 Module的方式，底层实现采用 ts-loader
         * legacy 模式为兼容现有代码的方式，底层在执行 ts-loader 之前先进行了其他内部处理
         */
        mode: "legacy" | "modern";
        /**
         * 编译采用的 tsconfig.json 路径，默认为 tsconfig.json
         */
        tsconfigPath?: string;
    };
    html?: {
        templateFilePath: string;
    };
    /**
     * 是否发布子包及子包规则
     */
    subpackages?: {
        name: string;
        matcher: (filepath: string) => boolean;
    }[];
    /**
     * 自定义的 webpack 配置
     */
    webpackConfig?: webpack.Configuration | ((bundleWebpackConfig: webpack.Configuration) => webpack.Configuration);
};
export declare type WebpackDevServerOptions = {
    /**
     * 启动端口，默认值为3000
     */
    port?: number;
    /**
     * 编译完成后打开浏览器
     */
    open?: boolean;
};
export declare class EgretWebpackBundler {
    private projectRoot;
    private target;
    emitter: ((filename: string, data: Buffer) => void) | null;
    constructor(projectRoot: string, target: string);
    startDevServer(options: WebpackBundleOptions & WebpackDevServerOptions): void;
    build(options: WebpackBundleOptions): Promise<void>;
}
export declare function generateConfig(context: string, options: WebpackBundleOptions, target: string, devServer: boolean): webpack.Configuration;
