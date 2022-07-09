# nextjs-stanby-site

基于 **`nextjs`** 的一个博客网站，6.0 版本（[English](https://github.com/MonkingStand/nextjs-blog-site)）

> 线上运行版本可访问 : **[artoriasless](http://www.artoriasless.cn)**

## 简述

- 使用 **`node@14.x`** 和 **`npm@8.x`** 作为本地开发和线上生产环境
- 使用 **`mysql@8.x`** 作为本地开发和线上生产环境
- 使用 **`next@~9.0.x`** 作为整个项目的框架用于 **同构**
- 关于应用脚手架
  - 使用 **`@zeit/next-css`** 和 **`@zeit/next-sass`** 用于导入 **`*.css/*.sass/*.scss`** 并进行编译和打包
  - 当进行本地开发时，使用 **`nodemon@~1.19.2`** 监听配置文件（ **config/\*** ）和后端文件变化（ **model/\*** / **service/\*** / **web/\*** ），并实时重启
  - 通过 **`forever-monitor@~1.7.1`** ，让整个 **`nextjs`** 应用在子进程中运行，防止不可控的意外报错导致整个应用挂掉
- 关于服务端
  - 使用 **`koa@~2.8.1`** 作为自定义服务端，以替换 **`nextjs`** 中默认的服务端
  - 使用 **`mysql`** 作为数据库
  - 使用 **`sequelize`** 作为 ORM
- 关于前端
  - 由于使用了 **`nextjs`** ，本项目同时将使用 **`react@~16.9.0`**
  - 使用 **`bootstrap@~4.3.1`** 和 **`react-bootstrap@^1.0.0-beta.12`** 作为 UI 框架
- 关于静态资源
  - 主要指位于 **`${projectDir}/.next/static`** 的所有资源文件
  - 当进行本地开发时，页面上静态资源的引用路径地址形如 **`/_next/static/asset.js`**
  - 当线上生产环境运行时，页面上静态资源的引用路径地址形如 **`//${ossDomain}/${staticFolder}/_next/static/asset.js`**
  - 为了减少请求和载入静态资源时耗费的时间，所有的静态资源文件将会迁移到 **OSS** ，并且会在每次发布应用之前推送这些文件进行更新，用于线上生产环境的请求和载入

## 运行脚本

- **`dev`**
  - 主要用于 **本地开发**
- **`build`**
  - 主要用于 **打包并输出** 生产环境所需静态资源
- **`publish`**
  - 主要用于将所需的静态资源从 **本地** 提交至 **OSS**
- **`start`**
  - 主要用于 **生产环境**
