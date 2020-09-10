"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__reflect = void 0;
exports.__reflect = function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
