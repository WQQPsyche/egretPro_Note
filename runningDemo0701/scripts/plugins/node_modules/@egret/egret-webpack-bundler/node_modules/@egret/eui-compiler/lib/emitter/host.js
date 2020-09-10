"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitterHost = void 0;
var EmitterHost = /** @class */ (function () {
    function EmitterHost() {
        this.list = [];
    }
    EmitterHost.prototype.insertClassDeclaration = function (x) {
        this.list.push(x);
    };
    return EmitterHost;
}());
exports.EmitterHost = EmitterHost;
