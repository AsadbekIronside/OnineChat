const knex = require('knex').knex({
    client:'mysql2',
    connection:{
        host:'localhost',
        port:3306,
        user:'root',
        password:'Asadbek0929$',
        database:'onlinechat'
    }
});

module.exports = knex;
