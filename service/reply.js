'use strict';

const PAGE_LENGTH = 10;

const models = require('../model');

const Reply = models.db.Reply;
const User = models.db.User;

module.exports = {
  async create(data) {
    const reply = await Reply.create(data);

    return reply ? reply.toJSON() : {};
  },
  async update(data) {
    const id = data.id;
    const reply = await Reply.findByPk(id);

    if (reply) {
      const result = await reply.update(data);

      return result ? result.toJSON() : {};
    }
    return null;
  },
  async findByPk(id) {
    const reply = await Reply.findByPk(id);

    return reply ? reply.toJSON() : {};
  },
  async findMany(paper_id) {
    const query = {
      where: {
        paper_id,
      },
      attributes: ['id', 'replyLevel', 'replyDate', 'content', 'isDeleted', 'replyId', 'rootReplyId'],
      order: [
        ['root_reply_id', 'ASC'],
        ['reply_level', 'ASC'],
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'userName', 'email', 'gender', 'uuid'],
          where: {
            id: models.db.sequelize.col('Reply.user_id'),
          },
        },
      ],
    };

    const replies = await Reply.findAll(query);

    return replies.map(reply => (reply ? reply.toJSON() : {}));
  },
  async page(where, page) {
    where = where || {};
    page = page || 1;

    const query = {
      where,
      limit: PAGE_LENGTH,
      offset: (page - 1) * PAGE_LENGTH,
    };
    const result = await Reply.findAndCountAll(query);

    return {
      page,
      count: result.count,
      rows: result.rows.map(reply => (reply ? reply.toJSON() : {})),
    };
  },
};
