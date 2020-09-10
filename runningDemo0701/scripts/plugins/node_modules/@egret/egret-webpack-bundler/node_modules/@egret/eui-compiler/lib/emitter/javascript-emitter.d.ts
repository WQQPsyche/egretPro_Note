import { BaseEmitter } from '.';
import { AST_Skin } from "../exml-ast";
export declare class JavaScriptEmitter extends BaseEmitter {
    private mapping;
    private javascript;
    getResult(): string;
    private body;
    emitHeader(themeData: any): void;
    emitSkinNode(filename: string, skinNode: AST_Skin): void;
    generateJavaScriptAST(skinNode: AST_Skin): {
        type: string;
        body: JS_AST.Node[];
        sourceType: string;
    };
    createSkinNodeAst(skinNode: AST_Skin): {
        type: string;
        declarations: {
            type: string;
            id: JS_AST.Identifier;
            init: any;
        }[];
        kind: string;
    } | {
        type: string;
        expression: JS_AST.Node;
    };
    private emitNode;
    private emitChildren;
    private emitAttributes;
    private createNewObject;
    private writeToBody;
    private emitAttribute;
    private emitBinding;
}
declare namespace JS_AST {
    type Node = {
        type: string;
    };
    type Identifier = {
        type: "Identifier";
        name: string;
    };
    type MemberExpression = {
        type: "MemberExpression";
        computed: false;
        object: Node;
        property: Node;
    };
    type Literal = {
        type: "Literal";
        value: any;
        raw: any;
    };
}
export {};
