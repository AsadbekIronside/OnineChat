const knex = require('../db/db_init');
const messages = 'tb_messages';
const users = 'tb_users';

const postMessages = async(data)=>{
    await knex.raw(
        `INSERT INTO tb_messages(from_user_id, to_user_id, message, create_time)VALUES(${data.from_user_id}, 
        ${data.to_user_id}, "${data.message}", "${data.create_time}");`);
    console.log('message posted');
}

const getMessages = async(count, from_user_id, to_user_id)=>{
    return await knex(messages)
        .select(['message_id', 'from_user_id', 'to_user_id', 'message', 'create_time'])
        .where(knex.raw(`((from_user_id=${from_user_id} AND to_user_id=${to_user_id}) OR (from_user_id=${to_user_id} AND to_user_id=${from_user_id}))`))
        .andWhere('message_status', '=', '1')
        .andWhere(knex.raw(`message_id>${count}`))
        .orderBy('create_time');
}

const getUserContacts = async(current_user_id)=>{

    return await knex(users).select(['user_id', 'username', 'account_name', 'profile_photo'])
    .where('user_status', '=', '1')
    .andWhere('user_id', '<>', current_user_id)
    .where(knex.raw(`user_id NOT IN (SELECT from_user_id FROM tb_messages WHERE to_user_id=${current_user_id} AND message_status=1)`));
    
}

const getUserChats = async(current_user_id)=>{

    await knex.schema.dropViewIfExists('users');
    let create_view = 
    `CREATE VIEW users AS SELECT from_user_id, message, create_time FROM tb_messages 
    WHERE message_status=1 AND create_time IN (SELECT MAX(create_time) FROM tb_messages WHERE to_user_id=
    ${current_user_id} GROUP BY from_user_id)`;
    await knex.raw(create_view);
     
    return knex.select(['user_id', 'username', 'account_name', 'profile_photo', 'message', 'users.create_time AS create_time'])
    .from(users).innerJoin('users', 'tb_users.user_id', 'users.from_user_id').where('tb_users.user_status', '=', '1');
}

const getUser = async(user_id)=>{
    return await knex(users).select(['user_id', 'username', 'account_name', 'profile_photo'])
    .where('user_id', '=', user_id)
    .andWhere('user_status', '=', '1');
}

const clearChat = async(from_user_id, to_user_id)=>{
    return await knex(messages).update({message_status:0, delete_time: new Date()})
    .where(knex.raw(`((from_user_id=${from_user_id} AND to_user_id=${to_user_id}) OR (from_user_id=${to_user_id} AND to_user_id=${from_user_id}))`))
    .andWhere('message_status', '=', '1');

}

const getOnesUserTyped = async(user_id)=>{
    return await knex(messages).select(['message_id', 'from_user_id', 'to_user_id'])
    .where('message_status', '=', '1')
    .andWhere(knex.raw(`message_id IN (SELECT MAX(message_id) FROM tb_messages WHERE from_user_id=${user_id} GROUP BY to_user_id)`));
}

const getOnesTypedUser = async(user_id)=>{
    return await knex(messages).select(['message_id', 'from_user_id', 'to_user_id'])
    .where('message_status', '=', '1')
    .andWhere(knex.raw(`message_id IN (SELECT MAX(message_id) FROM tb_messages WHERE to_user_id=${user_id} GROUP BY from_user_id)`));
}

const getMessageById = async(id)=>{
    return await knex(messages).select(['message_id', 'message', 'create_time'])
    .where('message_id', '=', id).andWhere('message_status', '=', '1');
}

const updateAccountName = async(id, name)=>{
    return await knex(users).update({account_name:name, update_time: new Date()}).where('user_id', '=', id);
}

const updateProfilePhoto = async(id, photo_name)=>{
    await knex(users).update({profile_photo:photo_name, update_time:new Date()}).where('user_id', '=', id);
}


module.exports = {
    postMessages,
    getMessages,
    getUserContacts,
    getUserChats,
    getUser,
    clearChat,
    getOnesTypedUser,
    getOnesUserTyped,
    getMessageById,
    updateAccountName,
    updateProfilePhoto
};

