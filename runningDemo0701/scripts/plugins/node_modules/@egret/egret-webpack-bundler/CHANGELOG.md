# Change Log - @egret/egret-webpack-bundler

This log was last generated on Wed, 05 Aug 2020 06:34:17 GMT and should not be manually modified.

## 1.2.11
Wed, 05 Aug 2020 06:34:17 GMT

### Patches

- 临时去掉minify

## 1.2.10
Mon, 27 Jul 2020 02:50:03 GMT

### Patches

- 修改 legacy 模式下的 .ts 文件匹配规则

## 1.2.9
Tue, 21 Jul 2020 06:20:28 GMT

### Patches

- update minify

## 1.2.8
Mon, 20 Jul 2020 11:18:13 GMT

### Patches

- 添加 minify 功能

## 1.2.6
Tue, 07 Jul 2020 06:29:25 GMT

### Patches

- 重构 LauncherAPI，支持 Linux 平台的构建

## 1.2.5
Mon, 06 Jul 2020 09:37:01 GMT

*Version update only*

## 1.2.4
Fri, 03 Jul 2020 07:24:28 GMT

### Patches

- 修复 egret.is 的判断错误的问题

## 1.2.3
Sun, 28 Jun 2020 03:11:40 GMT

### Patches

- 修复 src 文件夹下包含了 .d.ts 导致编译报错的问题

## 1.2.2
Sat, 27 Jun 2020 12:16:20 GMT

### Patches

- 修复 namespace 中的 class 生成的 reflect 错误的问题

## 1.2.1
Mon, 22 Jun 2020 11:09:06 GMT

### Patches

- 修复namespace在legacy模式下报错的问题

## 1.2.0
Mon, 22 Jun 2020 09:18:12 GMT

### Minor changes

- 为 srcLoader添加sourcemap支持

## 1.1.13
Mon, 22 Jun 2020 03:40:24 GMT

### Patches

- 添加 typescript.tsconfigPath 功能

## 1.1.12
Mon, 22 Jun 2020 02:54:14 GMT

### Patches

- 修复全局枚举在 legacy 模式下无法访问的bug

## 1.1.11
Sun, 21 Jun 2020 12:56:53 GMT

### Patches

- 临时修复 modern 模式下的编译错误

## 1.1.10
Sun, 21 Jun 2020 12:46:35 GMT

### Patches

- 进一步降低代码体积

## 1.1.9
Sun, 21 Jun 2020 12:21:40 GMT

### Patches

- 优化输出代码体积

## 1.1.8
Sun, 21 Jun 2020 09:40:22 GMT

*Version update only*

## 1.1.7
Sun, 21 Jun 2020 08:54:25 GMT

### Patches

- 修复装饰器排序错误的问题
- 修复 egret.is 返回错误结果的问题

## 1.1.6
Thu, 18 Jun 2020 03:16:26 GMT

### Patches

- update docs

## 1.1.5
Wed, 17 Jun 2020 07:07:35 GMT

### Patches

- 支持直接使用webpack调用

## 1.1.4
Wed, 17 Jun 2020 06:47:26 GMT

### Patches

- 添加tslib,降低编译尺寸

## 1.1.2
Tue, 16 Jun 2020 06:53:28 GMT

### Patches

- 添加 subpackages 功能

## 1.1.1
Tue, 09 Jun 2020 10:09:34 GMT

### Patches

- 修复排序模块不正常工作的问题

## 1.1.0
Tue, 09 Jun 2020 08:03:17 GMT

### Minor changes

- 添加 exml-loader
- 添加 srcLoader

### Patches

- 添加 exml-loader
- 添加依赖机制
- 向下兼容不引入exml.watch
- 添加 legacy 模式

## 1.0.8
Wed, 03 Jun 2020 08:56:49 GMT

### Patches

- bundler发布代码不再使用 UglifyJS

## 1.0.7
Wed, 03 Jun 2020 08:04:29 GMT

### Patches

- 解决 DevServer Manifest.json 生成错误的问题

## 1.0.6
Wed, 03 Jun 2020 07:52:14 GMT

### Patches

- 修复manifest.json的一些问题

## 1.0.5
Wed, 03 Jun 2020 06:25:40 GMT

### Patches

- 修复 bundle 不应生成 sourcemap 的问题
- 输出文件名修改为 main.js

## 1.0.4
Wed, 03 Jun 2020 05:50:11 GMT

### Patches

- 整合egret的发布libs功能
- 改进对外API

## 1.0.3
Tue, 02 Jun 2020 08:17:59 GMT

### Patches

- startDevServer 会自动打开浏览器

## 1.0.2
Sun, 31 May 2020 13:52:51 GMT

### Patches

- 重构 build 函数，允许自定义 emitter 以便整合egret构建管线

## 1.0.1
Sun, 31 May 2020 13:11:52 GMT

### Patches

- 初始提交，封装 webpack

