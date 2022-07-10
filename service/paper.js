'use strict';

const PAGE_LENGTH = 10;

const sequelize = require('sequelize');

const models = require('../model');

const Paper = models.db.Paper;

module.exports = {
  async create(data) {
    const paper = await Paper.create(data);

    return paper ? paper.toJSON() : {};
  },
  async update(data) {
    const id = data.id;
    const paper = await Paper.findByPk(id);

    if (paper) {
      const result = await paper.update(data);

      return result ? result.toJSON() : {};
    }
    return null;
  },
  async findByPk(id) {
    const paper = await Paper.findByPk(id);

    return paper ? paper.toJSON() : {};
  },
  async findMany(query) {
    query = query || {};

    const papers = await Paper.findAll(query);

    return papers.map(paper => (paper ? paper.toJSON() : {}));
  },
  async page(where, page) {
    where = where || {};
    page = page || 1;

    const query = {
      where,
      limit: PAGE_LENGTH,
      offset: (page - 1) * PAGE_LENGTH,
    };
    const result = await Paper.findAndCountAll(query);

    return {
      page,
      count: result.count,
      rows: result.rows.map(paper => (paper ? paper.toJSON() : {})),
    };
  },
  async filterCount(filterType) {
    const filterOpts = {
      tag: {
        group: ['tag'],
        attributes: ['tag', sequelize.fn('count', sequelize.col('tag'))],
      },
      timeline: {
        group: ['year_tag'],
        attributes: [['year_tag', 'yearTag'], sequelize.fn('count', sequelize.col('year_tag'))],
      },
      latest: {
        limit: 5,
        offset: 0,
        attributes: ['id', 'title', 'tag'],
        order: [['id', 'DESC']],
      },
    };
    const result = await Paper.findAndCountAll(filterOpts[filterType]);

    return result;
  },
};
