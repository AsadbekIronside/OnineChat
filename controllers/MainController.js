const { postMessages, getMessages, getUserContacts, getUserChats, getUser,
        getLastMessage, clearChat} = require('../model/crud');

const get_main_page = async(req, res)=>{
    res.locals = { title: 'chat' };
    var name;
    if (req.session.user.id === 1)
          name = 'Asadbek Shariyorov';
    else
          name = 'Frank Vickery';

    res.render('Chat/apps-chat', { user_name: name, profilePhoto:req.session.user.profile_photo, 
          account_name:req.session.user.account_name, username:req.session.user.username});
}

const post_messages = async (req, res) => {
    const data = { from_user_id: req.session.user.user_id, to_user_id:req.body.to_user_id, 
        message: req.body.message, create_time: req.body.createTime  };
    await postMessages(data);
}

const get_messages = async (req, res) => {

    let count = parseInt(req.query.count);
    console.log(count);
    let to_user_id = parseInt(req.query.toUserId);

    let get_user = await getUser(to_user_id);
    let data = await getMessages(count, req.session.user.user_id, to_user_id);
    return res.json({ array: data, to_user_info:get_user[0]});

}

const get_contacts = async(req, res)=>{

    const contactsList = await getUserContacts(req.session.user.user_id);

    res.json({contacts:contactsList});
}

const get_chats = async(req, res)=>{

    let current_user = req.session.user.user_id;
    //get all users
    const contactsList = await getUserChats(current_user);

    console.log(contactsList);
    res.json({contacts:contactsList});
}

const start_chat = async(req, res)=>{
    const user_id = req.query.userId; 
    const user = await getUser(user_id);
    res.json(user[0]);
}

const clear_chat = async(req, res)=>{

    let to_user_id = parseInt(req.query.userId);
    let from_user_id = parseInt(req.session.user.user_id);
    let result = await clearChat(from_user_id, to_user_id);
    if(result)
        return res.json({ok:'ok', result:to_user_id});
    else 
        return res.json({ok:'err'});

}

module.exports = {
    get_main_page,
    post_messages,
    get_messages,
    get_contacts,
    get_chats,
    start_chat,
    clear_chat
}