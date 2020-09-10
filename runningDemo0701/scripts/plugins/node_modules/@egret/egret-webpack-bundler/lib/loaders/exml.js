"use strict";
// const exmlLoader: webpack.loader.Loader = function (content) {
//     const result = parser.parse(content);
//     const className = result.className.replace(/^skins./, 'eui.');
//     const resource = this.resource.replace(this.rootContext || (this as any).options.context, '.');
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eui = __importStar(require("@egret/eui-compiler"));
var path = __importStar(require("path"));
//     let code = `${STATIC}
//       module.exports = ${result.code};
//       if (window.generateEUI) {
//         generateEUI.skins['${className.replace(/Skin$/, '')}'] = "${resource}";
//         generateEUI.paths['${resource}'] = window['${className}']= module.exports;
//       }
//       if (window.EXML) {
//         EXML.update('${resource}', module.exports);
//       }`;
//     if (process.env.NODE_ENV === 'production') {
//         // 内部类变量名不稳定eg: AddEntergyPanelSkin$Skin1
//         // 用terser规避一下，保证hash相同
//         code = Terser.minify(code).code;
//     }
//     return code;
// };
var exmlLoader = function (content) {
    if (!euiCompiler) {
        // euiCompiler = new eui.EuiCompiler(this.rootContext);
    }
    var parser = eui.parser, emitter = eui.emitter;
    var skinNode = parser.generateAST(content.toString());
    var jsEmitter = new emitter.JavaScriptEmitter();
    var relativePath = path.relative(this.rootContext, this.resourcePath).split("\\").join("/");
    jsEmitter.emitSkinNode(relativePath, skinNode);
    // const theme = euiCompiler.getThemes()[0]
    // generateThemeJs(this, theme);
    var result = "module.exports = " + jsEmitter.getResult() + ";";
    return result;
};
function generateThemeJs(loaderContext, theme) {
    var outputFilename = theme.filePath.replace(".thm.json", ".thm.js");
    var requires = theme.data.exmls.map(function (exml) { return "require(\"./" + path.relative(path.dirname(theme.filePath), exml).split("\\").join("/") + "\");"; });
    var content = "window.skins = window.skins || {};\nwindow.generateEUI = window.generateEUI || {\n  paths: {},\n  styles: undefined,\n  skins: " + JSON.stringify(theme.data.skins, null, '\t') + ",\n};\n" + requires.join('\n') + "\nmodule.exports = window.generateEUI;\n";
    loaderContext.emitFile(outputFilename, content, null);
}
var euiCompiler;
function getEuiCompier() {
}
exports.default = exmlLoader;
