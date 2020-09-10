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
exports.launcher = exports.projectData = void 0;
var fs = __importStar(require("fs"));
var _path = __importStar(require("path"));
var api_1 = require("./api");
var EgretProjectData = /** @class */ (function () {
    function EgretProjectData() {
        this.egretProperties = {
            modules: [],
            target: { current: "web" },
            engineVersion: "1"
        };
        this.projectRoot = "";
    }
    EgretProjectData.prototype.init = function (projectRoot) {
        this.projectRoot = projectRoot;
        this.reload();
    };
    EgretProjectData.prototype.hasEUI = function () {
        return this.egretProperties.modules.some(function (m) { return m.name == "eui"; });
    };
    EgretProjectData.prototype.reload = function () {
        var egretPropertiesPath = this.getFilePath("egretProperties.json");
        if (fs.existsSync(egretPropertiesPath)) {
            var content = fs.readFileSync(egretPropertiesPath, 'utf-8');
            this.egretProperties = JSON.parse(content);
            var useGUIorEUI = 0;
            for (var _i = 0, _a = this.egretProperties.modules; _i < _a.length; _i++) {
                var m = _a[_i];
                //兼容小写
                if (m.name == "dragonbones") {
                    m.name = "dragonBones";
                }
                if (m.name == "gui" || m.name == "eui") {
                    useGUIorEUI++;
                }
            }
            if (useGUIorEUI >= 2) {
                process.exit(1);
            }
        }
    };
    /**
     * 获取项目的根路径
     */
    EgretProjectData.prototype.getProjectRoot = function () {
        return this.projectRoot;
    };
    EgretProjectData.prototype.getFilePath = function (fileName) {
        return _path.resolve(this.getProjectRoot(), fileName);
    };
    EgretProjectData.prototype.getReleaseRoot = function () {
        var p = "bin-release";
        return p;
        //return file.joinPath(egret.args.projectDir, p);
    };
    EgretProjectData.prototype.getVersionCode = function () {
        return 1;
    };
    EgretProjectData.prototype.getVersion = function () {
        return this.egretProperties.egret_version || this.egretProperties.compilerVersion;
    };
    EgretProjectData.prototype.getIgnorePath = function () {
        return [];
    };
    EgretProjectData.prototype.getCurrentTarget = function () {
        return "web";
        // if (globals.hasKeys(this.egretProperties, ["target", "current"])) {
        //     return this.egretProperties.target.current;
        // }
        // else {
        // }
    };
    EgretProjectData.prototype.getCopyExmlList = function () {
        return [];
    };
    EgretProjectData.prototype.getModulePath2 = function (m) {
        var p = m.path;
        if (!p) {
            var engineVersion = m.version || this.egretProperties.engineVersion;
            var versions = exports.launcher.getEgretToolsInstalledByVersion(engineVersion);
            return _path.join(versions, 'build', m.name);
        }
        return p;
    };
    EgretProjectData.prototype.getAbsolutePath = function (p) {
        if (_path.isAbsolute(p)) {
            return p.split("\\").join("/");
        }
        return _path.join(this.projectRoot, p).split("\\").join("/");
    };
    EgretProjectData.prototype.getModulePath = function (m) {
        var modulePath = this.getModulePath2(m);
        modulePath = this.getAbsolutePath(modulePath);
        var name = m.name;
        if (this.isWasmProject()) {
            if (name == "egret" || name == "eui" || name == "dragonBones" || name == "game") {
                name += "-wasm";
            }
        }
        var searchPaths = [
            _path.join(modulePath, "bin", name),
            _path.join(modulePath, "bin"),
            _path.join(modulePath, "build", name),
            _path.join(modulePath)
        ];
        // if (m.path) {
        //     searchPaths.push(modulePath)
        // }
        if (this.isWasmProject()) {
            searchPaths.unshift(_path.join(modulePath, "bin-wasm"));
            searchPaths.unshift(_path.join(modulePath, "bin-wasm", name));
        }
        var dir = searchPath(searchPaths);
        return dir;
    };
    EgretProjectData.prototype.getLibraryFolder = function () {
        return this.getFilePath('libs/modules');
    };
    EgretProjectData.prototype.getModulesConfig = function (platform) {
        var _this = this;
        if (platform == 'ios' || platform == 'android') {
            platform = 'web';
        }
        var result = this.egretProperties.modules.map(function (m) {
            var name = m.name;
            var sourceDir = _this.getModulePath(m);
            var targetDir = _path.join(_this.getLibraryFolder(), name);
            var relative = _path.relative(_this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !_path.isAbsolute(relative)) { // source 在项目中
                targetDir = sourceDir;
            }
            targetDir = ((_path.relative(_this.getProjectRoot(), targetDir)) + _path.sep).split("\\").join("/");
            var source = [
                _path.join(sourceDir, name + ".js").split("\\").join("/"),
                _path.join(sourceDir, name + "." + platform + ".js").split("\\").join("/")
            ].filter(fs.existsSync);
            var target = source.map(function (s) {
                var debug = _path.join(targetDir, _path.basename(s)).split("\\").join("/");
                var release = _path.join(targetDir, _path.basename(s, '.js') + '.min.js').split("\\").join("/");
                return {
                    debug: debug,
                    release: release,
                    platform: platform
                };
            });
            return { name: name, target: target, sourceDir: sourceDir, targetDir: targetDir };
        });
        return result;
    };
    EgretProjectData.prototype.isWasmProject = function () {
        return false;
    };
    EgretProjectData.prototype.getResources = function () {
        return ["resource"];
    };
    Object.defineProperty(EgretProjectData.prototype, "useTemplate", {
        get: function () {
            return this.egretProperties.template != undefined;
        },
        enumerable: false,
        configurable: true
    });
    EgretProjectData.prototype.hasModule = function (name) {
        var result = false;
        this.egretProperties.modules.forEach(function (module) {
            if (module.name == name || module.name == name) {
                result = true;
            }
        });
        return result;
    };
    return EgretProjectData;
}());
exports.projectData = new EgretProjectData();
var EgretLauncherProxy = /** @class */ (function () {
    function EgretLauncherProxy() {
    }
    EgretLauncherProxy.prototype.getEgretToolsInstalledByVersion = function (checkVersion) {
        var egretjs = api_1.getApi();
        var data = egretjs.getAllEngineVersions();
        var versions = [];
        var result = data[checkVersion];
        if (!result) {
            throw "\u627E\u4E0D\u5230\u6307\u5B9A\u7684 egret \u7248\u672C: " + checkVersion;
        }
        return result.root;
    };
    return EgretLauncherProxy;
}());
exports.launcher = new EgretLauncherProxy();
function searchPath(searchPaths) {
    for (var _i = 0, searchPaths_1 = searchPaths; _i < searchPaths_1.length; _i++) {
        var s = searchPaths_1[_i];
        if (fs.existsSync(s)) {
            return s;
        }
    }
    return null;
}
