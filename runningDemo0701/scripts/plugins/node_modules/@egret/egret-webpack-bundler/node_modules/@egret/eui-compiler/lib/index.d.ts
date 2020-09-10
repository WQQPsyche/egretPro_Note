import { DeclarationEmitter, JavaScriptEmitter, JSONEmitter } from './emitter';
import { AST_Skin } from './exml-ast';
import { ThemeFile } from './theme';
export declare const parser: typeof import("./util/parser");
export declare const emitter: {
    JavaScriptEmitter: typeof JavaScriptEmitter;
    JSONEmitter: typeof JSONEmitter;
    DeclarationEmitter: typeof DeclarationEmitter;
};
export declare type EuiAstTransformer = (ast: AST_Skin) => AST_Skin;
export declare class EuiCompiler {
    private mode;
    private _transformers;
    constructor(root: string, mode?: string);
    setCustomTransformers(transformers: EuiAstTransformer[]): void;
    emit(): {
        filename: string;
        content: string;
    }[];
    getThemes(): ThemeFile[];
}
