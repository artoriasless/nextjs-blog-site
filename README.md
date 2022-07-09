# nextjs-stanby-site

enhanced blog site based on **`nextjs`** belongs to me, version 6.0（[中文](https://github.com/MonkingStand/nextjs-blog-site/blob/master/README.zh.md)）

> website : **[artoriasless](http://www.artoriasless.cn)**

## Brief

- it uses **`node@14.x`** and **`npm@8.x`** as development and production runtime environment
- it uses **`mysql@8.x`** as development and production runtime environment
- it uses **`next@9.0.x`** as whole project framework for **isomorphism**
- about scaffold
  - it uses **`@zeit/next-css`** and **`@zeit/next-sass`** to import **`*.css/*.sass/*.scss`** to compile and bundle
  - for local development, is uses **`nodemon@~1.19.2`** to watch configuration files(**config/\*** ) and server-side files( **model/\*** / **service/\*** / **web/\*** ) changed, and restart after file(s) changed
  - it uses **`forever-monitor@~1.7.1`** to run **`nextjs`** project in child process to avoid the application shut down when it occurs unexpected error(s)
- about server side
  - it uses **`koa@~2.8.1`** as custom server to replace default server in **`nextjs`**
  - it uses **`mysql`** as database
  - it uses **`sequelize`** as ORM
- about front-end side
  - due to the usage of **`nextjs`** , it uses **`react@~16.9.0`**
  - it uses **`bootstrap@~4.3.1`** and **`react-bootstrap@^1.0.0-beta.12`** as UI framework
- about static assets
  - mainly point to the files located in **`${projectDir}/.next/static`**
  - for local development, the assets url in the page would be like **`/_next/static/asset.js`**
  - for production runtime environment, the assets url in the page would be like **`//${ossDomain}/${staticFolder}/_next/static/asset.js`**
  - to decrease the time that costed in requesting and loading assets, all files would be migrated into **OSS** , and would be published before deploy, which would be requested and loaded in production runtime environment

## Scripts

- **`dev`**
  - used for **local development**
- **`build`**
  - used to output **bundled files**
- **`publish`**
  - used to publish necessary static rsources from **local** to **OSS**
- **`start`**
  - used for **production environment**
