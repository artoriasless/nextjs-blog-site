'use stirct';

const pkg = require('../../package.json');

const staticFolder = 'artoriasless-site';
const staticVersion = pkg.version;
const domain = '//artoriasless.oss-cn-hangzhou.aliyuncs.com';
const assetFolder = `${staticFolder}/${staticVersion}`;
const userPrefix = `${domain}/user`;
const assetPrefix = `${domain}/${staticFolder}/${staticVersion}`;
const paperPrefix = `${domain}/${staticFolder}/paper`;

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  archiving: '',
  sessionKeys: ['user'],
  session: {
    key: 'koa-artoriasless-site-session',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  },
  ossPublic: {
    domain,
    assetFolder,
    userPrefix,
    assetPrefix,
    paperPrefix,
    staticFolder,
    staticVersion,
  },
};
