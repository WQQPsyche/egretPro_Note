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
exports.SrcLoaderPlugn = void 0;
var source_map_1 = require("source-map");
var utils = __importStar(require("../utils"));
var Plugin_1 = __importDefault(require("./Plugin"));
exports.SrcLoaderPlugn = Plugin_1.default;
var NS = Plugin_1.default.NS;
var srcLoader = function (input, upstreamSourceMap) {
    var _this = this;
    var callback = this.async();
    var compiler = this._compiler;
    var ns = this[NS];
    var isEntry = utils.isEntry(compiler, this.resourcePath); // 入口文件
    var dependencies = [];
    if (isEntry) {
        // 导入未模块化的全部文件
        dependencies = dependencies.concat(ns.factory.sortUnmodules());
    }
    else {
        // 只处理入口文件
        return callback(null, input, upstreamSourceMap);
    }
    var dependenciesRequires = [];
    dependencies.forEach(function (fileName) {
        if (fileName !== _this.resourcePath) {
            var relative = utils.relative(_this.resourcePath, fileName);
            dependenciesRequires.push("require('" + relative + "');");
        }
    });
    var _a = injectLines(input.toString(), upstreamSourceMap, this, __spreadArrays(dependenciesRequires), []), output = _a.output, sourceMap = _a.sourceMap;
    callback(null, output, sourceMap);
};
function injectLines(input, upstreamSourceMap, // 上级loader sourcemap
context, headers, footers) {
    var resourcePath = context.resourcePath;
    var lines = input.split(/\n/);
    var headerInjectionIndex = -1;
    var footerInjectionIndex = lines.length;
    lines.forEach(function (line, index) {
        if (/^\s*\/\/\s*HEADER_INJECTION_PLACEHOLDER\b/.test(line)) {
            headerInjectionIndex = index;
        }
        if (/^\s*\/\/\s*FOOTER_INJECTION_PLACEHOLDER\b/.test(line)) {
            footerInjectionIndex = index;
        }
    });
    if (headerInjectionIndex > footerInjectionIndex) {
        throw new Error('HEADER_INJECTION_PLACEHOLDER should before FOOTER_INJECTION_PLACEHOLDER');
    }
    var newLines = __spreadArrays((headerInjectionIndex === -1 ? [] : lines.slice(0, headerInjectionIndex)), headers, lines.slice(headerInjectionIndex + 1, footerInjectionIndex), footers, lines.slice(footerInjectionIndex + 1));
    var sourceMap = undefined;
    if (context.sourceMap) { // 生成sourcemap
        sourceMap = new source_map_1.SourceMapGenerator({
            file: resourcePath,
        });
        var getGeneratedLineIndex_1 = function (i) {
            if (i < headerInjectionIndex) {
                return i;
            }
            else if (i < footerInjectionIndex) {
                return i + headers.length + (headerInjectionIndex === -1 ? 0 : -1);
            }
            return i + headers.length + (headerInjectionIndex === -1 ? 0 : -1) + footers.length - 1;
        };
        // 有上级loader sourcemap
        if (upstreamSourceMap && upstreamSourceMap.mappings && upstreamSourceMap.mappings.length) {
            var upstreamSourceMapConsumer = new source_map_1.SourceMapConsumer(upstreamSourceMap);
            upstreamSourceMapConsumer.eachMapping(function (mapping) {
                if (mapping.source) {
                    sourceMap.addMapping({
                        generated: {
                            line: getGeneratedLineIndex_1(mapping.generatedLine - 1) + 1,
                            column: mapping.generatedColumn,
                        },
                        original: {
                            line: mapping.originalLine,
                            column: mapping.originalColumn,
                        },
                        source: mapping.source,
                        name: mapping.name,
                    });
                }
            });
            if (upstreamSourceMap.sourcesContent) {
                upstreamSourceMap.sourcesContent.forEach(function (sourceContent, i) {
                    sourceMap.setSourceContent(upstreamSourceMap.sources[i], sourceContent);
                });
            }
        }
        else {
            for (var i = 0; i < lines.length; i++) {
                if (i !== headerInjectionIndex && i !== footerInjectionIndex) {
                    sourceMap.addMapping({
                        generated: {
                            line: getGeneratedLineIndex_1(i) + 1,
                            column: 0,
                        },
                        original: {
                            line: i + 1,
                            column: 0
                        },
                        source: resourcePath,
                    });
                }
            }
            sourceMap.setSourceContent(resourcePath, input);
        }
    }
    return {
        output: newLines.join('\n'),
        sourceMap: sourceMap ? JSON.parse(sourceMap.toString()) : undefined,
    };
}
exports.default = srcLoader;
