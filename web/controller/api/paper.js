'use strict';

const config = require('../../../config');
const service = require('../../../service');
const paperService = service.paper;
const utilService = service.util;

const resolveFileOpts = require('../../lib/resolve-file-opts');

module.exports = {
  async findOne(ctx) {
    const paperId = Number(ctx.params.paperId);
    var success = true;
    var message = 'get paper success!';
    var data = {};

    if (!isNaN(paperId)) {
      data = await paperService.findByPk(paperId);
    } else {
      success = false;
      message = 'get paper failed, please check the paper id is legal!';
    }

    ctx.body = {
      success,
      message,
      data,
    };
  },
  async filterCount(ctx) {
    const filterArr = ['tag', 'timeline', 'latest'];
    const filterType = ctx.query.filterType || '';
    var success = true;
    var message = 'get filter success!';
    var data = {};

    if (!filterType || filterArr.indexOf(filterType) !== -1) {
      data = await paperService.filterCount(filterType);
    } else if (filterType === 'all') {
      data.tag = await paperService.filterCount('tag');
      data.timeline = await paperService.filterCount('timeline');
      data.latest = await paperService.filterCount('latest');
    } else {
      success = false;
      message = 'get filter failed, please check the filer type is legal!';
    }

    ctx.body = {
      success,
      message,
      data,
    };
  },
  async create(ctx) {
    const user = ctx.session.user;
    const jsonData = ctx.request.body;
    var success = true;
    var message = 'add paper success!';
    var data = {};

    if (config.owners.indexOf(user.uuid) === -1) {
      success = false;
      message = 'sorry you son of a bitch have no permission to add paper!';
    } else {
      jsonData.title = jsonData.title.trim();
      jsonData.tag = jsonData.tag.trim();
      jsonData.subtag = jsonData.subtag.trim();
      jsonData.brief = jsonData.brief.trim();
      jsonData.content = jsonData.content.trim();
      jsonData.yearTag = `${new Date().getFullYear()}`;
      jsonData.monthTag = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

      data = await paperService.create(jsonData);
      success = Boolean(data.id);
      message = success ? message : 'add paper failed!';
    }

    ctx.body = {
      success,
      message,
      data,
    };
  },
  async update(ctx) {
    const user = ctx.session.user || {};
    const jsonData = ctx.request.body;
    var success = true;
    var message = 'update paper success!';
    var data = {};

    if (config.owners.indexOf(user.uuid) === -1) {
      success = false;
      message = 'sorry you son of a bitch have no permission to update paper!';
    } else {
      if (isNaN(jsonData.id)) {
        success = false;
        message = 'please pass legal paper id!';
      } else {
        jsonData.title = jsonData.title.trim();
        jsonData.tag = jsonData.tag.trim();
        jsonData.subtag = jsonData.subtag.trim();
        jsonData.brief = jsonData.brief.trim();
        jsonData.content = jsonData.content.trim();

        data = await paperService.update(jsonData);
        success = Boolean(data.id);
        message = success ? message : 'update paper failed!';
      }
    }

    ctx.body = {
      success,
      message,
      data,
    };
  },
  async uploadMaterial(ctx) {
    const user = ctx.session.user || {};
    let result = {};

    if (user.id && user.uuid && user.email && config.owners.indexOf(user.uuid) !== -1) {
      const fileOpts = await resolveFileOpts(ctx.request, ctx, 'PAPER_MATERIAL');

      result = await utilService.async.upload(fileOpts);

      if (result.success) {
        result.message = fileOpts.message;
        result.data = fileOpts.data;
      }
    } else {
      result.success = false;
      result.message = 'please check your account status first!';
      result.data = null;
    }

    ctx.body = result;
  },
};
