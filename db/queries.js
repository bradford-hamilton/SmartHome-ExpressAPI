var knex = require('./knex');

module.exports = {

findUserByUsername: function(username) {
    return knex('users').where({username: username}).first();
  },

addUser: function(body) {
    return knex('users').insert(body, 'id');
  }
};
