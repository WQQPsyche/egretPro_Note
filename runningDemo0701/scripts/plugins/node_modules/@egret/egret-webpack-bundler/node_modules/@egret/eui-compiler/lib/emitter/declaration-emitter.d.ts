import { BaseEmitter } from ".";
import { AST_Skin } from "../exml-ast";
export declare class DeclarationEmitter extends BaseEmitter {
    private declaration;
    getResult(): string;
    emitHeader(themeData: any): void;
    emitSkinNode(filename: string, skinNode: AST_Skin): void;
    generateText(className: string, moduleName: string): string;
}
