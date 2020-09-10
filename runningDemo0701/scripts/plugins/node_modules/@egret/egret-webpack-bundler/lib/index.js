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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfig = exports.EgretWebpackBundler = void 0;
var express_1 = __importDefault(require("express"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var webpack_1 = __importDefault(require("webpack"));
var egretproject_1 = require("./egretproject");
var Plugin_1 = __importDefault(require("./loaders/src-loader/Plugin"));
var theme_1 = __importDefault(require("./loaders/theme"));
var ts_transformer_1 = require("./loaders/ts-loader/ts-transformer");
var open_1 = require("./open");
var middleware = require("webpack-dev-middleware");
var ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackMerge = require('webpack-merge');
var EgretWebpackBundler = /** @class */ (function () {
    function EgretWebpackBundler(projectRoot, target) {
        this.projectRoot = projectRoot;
        this.target = target;
        this.emitter = null;
    }
    EgretWebpackBundler.prototype.startDevServer = function (options) {
        var libraryType = 'debug';
        var scripts = egretproject_1.getLibsFileList('web', this.projectRoot, libraryType);
        var webpackStatsOptions = { colors: true, modules: false };
        var webpackConfig = generateConfig(this.projectRoot, options, this.target, true);
        var compiler = webpack_1.default(webpackConfig);
        var compilerApp = express_1.default();
        compilerApp.use(allowCrossDomain);
        var middlewareOptions = {
            stats: webpackStatsOptions,
            publicPath: undefined,
        };
        compilerApp.use(middleware(compiler, middlewareOptions));
        var port = options.port || 3000;
        startExpressServer(compilerApp, port);
        compilerApp.use(express_1.default.static(this.projectRoot));
        var manifestContent = JSON.stringify({ initial: scripts, game: ['main.js'] }, null, '\t');
        fs.writeFileSync(path.join(this.projectRoot, 'manifest.json'), manifestContent, 'utf-8');
        if (options.open) {
            open_1.openUrl("http://localhost:" + port + "/index.html");
        }
    };
    EgretWebpackBundler.prototype.build = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var webpackStatsOptions = { colors: true, modules: false };
            var scripts = egretproject_1.getLibsFileList(_this.target, _this.projectRoot, options.libraryType);
            var webpackConfig = generateConfig(_this.projectRoot, options, _this.target, false);
            var handler = function (error, status) {
                console.log(status.toString(webpackStatsOptions));
                resolve();
            };
            var compiler = webpack_1.default(webpackConfig);
            if (_this.emitter) {
                for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
                    var script = scripts_1[_i];
                    var content = fs.readFileSync(path.join(_this.projectRoot, script));
                    _this.emitter(script, content);
                }
                compiler.outputFileSystem = {
                    mkdir: function (path, callback) {
                        callback(null);
                    },
                    mkdirp: function (path, callback) {
                        callback(null);
                    },
                    rmdir: function (path, callback) {
                        callback(null);
                    },
                    unlink: function (path, callback) {
                        callback(null);
                    },
                    join: path.join,
                    writeFile: function (p, data, callback) {
                        var _a;
                        var relativePath = path.relative((_a = webpackConfig.output) === null || _a === void 0 ? void 0 : _a.path, p).split("\\").join("/");
                        _this.emitter(relativePath, data);
                        callback(null);
                    }
                };
            }
            compiler.run(handler);
        });
    };
    return EgretWebpackBundler;
}());
exports.EgretWebpackBundler = EgretWebpackBundler;
function generateConfig(context, options, target, devServer) {
    context = context.split("/").join(path.sep);
    var needSourceMap = devServer;
    var mode = devServer ? "development" : "production";
    var config = {
        stats: "minimal",
        entry: './src/Main.ts',
        target: 'web',
        mode: mode,
        context: context,
        devtool: needSourceMap ? "source-map" : false,
        output: {
            path: path.resolve(context, 'dist'),
            filename: 'main.js'
        },
        module: {
            rules: []
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        optimization: {
            minimize: false,
        },
        plugins: []
    };
    generateWebpackConfig_typescript(config, options, needSourceMap);
    generateWebpackConfig_exml(config, options);
    generateWebpackConfig_html(config, options, target);
    genrateWebpackConfig_subpackages(config, options);
    if (target === 'lib') {
        config.output.library = 'xxx';
        config.output.libraryTarget = 'umd';
    }
    if (options.libraryType === 'debug') {
        config.plugins.push(new webpack_1.default.NamedModulesPlugin());
        config.plugins.push(new webpack_1.default.NamedChunksPlugin());
    }
    if (options.webpackConfig) {
        var customWebpackConfig = typeof options.webpackConfig === 'function' ? options.webpackConfig(config) : options.webpackConfig;
        config = webpackMerge(config, customWebpackConfig);
    }
    return config;
}
exports.generateConfig = generateConfig;
function genrateWebpackConfig_subpackages(config, options) {
    if (!options.subpackages) {
        return config;
    }
    var items = options.subpackages.map(function (subpackage) {
        return {
            name: subpackage.name,
            filename: subpackage.name + ".js",
            test: function (module) {
                return subpackage.matcher(module.resource);
            },
            chunks: "initial",
            minSize: 0,
        };
    });
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                default: false
            }
        }
    };
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        config.optimization.splitChunks.cacheGroups[item.name] = item;
    }
    return config;
}
function generateWebpackConfig_typescript(config, options, needSourceMap) {
    var _a, _b;
    var compilerOptions = {
        sourceMap: needSourceMap,
        importHelpers: false,
        noEmitHelpers: true
    };
    var rules = config.module.rules;
    var plugins = config.plugins;
    var srcLoaderRule = {
        test: /\.tsx?$/,
        include: path.join(config.context, 'src'),
        loader: require.resolve('./loaders/src-loader'),
    };
    var typescriptLoaderRule = {
        test: /\.tsx?$/,
        loader: require.resolve('ts-loader'),
        options: {
            transpileOnly: false,
            configFile: ((_a = options.typescript) === null || _a === void 0 ? void 0 : _a.tsconfigPath) || 'tsconfig.json',
            compilerOptions: compilerOptions,
            getCustomTransformers: function (program) {
                return {
                    before: [
                        ts_transformer_1.emitClassName(),
                    ]
                };
                // if (options.typescript?.minify) {
                //     return ({
                //         before: [
                //             emitClassName(),
                //             minifyTransformer(program, options.typescript.minify)
                //         ]
                //     });
                // }
                // else {
                //     return ({
                //         before: [
                //             emitClassName(),
                //         ]
                //     });
                // }
            }
        }
    };
    if (((_b = options.typescript) === null || _b === void 0 ? void 0 : _b.mode) === 'modern') {
        plugins.push(new ForkTsCheckerPlugin());
        typescriptLoaderRule.options.transpileOnly = true;
        rules.push(typescriptLoaderRule);
    }
    else {
        rules.push(srcLoaderRule);
        plugins.push(new Plugin_1.default());
        rules.push(typescriptLoaderRule);
    }
    plugins.push(new webpack_1.default.BannerPlugin({ banner: polyfill, raw: true }));
}
function generateWebpackConfig_exml(config, options) {
    var _a;
    if (!options.exml) {
        return;
    }
    var exmlLoaderRule = {
        test: /\.exml/,
        use: [
            // {
            //     loader: 'thread-loader',
            //     options: {
            //         workers: 2,
            //     },
            // },
            require.resolve("./loaders/exml"),
        ],
    };
    if ((_a = options.exml) === null || _a === void 0 ? void 0 : _a.watch) {
        // rules.push(srcLoaderRule);
        config.module.rules.push(exmlLoaderRule);
        config.plugins.push(new theme_1.default({}));
    }
}
function generateWebpackConfig_html(config, options, target) {
    var _a;
    if (!options.html) {
        return;
    }
    if (['web', 'ios', 'android'].indexOf(target) >= 0) {
        (_a = config.plugins) === null || _a === void 0 ? void 0 : _a.push(new HtmlWebpackPlugin({
            inject: false,
            template: options.html.templateFilePath
        }));
    }
}
function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}
function startExpressServer(compilerApp, port) {
    return new Promise(function (resolve, reject) {
        compilerApp
            .listen(port, function () {
            resolve();
        })
            .on("error", function () {
            reject();
        });
    });
}
var polyfill = "\n\nvar extendStatics = Object.setPrototypeOf ||\n({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\nfunction (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n\nvar __extends = function (d, b) {\nextendStatics(d, b);\nfunction __() { this.constructor = d; }\nd.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n};\n\nvar __assign = Object.assign || function (t) {\nfor (var s, i = 1, n = arguments.length; i < n; i++) {\n    s = arguments[i];\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\n}\nreturn t;\n};\n\nvar __rest = function (s, e) {\nvar t = {};\nfor (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\n    t[p] = s[p];\nif (s != null && typeof Object.getOwnPropertySymbols === \"function\")\n    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {\n        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))\n            t[p[i]] = s[p[i]];\n    }\nreturn t;\n};\n\nvar __decorate = function (decorators, target, key, desc) {\nvar c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\nif (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\nelse for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\nreturn c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\nvar __param = function (paramIndex, decorator) {\nreturn function (target, key) { decorator(target, key, paramIndex); }\n};\n\nvar __metadata = function (metadataKey, metadataValue) {\nif (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(metadataKey, metadataValue);\n};\n\nvar __awaiter = function (thisArg, _arguments, P, generator) {\nfunction adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\nreturn new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n    function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n});\n};\n\nvar __generator = function (thisArg, body) {\nvar _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\nreturn g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\nfunction verb(n) { return function (v) { return step([n, v]); }; }\nfunction step(op) {\n    if (f) throw new TypeError(\"Generator is already executing.\");\n    while (_) try {\n        if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n        if (y = 0, t) op = [op[0] & 2, t.value];\n        switch (op[0]) {\n            case 0: case 1: t = op; break;\n            case 4: _.label++; return { value: op[1], done: false };\n            case 5: _.label++; y = op[1]; op = [0]; continue;\n            case 7: op = _.ops.pop(); _.trys.pop(); continue;\n            default:\n                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                if (t[2]) _.ops.pop();\n                _.trys.pop(); continue;\n        }\n        op = body.call(thisArg, _);\n    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n}\n};\n\nvar __exportStar = function(m, exports) {\nfor (var p in m) if (p !== \"default\" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);\n};\n\nvar __createBinding = Object.create ? (function(o, m, k, k2) {\nif (k2 === undefined) k2 = k;\nObject.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\nif (k2 === undefined) k2 = k;\no[k2] = m[k];\n});\n\nvar __values = function (o) {\nvar s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\nif (m) return m.call(o);\nif (o && typeof o.length === \"number\") return {\n    next: function () {\n        if (o && i >= o.length) o = void 0;\n        return { value: o && o[i++], done: !o };\n    }\n};\nthrow new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\n\nvar __read = function (o, n) {\nvar m = typeof Symbol === \"function\" && o[Symbol.iterator];\nif (!m) return o;\nvar i = m.call(o), r, ar = [], e;\ntry {\n    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n}\ncatch (error) { e = { error: error }; }\nfinally {\n    try {\n        if (r && !r.done && (m = i[\"return\"])) m.call(i);\n    }\n    finally { if (e) throw e.error; }\n}\nreturn ar;\n};\n\nvar __spread = function () {\nfor (var ar = [], i = 0; i < arguments.length; i++)\n    ar = ar.concat(__read(arguments[i]));\nreturn ar;\n};\n\nvar __spreadArrays = function () {\nfor (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\nfor (var r = Array(s), k = 0, i = 0; i < il; i++)\n    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\n        r[k] = a[j];\nreturn r;\n};\n\nvar __await = function (v) {\nreturn this instanceof __await ? (this.v = v, this) : new __await(v);\n};\n\nvar __asyncGenerator = function (thisArg, _arguments, generator) {\nif (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\nvar g = generator.apply(thisArg, _arguments || []), i, q = [];\nreturn i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i;\nfunction verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }\nfunction resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }\nfunction step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }\nfunction fulfill(value) { resume(\"next\", value); }\nfunction reject(value) { resume(\"throw\", value); }\nfunction settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }\n};\n\nvar __asyncDelegator = function (o) {\nvar i, p;\nreturn i = {}, verb(\"next\"), verb(\"throw\", function (e) { throw e; }), verb(\"return\"), i[Symbol.iterator] = function () { return this; }, i;\nfunction verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === \"return\" } : f ? f(v) : v; } : f; }\n};\n\nvar __asyncValues = function (o) {\nif (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\nvar m = o[Symbol.asyncIterator], i;\nreturn m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\nfunction verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\nfunction settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\n};\n\nvar __makeTemplateObject = function (cooked, raw) {\nif (Object.defineProperty) { Object.defineProperty(cooked, \"raw\", { value: raw }); } else { cooked.raw = raw; }\nreturn cooked;\n};\n\nvar __setModuleDefault = Object.create ? (function(o, v) {\nObject.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\no[\"default\"] = v;\n};\n\nvar __importStar = function (mod) {\nif (mod && mod.__esModule) return mod;\nvar result = {};\nif (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n__setModuleDefault(result, mod);\nreturn result;\n};\n\nvar __importDefault = function (mod) {\nreturn (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\n\nvar __classPrivateFieldGet = function (receiver, privateMap) {\nif (!privateMap.has(receiver)) {\n    throw new TypeError(\"attempted to get private field on non-instance\");\n}\nreturn privateMap.get(receiver);\n};\n\nvar __classPrivateFieldSet = function (receiver, privateMap, value) {\nif (!privateMap.has(receiver)) {\n    throw new TypeError(\"attempted to set private field on non-instance\");\n}\nprivateMap.set(receiver, value);\nreturn value;\n};\n\nvar __reflect = function(p, c, t) {\n    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;\n};\n";
