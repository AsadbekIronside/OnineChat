
const { postMessages, getMessages, getUserContacts, getUser, clearChat,
    getOnesTypedUser, getOnesUserTyped, getMessageById, updateAccountName, updateProfilePhoto,
    getAllUsers, createGroup } = require('../model/crud');

const get_main_page = async (req, res) => {
    res.locals = { title: 'chat' };
    let user = await getUser(req.session.user.user_id);
    res.render('Chat/apps-chat', { profilePhoto: user[0].profile_photo, account_name: user[0].account_name });
}

const post_messages = async (req, res) => {
    const data = {
        from_user_id: req.session.user.user_id, to_user_id: req.body.to_user_id,
        message: req.body.message, create_time: req.body.createTime
    };
    await postMessages(data);
}

const get_messages = async (req, res) => {

    let count = parseInt(req.query.count);
    // console.log(count);
    let to_user_id = parseInt(req.query.toUserId);

    let get_user = await getUser(to_user_id);
    let data = await getMessages(count, req.session.user.user_id, to_user_id);
    return res.json({ array: data, to_user_info: get_user[0] });

}

const get_contacts = async (req, res) => {

    const contactsList = await getUserContacts(req.session.user.user_id);

    res.json({ contacts: contactsList });
}

const get_chats = async (req, res) => {

   try {

        var current_user = req.session.user.user_id;
        var userTyped = await getOnesUserTyped(current_user);
        var typedUser = await getOnesTypedUser(current_user);

        var result = [];
        var result2 = [];
        var count = 0;
        var finalResult = [];

        if(typedUser.length === 0 && userTyped.length === 0){
            return res.json({data:false});
        }
       
        else if(userTyped.length > 0 && typedUser.length === 0){
            for(let i=0; i < userTyped.length; i++){
                let getUserInfo = await getUser(userTyped[i].to_user_id);
                finalResult.push({
                    user_id: getUserInfo[0].user_id,
                    account_name: getUserInfo[0].account_name,
                    profile_photo: getUserInfo[0].profile_photo
                })
            }

        }else if(typedUser.length > 0 && userTyped.length === 0){
            for(let i=0; i < typedUser.length; i++){
                let getUserInfo = await getUser(typedUser[i].user_id);
                // console.log(getUserInfo);
                let message = await getMessageById(typedUser[i].message_id);
                finalResult.push({
                    user_id: getUserInfo[0].user_id,
                    account_name: getUserInfo[0].account_name,
                    profile_photo: getUserInfo[0].profile_photo,
                    message: message[0].message,
                    create_time: message[0].create_time
                });
            }

        }else{

            for(let i=0; i < userTyped.length; i++){
                for(let j=0; j < typedUser.length; j++){

                    if(userTyped[i].to_user_id === typedUser[j].from_user_id ){
                        if(userTyped[i].message_id > typedUser[j].message_id){
                            result.push(userTyped[i].to_user_id);
                        }else{
                            result2.push({
                                message_id: typedUser[j].message_id, 
                                user_id: typedUser[j].from_user_id
                            });
                        }
                    }
                }
            }
            for(let i=0; i < userTyped.length; i++){
                count = 0;
                for(let j=0; j < typedUser.length; j++){
                    if(userTyped[i].to_user_id === typedUser[j].from_user_id)
                        count++;
                }
                if(count === 0){
                    result.push(userTyped[i].to_user_id);
                }
            }
            for(let i=0; i < typedUser.length; i++){
                count = 0;
                for(let j=0; j < userTyped.length; j++){
                    if(typedUser[i].from_user_id === userTyped[j].to_user_id)
                        count++;
                }
                if(count === 0){
                    result2.push({
                        message_id: typedUser[i].message_id,
                        user_id: typedUser[i].from_user_id
                    });
                }
            }
    
            for(let i=0; i < result2.length; i++){
                let getUserInfo = await getUser(result2[i].user_id);
                // console.log(getUserInfo);
                let message = await getMessageById(result2[i].message_id);
                finalResult.push({
                    user_id: getUserInfo[0].user_id,
                    account_name: getUserInfo[0].account_name,
                    profile_photo: getUserInfo[0].profile_photo,
                    message: message[0].message,
                    create_time: message[0].create_time
                });
            }
            // console.log("result2 = "+result2);
    
            for(let i=0; i < result.length; i++ ){
                let getUserInfo = await getUser(result[i]);
                finalResult.push({
                    user_id: getUserInfo[0].user_id,
                    account_name: getUserInfo[0].account_name,
                    profile_photo: getUserInfo[0].profile_photo
                });
            }
            // console.log('result = '+result);
            // console.log('finalResult = '+finalResult);
        }

        res.json({ chats: finalResult, data:true});
    
   } catch (error) {

    console.log(error);
   }
}

const start_chat = async (req, res) => {
    const user_id = req.query.userId;
    const user = await getUser(user_id);
    res.json(user[0]);
}

const clear_chat = async (req, res) => {

    let to_user_id = parseInt(req.query.userId);
    let from_user_id = parseInt(req.session.user.user_id);
    let result = await clearChat(from_user_id, to_user_id);
    if (result)
        return res.json({ ok: 'ok', result: to_user_id });
    else
        return res.json({ ok: 'err' });

}

const get_unreplied = async (req, res) => {

    let user_id = req.session.user.user_id;
    let userTypedList = await getOnesUserTyped(user_id);
    let typedUserList = await getOnesTypedUser(user_id);

    var userTypedMap = new Map();
    var typedUserMap = new Map();

    userTypedList.forEach((element) => {
        userTypedMap.set(element.to_user_id, element.message_id);   ///[2, 5], [5, 98]
    });

    typedUserList.forEach((element) => {
        typedUserMap.set(element.from_user_id, element.message_id); ////[2, 9], [3, 87]
    });

    var resultUsers = [];
    var resultMessages = [];

    Array.from(typedUserMap.keys()).forEach((el) => {

        if (!userTypedMap.has(el) || (userTypedMap.get(el) < typedUserMap.get(el))) {
            resultMessages.push(typedUserMap.get(el));
            resultUsers.push(el);
        }

    });

    var obj;
    var finalResult = [];
    var message;
    var user;

    for (let i = 0; i < resultUsers.length; i++) {

        user = await getUser(resultUsers[i]);
        message = await getMessageById(resultMessages[i]);

        // console.log(user);
        // console.log(message);
        user = user[0];
        message = message[0];

        obj = {
            user_id: user.user_id, username: user.username, account_name: user.account_name,
            profile_photo: user.profile_photo, message: message.message, create_time: message.create_time
        };
        finalResult.push(obj);

    }

    res.json({ result: finalResult });


}

const update_account_name = async (req, res) => {
    let result = await updateAccountName(req.session.user.user_id, req.body.name);
    res.json({ ok: 'ok', result: result });
}

const update_profile_photo = async (req, res) => {
    await updateProfilePhoto(req.session.user.user_id, req.file.filename);
    res.json({ ok: 'ok', result: req.file.filename });
}

const get_user_info = async (req, res) => {
    let userInfo = await getUser(req.session.user.user_id);
    res.json({ ok: 'ok', result: userInfo[0] })
}

const get_all_users = async (req, res) => {
    let allusers = await getAllUsers(req.session.user.user_id);
    res.json({ ok: 'ok', result: allusers });
}

const create_group = async (req, res) => {
    // console.log(req.body.data);
    let data = {
        name: req.body.data.name,
        users: req.body.data.users,
        owner: req.session.user.user_id
    };
    let datum = await createGroup(data);
    if (datum)
        res.json({ data: true });
    else
        res.json({ data: false });
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
    get_user_info,
    update_profile_photo,
    get_all_users,
    create_group
}