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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var ts = __importStar(require("typescript"));
var parse_1 = __importDefault(require("./parse"));
var Factory = /** @class */ (function () {
    function Factory(options) {
        this.options = options;
        options.fs = options.fs || _fs;
        this.files = {}; // 文件分析缓存
        this.identifiers = {}; // 全部全局变量分布
    }
    Factory.prototype.get = function (fileName) {
        return this.files[fileName] || null;
    };
    Factory.prototype.update = function () {
        var _this = this;
        var files = getFilesFromTypesciptCompiler(this.options.context).filter(function (item) { return !item.endsWith('.d.ts'); });
        // let files: string[] = [];
        // [path.join(this.options.context, 'src')].forEach(dir => {
        // 	const items = glob.sync('**/*.ts', {
        // 		cwd: dir,
        // 	}).map(item => {
        // 		return path.join(dir, item)
        // 	});
        // 	files = files.concat(items);
        // }).filter(item => !item.endsWith('.d.ts'));
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var item = files_1[_i];
            this.add(item);
        }
        Object.keys(this.files).forEach(function (item) {
            if (!files.includes(item)) {
                _this.remove(item);
            }
        });
    };
    Factory.prototype.remove = function (fileName) {
        var _this = this;
        if (this.files[fileName]) {
            var oldDefines = this.files[fileName].defines;
            // remove identifier
            Object.keys(oldDefines).forEach(function (name) {
                if (_this.identifiers[name]) {
                    _this.identifiers[name].delete(fileName);
                    if (!_this.identifiers[name].size) {
                        delete _this.identifiers[name];
                    }
                }
            });
            delete this.files[fileName];
        }
    };
    Factory.prototype.add = function (fileName) {
        var _this = this;
        var fs = this.options.fs;
        var mtime = +fs.statSync(fileName).mtime;
        var files = this.files;
        if (files[fileName] && files[fileName].mtime === mtime) {
            return;
        }
        this.remove(fileName);
        var content = fs.readFileSync(fileName).toString();
        var _a = parse_1.default(fileName, content), defines = _a.defines, dependencies = _a.dependencies, isModule = _a.isModule;
        // update identifiers
        Object.keys(defines).forEach(function (name) {
            if (!_this.identifiers[name]) {
                _this.identifiers[name] = new Set();
            }
            _this.identifiers[name].add(fileName);
        });
        files[fileName] = {
            mtime: mtime,
            isModule: isModule,
            dependencies: dependencies,
            defines: defines,
        };
    };
    Factory.prototype.findDependencyFiles = function (dependencies) {
        var _this = this;
        var files = new Set();
        Object.keys(dependencies).forEach(function (key) {
            var thisFiles = null;
            var tmp = key.split('@');
            var names = tmp[0].split('.');
            var namspaces = tmp[1] ? tmp[1].split('.') : [];
            for (var i = namspaces.length; i >= 0; i--) { // 插入一个空的空间
                var ns = namspaces.slice(0, i).join('.');
                for (var j = names.length; j > 0; j--) {
                    var name_1 = names.slice(0, j).join('.');
                    var fullName = (ns ? ns + '.' : '') + name_1;
                    if (_this.identifiers[fullName]) {
                        thisFiles = _this.identifiers[fullName];
                        break;
                    }
                }
                if (thisFiles) {
                    break;
                }
            }
            if (thisFiles) {
                thisFiles.forEach(function (item) {
                    files.add(item);
                });
            }
        });
        return Array.from(files);
    };
    // 排序非模块化文件
    Factory.prototype.sortUnmodules = function () {
        var _this = this;
        var list = Object.keys(this.files)
            .filter(function (file) { return !_this.files[file].isModule; })
            .sort();
        // 冒泡排序
        list.forEach(function (fileName) {
            var dependencyFiles = _this.findDependencyFiles(_this.files[fileName].dependencies);
            var index = list.findIndex(function (item) { return item === fileName; });
            // 筛选在自己后面的文件
            dependencyFiles = dependencyFiles.filter(function (dep) {
                return list.findIndex(function (item) { return item === dep; }) > index;
            });
            if (dependencyFiles.length) {
                list = list.filter(function (item) { return !dependencyFiles.includes(item); });
                list.splice.apply(list, __spreadArrays([index, 0], dependencyFiles));
            }
        });
        return list;
    };
    return Factory;
}());
exports.default = Factory;
function getFilesFromTypesciptCompiler(root) {
    var jsonPath = findConfigFile(root, 'tsconfig.json');
    var data = ts.readConfigFile(jsonPath, ts.sys.readFile);
    var configParseResult = ts.parseJsonConfigFileContent(data.config, __assign(__assign({}, ts.sys), { useCaseSensitiveFileNames: true }), root);
    return configParseResult.fileNames;
}
function findConfigFile(requestDirPath, configFile) {
    // If `configFile` is an absolute path, return it right away
    if (path.isAbsolute(configFile)) {
        return ts.sys.fileExists(configFile) ? configFile : undefined;
    }
    // If `configFile` is a relative path, resolve it.
    // We define a relative path as: starts wit
    // one or two dots + a common directory delimiter
    if (configFile.match(/^\.\.?(\/|\\)/) !== null) {
        var resolvedPath = path.resolve(requestDirPath, configFile);
        return ts.sys.fileExists(resolvedPath) ? resolvedPath : undefined;
        // If `configFile` is a file name, find it in the directory tree
    }
    else {
        while (true) {
            var fileName = path.join(requestDirPath, configFile);
            if (ts.sys.fileExists(fileName)) {
                return fileName;
            }
            var parentPath = path.dirname(requestDirPath);
            if (parentPath === requestDirPath) {
                break;
            }
            requestDirPath = parentPath;
        }
        return undefined;
    }
}
