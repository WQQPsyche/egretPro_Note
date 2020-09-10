"use strict";
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
exports.createLauncherLibrary = void 0;
var _path = __importStar(require("path"));
var fs = __importStar(require("fs"));
function getMinVersion() {
    return {
        getAllEngineVersions: '1.0.24',
        getInstalledTools: '1.0.24',
        getTarget: "1.0.45",
        getUserID: "1.0.46",
        sign: "1.0.46"
    };
}
function createLauncherLibrary() {
    var egretjspath = _path.join(getEgretLauncherPath(), "egret.js");
    var minVersions = getMinVersion();
    var m = require(egretjspath);
    var selector = m.selector;
    return new Proxy(selector, {
        get: function (target, p, receiver) {
            var result = target[p];
            if (!result) {
                var minVersion = minVersions[p];
                throw "\u627E\u4E0D\u5230 LauncherAPI:" + p + ",\u8BF7\u5B89\u88C5\u6700\u65B0\u7684\u767D\u9E6D\u5F15\u64CE\u542F\u52A8\u5668\u5BA2\u6237\u7AEF\u89E3\u51B3\u6B64\u95EE\u9898,\u6700\u4F4E\u7248\u672C\u8981\u6C42:" + minVersion + ",\u4E0B\u8F7D\u5730\u5740:https://egret.com/products/engine.html"; //i18n
            }
            return result.bind(target);
        }
    });
}
exports.createLauncherLibrary = createLauncherLibrary;
function getEgretLauncherPath() {
    var npmEgretPath;
    if (process.platform === 'darwin') {
        var basicPath = '/usr/local';
        if (!fs.existsSync(basicPath)) { //some mac doesn't have path '/usr/local'
            basicPath = '/usr';
        }
        npmEgretPath = _path.join(basicPath, 'lib/node_modules/egret/EgretEngine');
    }
    else {
        npmEgretPath = _path.join(getAppDataPath(), 'npm/node_modules/egret/EgretEngine');
    }
    if (!fs.existsSync(npmEgretPath)) {
        throw "\u627E\u4E0D\u5230  " + npmEgretPath + "\uFF0C\u8BF7\u5728 Egret Launcher \u4E2D\u6267\u884C\u4FEE\u590D\u5F15\u64CE"; //todo i18n
    }
    var launcherPath = _path.join(fs.readFileSync(npmEgretPath, 'utf-8'), "../");
    return launcherPath;
}
function getAppDataPath() {
    var result = "";
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return '';
            result = home + "/Library/Application Support/"; //Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            result = appdata.split("\\").join("/");
            break;
        default:
            ;
    }
    if (!fs.existsSync(result)) {
        throw 'missing appdata path';
    }
    return result;
}
