"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var eui_compiler_1 = require("@egret/eui-compiler");
var path = __importStar(require("path"));
var file_1 = require("./file");
// import FileCacheWriter from './FileCacheWriter';
var utils = __importStar(require("./utils"));
var ThemePlugin = /** @class */ (function () {
    function ThemePlugin(options) {
        this.buildTimestamp = 0;
        this.options = __assign({ dirs: ['resource/eui_skins', 'resource/skins'], exmlDeclare: 'libs/ExmlDeclare.ts' }, options);
    }
    ThemePlugin.prototype.apply = function (compiler) {
        var _this = this;
        this.errors = [];
        this.fs = compiler.inputFileSystem;
        this.compiler = compiler;
        this.dirs = this.options.dirs.map(function (dir) { return path.join(compiler.context, dir); });
        var pluginName = this.constructor.name;
        var euiCompiler = new eui_compiler_1.EuiCompiler(compiler.context);
        var theme = euiCompiler.getThemes()[0];
        var outputFilename = theme.filePath.replace(".thm.json", ".thm.js");
        var thmJSPath = path.join(compiler.context, outputFilename);
        utils.addWatchIgnore(compiler, thmJSPath);
        this.thmJS = new file_1.CachedFile(thmJSPath, compiler);
        // if (this.options.thmJSON) {
        //     const thmJSONPath = path.join(compiler.context, this.options.thmJSON);
        //     utils.addWatchIgnore(compiler, thmJSONPath);
        //     // this.thmJSON = new FileCacheWriter(thmJSONPath);
        // }
        if (this.options.exmlDeclare) {
            var exmlDeclarePath = path.join(compiler.context, this.options.exmlDeclare);
            utils.addWatchIgnore(compiler, exmlDeclarePath);
            // this.exmlDeclare = new FileCacheWriter(exmlDeclarePath);
        }
        var requires = theme.data.exmls.map(function (exml) { return "require(\"./" + path.relative(path.dirname(theme.filePath), exml).split("\\").join("/") + "\");"; });
        var content = "window.skins = window.skins || {};\n    window.generateEUI = window.generateEUI || {\n      paths: {},\n      styles: undefined,\n      skins: " + JSON.stringify(theme.data.skins, null, '\t') + ",\n    };\n    " + requires.join('\n') + "\n    module.exports = window.generateEUI;\n    ";
        //   if (utils.isHot(this.compiler)) {
        //     content += '\nif (module.hot) { module.hot.accept(); }';
        //   }
        var beforeRun = function (_compiler, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (this.needRebuild(compiler.contextTimestamps)) {
                //     this.ret = await this.make(); // cached ret
                //     this.generateThmJS(this.ret);
                //     this.thmJSON && this.generateThmJSON(this.ret);
                //     this.exmlDeclare && this.generateExmlDeclare(this.ret);
                //     this.buildTimestamp = Date.now();
                // }
                // // invoke themePluginResult
                // compiler.hooks.themePluginResult.call(this.ret);
                // callback();
                this.thmJS.update(utils.generateContent(content));
                // 更新文件系统缓存状态
                utils.updateFileTimestamps(this.compiler, this.thmJS.filePath);
                callback();
                return [2 /*return*/];
            });
        }); };
        compiler.hooks.watchRun.tapAsync(pluginName, beforeRun);
        compiler.hooks.beforeRun.tapAsync(pluginName, beforeRun);
        // this.thmJS.update(utils.generateContent(content));
        // // 更新文件系统缓存状态
        // utils.updateFileTimestamps(this.compiler, this.thmJS.filePath);
        // 扩展
        // compiler.hooks.themePluginResult = new SyncHook(['themeResult']);
        // const beforeRun = async (_compiler, callback) => {
        //     if (this.needRebuild(compiler.contextTimestamps)) {
        //         this.ret = await this.make(); // cached ret
        //         this.generateThmJS(this.ret);
        //         this.thmJSON && this.generateThmJSON(this.ret);
        //         this.exmlDeclare && this.generateExmlDeclare(this.ret);
        //         this.buildTimestamp = Date.now();
        //     }
        //     // invoke themePluginResult
        //     compiler.hooks.themePluginResult.call(this.ret);
        //     callback();
        // };
        // compiler.hooks.watchRun.tapAsync(pluginName, beforeRun);
        // compiler.hooks.beforeRun.tapAsync(pluginName, beforeRun);
        // // 写入错误信息
        // compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
        //     compilation.errors.push(...this.errors);
        //     this.errors = [];
        // });
        // 监听文件目录
        compiler.hooks.afterCompile.tap(pluginName, function (compilation) {
            _this.dirs.forEach(function (item) {
                compilation.contextDependencies.add(item);
            });
        });
    };
    return ThemePlugin;
}());
exports.default = ThemePlugin;
