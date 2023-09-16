
function addMessage(message, to_user_info) {

    const time = new Date(message.create_time);
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if(hours < 10){
        hours = '0' + hours;
    }
    var temp;
    if (message.from_user_id !== to_user_info.user_id) {
        temp = ` <li class="right">
                        <div class="conversation-list">
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content">
                                    <p class="mb-0">${message.message}</p>
                                 <div class="btn-group dropstart" style="position:absolute; rigtht:0; bottom:26px; margin-left:15px;">
                                    <a class="dropdown-toggle" data-bs-toggle="dropdown" data-toggle="dropdown">
                                    <i class="ri-more-2-fill ri-lg"></i>
                                    </a>
                                 <div class="dropdown-menu">
                                     <a class="dropdown-item" href="#"><i class="ri-pencil-fill"></i></a>
                                     <a class="dropdown-item" href="#"><i class="ri-delete-bin-7-fill"></i></a>
                                 </div>
                             </div>
                                </div>
                                <p class="chat-time mb-0"><i class="mdi mdi-clock-outline me-1"></i> ${hours}:${minutes}</p>
                                 
                            </div>
                            
                        </div>
                </li>`;
    } else {
        temp = `<li >
                    <div class="conversation-list">
                        <div class="chat-avatar">
                            <img src="${to_user_info.profile_photo}" alt="avatar-2">
                        </div>
                        <div class="ctext-wrap">
                            <div class="conversation-name">${to_user_info.account_name}</div>
                            <div class="ctext-wrap-content">
                                <p class="mb-0">${message.message}</p>
                            </div>
                            <p class="chat-time mb-0"><i class="mdi mdi-clock-outline me-1"></i>${hours}:${minutes}</p>
                        </div>
                        
                    </div>
                </li>`
    }

    $('#messageList').append(temp);
    scrollToBottom();
}

async function sendMesssage() {
    const mess = document.getElementById('message').value;
    const toUserId = document.getElementById('userId').innerHTML;
    const time = new Date();

    document.getElementById('message').value = '';

    if (!mess)
        return;

        await fetch('/post-messages', {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            message: mess,
            createTime: time,
            to_user_id: toUserId
        })
    });
}
var count = 0;

async function getMessages(to_user_id) {
    console.log('count=' + count);
    const response = await fetch('/get-messages?count=' + count + '&toUserId=' + to_user_id)
        .then(response => response.json());

    const messageList = response.array;
    // console.log(messageList);
    const to_user_info = response.to_user_info;

    if (messageList.length > 0) {
        count = messageList[messageList.length - 1].message_id;
        // console.log('zzzzzzzzzzzzzzzzzzzzz=' + count);
        messageList.forEach((element)=>{
            addMessage(element, to_user_info);
        });
    }
}

document.getElementById('send_button').addEventListener('click', async() => {
    await sendMesssage();
});

// press enter

const input = document.getElementById('message');

input.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('send_button').click();
    }
});


//scroll
const scrollToBottom = () => {
    // get the div element by its id
    const div = document.getElementById("chat_area");
    // smooth scroll to the bottom of the div
    div.scrollTo({
        top: div.scrollHeight,
        behavior: 'smooth'
    });
}
(scrollToBottom)();

///////////////////contacts

var result;

const add_contacts = async (user) => {
    const contactTemp =
        `<a href="javascript: void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_new_chat(${user.user_id})" 
         id="a${user.user_id}">
            <div class="card m-0">
            <div class="row no-gutters align-items-center">
                <div class="col-md-4">
                <img src="${user.profile_photo}" class="rounded-circle ms-3" style="height:80px;">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h6 class="fw-bolder">${user.account_name}</h6><small class="fw-bolder text-primary">@${user.username}</small>
                    </div>
                </div>
            </div>
            </div>
        </a> `;

    result += contactTemp;
}
const get_contacts = async () => {
    result = '';
    $('#modal_body_group').html('');

    await fetch('/get-contacts')
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('contacts');
            localStorage.setItem('contacts', JSON.stringify(data));
            data.contacts.forEach(user => add_contacts(user));
            $('#modal_body_group').append(result);
        });
}

var myInterval = setInterval(() => { }, 10000);

const start_new_chat = async (userId) => {
    count = 0;
    clearInterval(myInterval);
    const response = await fetch('/start-chat?userId=' + userId)
        .then(response => response.json());
    const toUser = $('#to_user');
    toUser.html('');

    const result =
        `<h5 class="font-size-15 mb-1 text-truncate">${response.account_name}<p id="userId" hidden>${response.user_id}</p></h5>
    <p class="text-truncate mb-0"><i class="mdi mdi-circle text-success align-middle me-1"></i> Active now</p>`;

    toUser.append(result);
    $('#messageList').html('');

    document.getElementById('search').removeAttribute('hidden');
    document.getElementById('params').removeAttribute('hidden');

    myInterval = setInterval(() => {
        getMessages(userId);
        // console.log('log ishlavotti');
    }, 1000);

    document.querySelector('#modal_close_contact').click();
};

///// live search contacts

document.getElementById('searchContact').addEventListener('keyup', ()=>{
    let val = document.getElementById('searchContact').value;

    console.log('val = '+val);

    let contacts = localStorage.getItem('contacts');
    contacts = JSON.parse(contacts).contacts;
    // console.log(contacts);
    contacts.forEach((user)=>{

        // console.log(typeof user);

        // console.log();
        if(user.username.includes(val)){
            console.log(user);
            childNode = document.getElementById('a'+user.user_id);
            document.getElementById('modal_body_group').removeChild(childNode);
            document.getElementById('modal_body_group').prepend(childNode);
        }
    });
});



//// get chats

var resultChat;

const add_chats = async (user) => {

    var now = new Date();
    var time = new Date(user.create_time);
    var resultTime;
    console.log(user);
    if (now.getDate() - time.getDate() > 0)
        resultTime = now.getDate() - time.getDate() + '  days ago';
    else if (now.getHours() - time.getHours() > 0)
        resultTime = now.getHours() - time.getHours() + ' hours ago';
    else
        resultTime = now.getMinutes() - time.getMinutes() + ' minutes ago';

    const contactTemp =
        ` <li id="b${user.user_id}">
            <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_chat(${user.user_id})">
                <div class="d-flex">
                    <div class="user-img away  align-self-center me-4 ">
                        <img src="${user.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                    </div>
                    <div class="flex-1 overflow-hidden align-self-center">
                        <h5 class="text-truncate font-size-14 mb-1">${user.account_name}</h5>
                        <p class="text-truncate mb-0">${user.message}</p>
                    </div>
                    <div class="font-size-11">${resultTime}</div>
                </div>
            </a>
         </li>`;

    resultChat += contactTemp;
}

const get_chats = async () => {
    resultChat = '';
    await fetch('/get-chats')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('chats', JSON.stringify(data))
            data.chats.forEach(user => add_chats(user));
            $('#chatsGroup').append(resultChat);
        });
}

// (get_chats)();
$(document).ready(function () {
    get_chats();
});


var myInterval = setInterval(() => { }, 10000);

const start_chat = async (userId) => {

    // console.log('This inside start_chat');
    count = 0;
    clearInterval(myInterval);

    const response = await fetch('/start-chat?userId=' + userId)
        .then(response => response.json());
        
    const toUser = $('#to_user');
    toUser.html('');

    const result =
        `<h5 class="font-size-15 mb-1 text-truncate">${response.account_name}<p id="userId" hidden>${response.user_id}</p></h5>
    <p class="text-truncate mb-0"><i class="mdi mdi-circle text-success align-middle me-1"></i> Active now</p>`;
    toUser.append(result);

    $('#messageList').html('');

    const cardBody =
        `<h5 class="card-title fw-bolder">Name:</h5>
            <h6 class="card-text ">${response.account_name}</h6>
            <h5 class="card-title fw-bolder">Username:</h5>
            <p class="card-text ">@${response.username}</p>
            <p class="card-text"><small class="text-primary">Active now</small></p>`;

    $('#cardBody').append(cardBody);
    
    document.getElementById('search').removeAttribute('hidden');
    document.getElementById('params').removeAttribute('hidden');

    myInterval = setInterval(() => {
        getMessages(userId);
        // console.log('log ishlavotti');
    }, 1000);
    document.querySelector('#modal_close_chat').click();
};

////  search chats

document.getElementById('searchChats').addEventListener('keyup', ()=>{
    let val = document.getElementById('searchChats').value;

    console.log('val = '+val);

    let chats = localStorage.getItem('chats');
    chats = JSON.parse(chats).chats;
    // console.log(contacts);
    chats.forEach((user)=>{

        // console.log(typeof user);

        // console.log();
        if(user.username.includes(val)){
            // console.log(user);
            childNode = document.getElementById('b'+user.user_id);
            document.getElementById('chatsGroup').removeChild(childNode);
            document.getElementById('chatsGroup').prepend(childNode);
        }
    });
});


//alerts

async function clearChat(){

    const to_user_id = document.getElementById('userId').innerHTML;
    
    const response = await fetch('/clear-chat?userId='+to_user_id)
    .then(response => response.json());

    return response.ok.startsWith('ok') ? parseInt(response.result) : -1;
}
