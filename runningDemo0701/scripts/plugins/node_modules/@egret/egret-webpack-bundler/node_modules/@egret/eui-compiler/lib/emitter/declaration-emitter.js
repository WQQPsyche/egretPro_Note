"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationEmitter = void 0;
var _1 = require(".");
var DeclarationEmitter = /** @class */ (function (_super) {
    __extends(DeclarationEmitter, _super);
    function DeclarationEmitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.declaration = '';
        return _this;
    }
    DeclarationEmitter.prototype.getResult = function () {
        return this.declaration;
    };
    DeclarationEmitter.prototype.emitHeader = function (themeData) {
    };
    DeclarationEmitter.prototype.emitSkinNode = function (filename, skinNode) {
        var text = this.generateText(skinNode.classname, skinNode.namespace);
        this.declaration += text;
    };
    DeclarationEmitter.prototype.generateText = function (className, moduleName) {
        var text = '';
        if (moduleName) {
            text = "declare module " + moduleName + " {\n    class " + className + " extends eui.Skin {\n    }\n}\n";
        }
        else {
            text = "class " + className + " extends eui.Skin {\n}\n";
        }
        return text;
    };
    return DeclarationEmitter;
}(_1.BaseEmitter));
exports.DeclarationEmitter = DeclarationEmitter;
