'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config');
const User = require('./user');
const Paper = require('./paper');
const Reply = require('./reply');
const Message = require('./message');

const dbconn = `mysql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

const sequelize = new Sequelize(dbconn, config.db.seq_options);

const db = {
  Sequelize,
  sequelize,
};

const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Paper: Paper(sequelize, Sequelize.DataTypes),
  Reply: Reply(sequelize, Sequelize.DataTypes),
  Message: Message(sequelize, Sequelize.DataTypes),
};

// 表关联
// Message
models.Message.belongsTo(models.User, {
  foreignKey: 'userId',
  targetKey: 'id',
});
models.Message.belongsTo(models.Paper, {
  foreignKey: 'paperId',
  targetKey: 'id',
});
models.Message.belongsTo(models.Reply, {
  foreignKey: 'replyId',
  targetKey: 'id',
});
// Paper
models.Paper.hasMany(models.Message, {
  foreignKey: 'paperId',
  sourceKey: 'id',
});
models.Paper.hasMany(models.Reply, {
  foreignKey: 'paperId',
  sourceKey: 'id',
});
// Reply
models.Reply.belongsTo(models.User, {
  foreignKey: 'userId',
  targetKey: 'id',
});
models.Reply.belongsTo(models.Paper, {
  foreignKey: 'paperId',
  targetKey: 'id',
});
models.Reply.hasMany(models.Message, {
  foreignKey: 'replyId',
  as: 'Reply',
});
// User
models.User.hasMany(models.Message, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
models.User.hasMany(models.Reply, {
  foreignKey: 'userId',
  sourceKey: 'id',
});

Object.keys(models).forEach(key => {
  const model = models[key];

  if ('associate' in model) {
    model.associate(models);
  }

  db[key] = model;
});

if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({
    // force: true, //  for local test,avoid lost test data
  });
}

module.exports = db;
