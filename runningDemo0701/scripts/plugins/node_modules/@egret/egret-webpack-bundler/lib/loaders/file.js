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
exports.CachedFile = void 0;
var crypto = __importStar(require("crypto"));
var CachedFile = /** @class */ (function () {
    function CachedFile(filePath, compiler) {
        this.compiler = compiler;
        this.filePath = filePath;
        var existed = existedInFileSystem(compiler.inputFileSystem, filePath);
        var data = existed ? this.compiler.inputFileSystem.readFileSync(filePath) : "";
        this.hash = existed ? crypto.createHash('md5').update(data.toString()).digest("hex") : "";
        // this.hash = !fs.existsSync(filePath) ? '' : crypto.createHash('md5')
        //     .update(fs.readFileSync(filePath).toString())
        //     .digest('hex');
    }
    CachedFile.prototype.update = function (content) {
        // const newHash = crypto.createHash('md5')
        //     .update(content)
        //     .digest('hex');
        var newHash = crypto.createHash('md5').update(content.toString()).digest('hex');
        if (this.hash !== newHash) {
            this.hash = newHash;
            this.compiler.outputFileSystem.writeFile(this.filePath, content, function () {
            });
            // fs.writeFileSync(this.filePath, content);
        }
    };
    return CachedFile;
}());
exports.CachedFile = CachedFile;
function existedInFileSystem(inputFileSystem, p) {
    try {
        inputFileSystem.statSync(p);
        return true;
    }
    catch (e) {
        return false;
    }
    return false;
}
