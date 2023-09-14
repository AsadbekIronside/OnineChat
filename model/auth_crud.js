const knex = require('../db/db_init');
// const knex = require('knex').knex({});

const post_user = async(user)=>{
 
    await knex.raw(`INSERT INTO tb_users(username, email, password, account_name)VALUES("${user.username}", "${user.email}", "${user.password}", "${user.account_name}")`);
    return await knex.select(['user_id', 'username', 'account_name', 'user_status', 'profile_photo']).from('tb_users').orderBy('user_id', 'desc').limit(1);

}

const get_user = async(user)=>{
    return await knex('tb_users').select(['user_id', 'username', 'account_name', 'user_status', 'profile_photo']).where(knex.raw(`email="${user.email}" AND password="${user.password}"`));
}

const delete_user = async(userId)=>{
    return await knex('tb_users').where({user_id:userId}).update({user_status:0, delete_time:new Date()});
}

const check_email_exists = async(email)=>{
    return await knex('tb_users').select('user_status').where('email', '=', email).andWhere('user_status', '=', '1');
}

const check_username_exists = async(username)=>{
    return await knex('tb_users').select('user_status').where('username', '=', username).andWhere('user_status', '=', '1');
}

const find_user_password = async(user)=>{
    return await knex('tb_users').select('password').where(knex.raw(`user_id=${user.user_id} AND password="${user.password}"`));
}

module.exports = {
    post_user,
    get_user,
    delete_user,
    check_email_exists,
    check_username_exists,
    find_user_password
}