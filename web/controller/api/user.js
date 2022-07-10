'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const hash = require('object-hash');

const resolveFileOpts = require('../../lib/resolve-file-opts');
const config = require('../../../config');
const service = require('../../../service');
const userService = service.user;
const utilService = service.util;

module.exports = {
  async getUserDefault(ctx) {
    if (ctx.session.user === undefined || ctx.session.user.id === undefined) {
      ctx.session.user = {
        id: 0,
      };
    }

    const loginUser = ctx.session.user;
    const user = (await userService.findByPk(Number(loginUser.id))) || {};

    user.isOwner = Boolean(ctx.session.isOwner);
    ctx.session.user = user;
    ctx.body = {
      success: true,
      message: '',
      data: user,
    };
  },
  async logout(ctx) {
    ctx.session.user = {};
    ctx.session.isOwner = false;
    ctx.body = {
      success: true,
      message: 'logout success!',
      data: {},
    };
  },
  async login(ctx) {
    const jsonData = ctx.request.body;
    const query = {
      where: {
        email: jsonData.email,
      },
    };
    const users = await userService.findMany(query);
    var user = users[0] || {};
    var success = true;
    var message = 'login success!';
    var isOwner = false;

    if (!user.id && !user.email && !user.password) {
      success = false;
      message = 'login failed.please check that if the email is right!';
    } else {
      if (hash.sha1(jsonData.password) !== user.password) {
        user = {};
        success = false;
        message = 'login failed.please check that password is right!';
      }
      if (config.owners.indexOf(user.uuid) !== -1) {
        isOwner = true;
        user.isOwner = true;
      }
    }

    ctx.session.user = user;
    ctx.session.isOwner = isOwner;
    ctx.body = {
      success,
      message,
      data: user,
    };
  },
  async register(ctx) {
    const jsonData = ctx.request.body;
    const query = {
      where: {
        email: jsonData.email,
      },
    };
    const users = await userService.findMany(query);
    const userData = {
      uuid: uuid(),
      userName: `guest${Math.round(Math.random() * 100)}`,
      email: jsonData.email,
      password: hash.sha1(jsonData.password),
      gender: 0,
      isEnabled: 0,
      registerIp: ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0],
    };
    var user = {};
    var success = true;
    var message = 'rigister success';

    if (users.length > 0) {
      success = false;
      message = 'the email that submited has been registered!';
    } else {
      user = await userService.create(userData);

      const hashVal = hash.sha1(user.uuid);
      const activateLink = `${config.domain}/activate/${user.uuid}?stamp=${hashVal}`;
      const emailTpl = fs.readFileSync(path.resolve(__dirname, '../../template/activate-email.tpl')).toString();
      const emailOpts = {
        to: user.email,
        subject: 'Activate Your MonkingStand Account',
        text: 'activate your monkingstand account to comment',
        html: emailTpl.replace(/<activateLink>/g, activateLink),
      };

      utilService.email(emailOpts);
    }

    ctx.session.user = user;
    ctx.body = {
      success,
      message,
      data: user,
    };
  },
  async activate(ctx) {
    const activatePageUrl = ctx.request.header.referer;
    const jsonData = ctx.request.body;
    const query = {
      where: {
        uuid: jsonData.uuid,
      },
    };
    const users = await userService.findMany(query);
    const userData = {
      isEnabled: 1,
    };
    const stamp = {
      url: activatePageUrl.match(/\?stamp=(.+)$/) ? activatePageUrl.match(/\?stamp=(.+)$/)[1] : '',
      calced: hash.sha1(jsonData.uuid),
    };
    var user;
    var success = true;
    var message = 'account has been activated!';

    if (users.length === 0 || stamp.url !== stamp.calced) {
      success = false;
      message = 'please check the url link is right!';
    } else {
      user = users[0];
      ctx.session.user = user;

      if (user.isEnabled) {
        message = "the account has been activated, needn't activate anymore!";
      } else {
        userData.id = user.id;
        user = await userService.update(userData);
      }
    }

    ctx.body = {
      success,
      message,
      data: user,
    };
  },
  async updateInfo(ctx) {
    const jsonData = ctx.request.body;
    var user = ctx.session.user;
    var message = 'update success!';
    var success = true;

    jsonData.id = user.id;
    user = await userService.update(jsonData);

    ctx.session.user = user;
    ctx.body = {
      success,
      message,
      data: user,
    };
  },
  async updatePwd(ctx) {
    const jsonData = ctx.request.body;
    const originUser = ctx.session.user;
    var message = 'update success!';
    var success = true;
    var user = await userService.findByPk(originUser.id);

    if (user.password === hash.sha1(jsonData.original)) {
      user = await userService.update({
        id: user.id,
        password: hash.sha1(jsonData.modify),
      });
    } else {
      message = 'the original password you typed is wrong!';
      success = false;
    }

    ctx.session.user = user;
    ctx.body = {
      success,
      message,
      data: user,
    };
  },
  async updateAvatar(ctx) {
    const user = ctx.session.user || {};
    let result = {};

    if (user.id && user.uuid && user.email) {
      const fileOpts = await resolveFileOpts(ctx.request, ctx, 'USER_AVATAR');

      result = await utilService.async.upload(fileOpts);

      if (result.success) {
        result.message = fileOpts.message;
        result.data = fileOpts.data;
      }
    } else {
      result.success = false;
      result.message = 'please login first!';
      result.data = null;
    }

    ctx.body = result;
  },
  async resetPwd(ctx) {
    const newPwd = Date.parse(new Date());
    const jsonData = ctx.request.body;
    var query = {
      where: {
        email: jsonData.email || ctx.session.user.email,
      },
    };
    var message = 'new random pwd has been sent to your email!';
    var success = true;

    var users = await userService.findMany(query);

    if (users.length === 0) {
      message = "the email hasn't been registered,please check the email is right!";
      success = false;
    } else {
      await userService.update({
        id: users[0].id,
        password: hash.sha1(String(newPwd)),
      });

      const homeLink = config.domain;
      const emailTpl = fs.readFileSync(path.resolve(__dirname, '../../template/reset-pwd-email.tpl')).toString();
      const emailOpts = {
        to: users[0].email,
        subject: 'Reset Password',
        text: 'get your new random password',
        html: emailTpl.replace(/<homeLink>/g, homeLink).replace(/<newRandomPwd>/g, newPwd),
      };

      utilService.email(emailOpts);
    }

    ctx.session.user = {};
    ctx.body = {
      success,
      message,
      data: {},
    };
  },
  async sendActivateMail(ctx) {
    const user = ctx.session.user;
    const hashVal = hash.sha1(user.uuid);
    const activateLink = `${config.domain}/activate/${user.uuid}?stamp=${hashVal}`;
    const emailTpl = fs.readFileSync(path.resolve(__dirname, '../../template/activate-email.tpl')).toString();
    const emailOpts = {
      to: user.email,
      subject: 'Activate Your MonkingStand Account',
      text: 'activate your monkingstand account to comment',
      html: emailTpl.replace(/<activateLink>/g, activateLink),
    };
    var success = true;
    var message = 'activate email has been sent!';

    utilService.email(emailOpts);

    ctx.body = {
      success,
      message,
      data: user,
    };
  },
};
