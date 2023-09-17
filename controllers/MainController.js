const { postMessages, getMessages, getUserContacts, getUserChats, getUser, clearChat,
        getOnesTypedUser, getOnesUserTyped, getMessageById, updateAccountName} = require('../model/crud');

const get_main_page = async(req, res)=>{
    res.locals = { title: 'chat' };
    let user = await getUser(req.session.user.user_id);
    res.render('Chat/apps-chat', { profilePhoto:user[0].profile_photo, account_name:user[0].account_name});
}

const post_messages = async (req, res) => {
    const data = { from_user_id: req.session.user.user_id, to_user_id:req.body.to_user_id, 
        message: req.body.message, create_time: req.body.createTime  };
    await postMessages(data);
}

const get_messages = async (req, res) => {

    let count = parseInt(req.query.count);
    // console.log(count);
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
    let chatsList = await getUserChats(current_user);

    // console.log(contactsList);
    res.json({chats:chatsList});
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

const get_unreplied = async(req, res)=>{

    let user_id = req.session.user.user_id;
    let userTypedList = await getOnesUserTyped(user_id);
    let typedUserList = await getOnesTypedUser(user_id);

    var userTypedMap = new Map() ;
    var typedUserMap = new Map();

    userTypedList.forEach((element)=>{
        userTypedMap.set(element.to_user_id, element.message_id);   ///[2, 5], [5, 98]
    });

    typedUserList.forEach((element)=>{
        typedUserMap.set(element.from_user_id, element.message_id); ////[2, 9], [3, 87]
    });

    var resultUsers = [];
    var resultMessages = [];

    Array.from(typedUserMap.keys()).forEach((el)=>{

        if(!userTypedMap.has(el) || (userTypedMap.get(el) < typedUserMap.get(el))){
            resultMessages.push(typedUserMap.get(el));
            resultUsers.push(el);
        }
    
    });

    var obj;
    var finalResult = [];
    var message;
    var user;
    
    for(let i=0; i < resultUsers.length; i++){

        user = await getUser(resultUsers[i]);
        message = await getMessageById(resultMessages[i]);

        // console.log(user);
        // console.log(message);
        user = user[0];
        message = message[0];

        obj = { user_id: user.user_id, username:user.username, account_name: user.account_name, 
                profile_photo:user.profile_photo, message: message.message, create_time:message.create_time};
        finalResult.push(obj);

    }

    res.json({result:finalResult});
    

}

const update_account_name = async(req, res)=>{
    let result = await updateAccountName(req.session.user.user_id, req.body.name);
    res.json({ok:'ok', result:result});
}

const get_user_info = async(req, res)=>{
    let userInfo = await getUser(req.session.user.user_id);
    res.json({ok:'ok', result:userInfo[0]})
}


module.exports = {
    get_main_page,
    post_messages,
    get_messages,
    get_contacts,
    get_chats,
    start_chat,
    clear_chat,
    get_unreplied,
    update_account_name,
    get_user_info
}