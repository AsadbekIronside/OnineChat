const knex = require('../db/db_init');
const messages = 'tb_messages';
const users = 'tb_users';
const groups = 'tb_groups';
const groupMessages = 'tb_group_messages';

const postMessages = async (data) => {
    await knex.raw(
        `INSERT INTO tb_messages(from_user_id, to_user_id, message, create_time)VALUES(${data.from_user_id}, 
        ${data.to_user_id}, "${data.message}", "${data.create_time}");`);
    console.log('message posted');
}

const getMessages = async (count, from_user_id, to_user_id) => {
    return await knex(messages)
        .select(['message_id', 'from_user_id', 'to_user_id', 'message', 'create_time'])
        .where(knex.raw(`((from_user_id=${from_user_id} AND to_user_id=${to_user_id}) OR (from_user_id=${to_user_id} AND to_user_id=${from_user_id}))`))
        .andWhere('message_status', '=', '1')
        .andWhere(knex.raw(`message_id>${count}`))
        .orderBy('create_time');
}

const getMessagesUserRelated = async (current_user_id) => {

    return await knex(messages).select(['from_user_id', 'to_user_id'])
       .where('message_status', '=', '1')
       .andWhere('from_user_id', '=', current_user_id)
       .orWhere('to_user_id', '=', current_user_id);

}

const getUser = async (user_id) => {
    return await knex(users).select(['user_id', 'username', 'account_name', 'profile_photo'])
        .where('user_id', '=', user_id)
        .andWhere('user_status', '=', '1');
}

const clearChat = async (from_user_id, to_user_id) => {
    return await knex(messages).update({ message_status: 0, delete_time: new Date() })
        .where(knex.raw(`((from_user_id=${from_user_id} AND to_user_id=${to_user_id}) OR (from_user_id=${to_user_id} AND to_user_id=${from_user_id}))`))
        .andWhere('message_status', '=', '1');

}

const getOnesUserTyped = async (user_id) => {
    return await knex(messages).select(['message_id', 'from_user_id', 'to_user_id'])
        .where('message_status', '=', '1')
        .andWhere(knex.raw(`message_id IN (SELECT MAX(message_id) FROM tb_messages WHERE from_user_id=${user_id} GROUP BY to_user_id)`));
}

const getOnesTypedUser = async (user_id) => {
    return await knex(messages).select(['message_id', 'from_user_id', 'to_user_id'])
        .where('message_status', '=', '1')
        .andWhere(knex.raw(`message_id IN (SELECT MAX(message_id) FROM tb_messages WHERE to_user_id=${user_id} GROUP BY from_user_id)`));
}

const getMessageById = async (id) => {
    return await knex(messages).select(['message_id', 'message', 'create_time'])
        .where('message_id', '=', id).andWhere('message_status', '=', '1');
}

const updateAccountName = async (id, name) => {
    return await knex(users).update({ account_name: name, update_time: new Date() }).where('user_id', '=', id);
}

const updateProfilePhoto = async (id, photo_name) => {
    await knex(users).update({ profile_photo: photo_name, update_time: new Date() }).where('user_id', '=', id);
}

const getAllUsers = async (user_id) => {
    return await knex(users).select(['user_id', 'username', 'account_name', 'profile_photo'])
        .where('user_status', '=', '1').andWhere('user_id', '<>', user_id);
}

//groups 

const createGroup = async (group) => {
    return await knex(groups)
        .insert({
            name: group.name,
            users: group.users,
            owner: group.owner,
            create_time: new Date()
        })
        .then(result => {
            return result;
        })
        .catch(e => {
            return false;
        });


}

const getAllGroups = async ()=>{
    return await knex(groups).select(['id', 'name', 'users', 'owner', 'admins', 'photo'])
    .where('status', '=', '1')
    .then(result=>{
        return result;  
    })
    .catch(err => {
        return false;
    });
}

const getGroupById = async (id)=>{
    return await knex(groups).select(['id','name', 'owner', 'users', 'admins', 'photo'])
    .where('id', '=', id)
    .then(result =>{
        return result;
    })
    .catch(err => {
        console.log(err);
        return false;
    });
}

const getGroupMessages = async(id, count)=>{
    return await knex(users).select([ 'user_id', 'username', 'account_name', 'profile_photo', 'id', 'message', 'tb_group_messages.create_time'])
    .innerJoin(groupMessages, 'tb_group_messages.user', 'tb_users.user_id')
    .where('group', '=', id)
    .andWhere('user_status', '=', '1')
    .andWhere('id', '>', count)
    .then(result => {
        return result;
    })
    .catch(err => {
        console.log(err);
        return false;
    });
}

const postGroupMessages = async(user, group, message)=>{
    return await knex(groupMessages).insert({
        user:user,
        group:group,
        message:message,
        create_time: new Date()
    })
    .then(result =>{
        return result;
    })
    .catch(err => {
        console.log(err);
        return false;
    });
        
}

const updateGroupUsers = async(users, id)=>{
    return await knex(groups).update({users:users, update_time: new Date()})
    .where('id', '=', id)
    .then(result =>{
        return result;
    })
    .catch(err =>{
        console.log(err);
        return false;
    });
}

const deleteGroup = async(id)=>{
    return knex(groups).update({status:0, delete_time: new Date(), owner:0})
    .where('id', '=', id)
    .then(result => {
        return true;
    })
    .catch(err =>{
        console.log(err);
        return false;
    });
}

module.exports = {
    postMessages,
    getMessages,
    getMessagesUserRelated,
    getUser,
    clearChat,
    getOnesTypedUser,
    getOnesUserTyped,
    getMessageById,
    updateAccountName,
    updateProfilePhoto,
    getAllUsers,
    createGroup,
    getAllGroups,
    getGroupById,
    getGroupMessages,
    postGroupMessages,
    updateGroupUsers,
    deleteGroup
};

