const knex = require('../db/db_init');
// const knex = require('knex').knex({});

const post_user = async(user)=>{
 
    await knex.raw(`INSERT INTO tb_users(username, password, account_name)VALUES("${user.username}", "${user.password}", "${user.account_name}")`);
    return await knex.select(['user_id', 'username', 'account_name', 'user_status', 'profile_photo']).from('tb_users').orderBy('user_id', 'desc').limit(1);

}

const get_user = async(user_id)=>{
    return await knex('tb_users').select(['user_id', 'username', 'account_name', 'user_status', 'profile_photo'])
    .where('user_id', '=', user_id)
    .andWhere('user_status', '=', '1');
}

const get_password = async(username)=>{
    return await knex('tb_users').select(['password', 'user_id', 'username']).where('username', '=', username).andWhere('user_status', '=', '1');
}

const getAllPasswords = async()=>{
    return await knex('tb_users').select('password').where('user_status', '=', '1');
}

const check_username_exists = async(username)=>{
    return await knex('tb_users').select('username').where('username', '=', username).andWhere('user_status', '=', '1');
}

const find_user_password = async(user_id)=>{
    return await knex('tb_users').select('password').where('user_id', '=', user_id).andWhere('user_status', '=', '1');
}

module.exports = {
    post_user,
    get_user,
    getAllPasswords,
    check_username_exists,
    find_user_password,
    get_password
}