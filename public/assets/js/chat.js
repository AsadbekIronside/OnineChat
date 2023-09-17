
var titleArray = [];

function addMessage(message, to_user_info) {

    const time = new Date(message.create_time);
    const currentdate = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var months = time.getMonth();
    var days = time.getDate();

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    var temp = '';
    var dayTitle = '';
    // console.log('months='+months);
    // console.log('days='+days);

    if(months === currentdate.getMonth() && days === currentdate.getDate()){
      
        dayTitle+='Today';
        // console.log(dayTitle);

        if(!titleArray.includes(dayTitle)){
   
            temp +=`<li> 
                       <div class="chat-day-title">
                            <span class="title">${dayTitle}</span>
                       </div>
                     </li>`;
            titleArray.push(dayTitle);
        }

    }
    else if(months === currentdate.getMonth() && days < currentdate.getDate()){

        dayTitle+=days+' ';
        
        switch(months){
            case 0: dayTitle+='January'; break;
            case 1: dayTitle+='February'; break;
            case 2: dayTitle+='March'; break;
            case 3: dayTitle+='April'; break;
            case 4: dayTitle+='May'; break;
            case 5: dayTitle+='June'; break;
            case 6: dayTitle+='July'; break;
            case 7: dayTitle+='August'; break;
            case 8: dayTitle+='September'; break;
            case 9: dayTitle+='Oktober'; break;
            case 10: dayTitle+='November'; break;
            case 11: dayTitle+='December'; break;
        }

        if(!titleArray.includes(dayTitle)){

            temp +=`<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }
    }
    else if(months <= currentdate.getMonth()){
        dayTitle+=days+' ';

        switch(months){
            case 0: dayTitle+='January'; break;
            case 1: dayTitle+='February'; break;
            case 2: dayTitle+='March'; break;
            case 3: dayTitle+='April'; break;
            case 4: dayTitle+='May'; break;
            case 5: dayTitle+='June'; break;
            case 6: dayTitle+='July'; break;
            case 7: dayTitle+='August'; break;
            case 8: dayTitle+='September'; break;
            case 9: dayTitle+='Oktober'; break;
            case 10: dayTitle+='November'; break;
            case 11: dayTitle+='December'; break;
        }

        if(!titleArray.includes(dayTitle)){

            temp +=`<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }

    }


    if (message.from_user_id !== to_user_info.user_id) {
        temp += ` <li class="right">
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
        temp += `<li >
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
function sendMesssage() {
    const mess = document.getElementById('message').value;
    const toUserId = document.getElementById('userId').innerHTML;
    const time = new Date();

    document.getElementById('message').value = '';

    if (!mess)
        return;

        fetch('/post-messages', {
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
    sendMesssage();
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

    myInterval = setInterval(async () => {
        await getMessages(userId);
        // console.log('log ishlavotti');
    }, 800);

    document.querySelector('#modal_close_contact').click();
    
};



///// live search contacts

document.getElementById('searchContact').addEventListener('keyup', ()=>{

    let val = document.getElementById('searchContact').value;

    // console.log('val = '+val);

    let contacts = localStorage.getItem('contacts');
    contacts = JSON.parse(contacts).contacts;
    // console.log(contacts);
    contacts.forEach((user)=>{

        // console.log(typeof user);

        // console.log();
        if(user.username.toLowerCase().includes(val.toLowerCase())){
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
        ` <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_chat(${user.user_id})" id="b${user.user_id}">
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
           </a>`;

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


    titleArray = [];
    myInterval = setInterval(async () => {
        await getMessages(userId);
        // console.log('log ishlavotti');
    }, 800);

};

////  search chats

document.getElementById('searchChats').addEventListener('keyup', ()=>{
    var val = document.getElementById('searchChats').value;

    console.log('val = '+val);

    let chats = localStorage.getItem('chats');
    chats = JSON.parse(chats).chats;
    // console.log(contacts);
    chats.forEach((user)=>{

        // console.log(typeof user);

        // console.log();
        if(user.username.toLowerCase().includes(val.toLowerCase())){
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




/////Notification

var resultUnrep;

const add_unreplied = async (user)=>{

    var now = new Date();
    var time = new Date(user.create_time);
    var resultTime;
    // console.log(user);
    if (now.getDate() - time.getDate() > 0)
        resultTime = now.getDate() - time.getDate() + ' days ago';
    else if (now.getHours() - time.getHours() > 0)
        resultTime = now.getHours() - time.getHours() + ' hours ago';
    else
        resultTime = now.getMinutes() - time.getMinutes() + ' minutes ago';
    
    var unrepliedTemp =
    `<li id="c${user.user_id}">
        <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_unreplied_chat(${user.user_id})">
            <div class="d-flex">
                <img src="${user.profile_photo}" class="me-3 rounded-circle avatar-xs" alt="user-pic">
                <div class="flex-1">
                    <h6 class="mt-0 mb-1">${user.account_name}</h6>
                    <div class="font-size-12 text-muted">
                        <p class="mb-1">${user.message}.</p>
                        <p class="mb-0"><i class="mdi mdi-clock-outline me-2"></i>${resultTime}</p>
                    </div>
                </div>
            </div>
        </a>
     </li>`;

     resultUnrep+=unrepliedTemp;

}

const get_unreplied = async () => {

    $('#notifGroup').html('');
    resultUnrep = '';
    await fetch('/get-unreplied')
        .then(response => response.json())
        .then(data => {
            data.result.forEach(user => add_unreplied(user));
            $('#notifGroup').append(resultUnrep);

            if(data.result.length>0){
                document.querySelector('.noti-dot').removeAttribute('hidden');
            }else{
                document.querySelector('.noti-dot').setAttribute('hidden', true);
            }
        });
}

$(document).ready(async()=>{
   await get_unreplied();
});

const start_unreplied_chat = async(userId)=>{
    await start_chat(userId);

    var child = document.getElementById('c'+userId);
    var fatherDiv = document.getElementById('notifGroup');
    fatherDiv.removeChild(child);

    // await get_unreplied();

}



////////////////////save account_name


document.getElementById('saveName').addEventListener('click', async()=>{
    let val = document.getElementById('newName').value;
    document.getElementById('newName').value='';
    // console.log('value='+val);
    if(val){
        await fetch('/update-user-name', {
            method:'POST',
            mode:'cors',
            headers:{"Content-type":"application/json; charset=UTF-8"},
            body:JSON.stringify({name:val})
        }).then(response=>response.json());
        document.getElementById('accountName').innerHTML = val;
        document.getElementById('topRigthName').innerHTML = val;
    }
});

/////

const show_user_profile = async()=>{

    let user = await fetch('get-user-info')
    .then(response => response.json())
    .then(response => response.result );

    let userProfile = 
    `   <div class="col-md-4">
            <img class="card-img img-fluid rounded-circle img-thumbnail" src="${user.profile_photo}" alt="Card image">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title fw-bolder">Name:</h5>
                <h6 class="card-text " id="accountName">${user.account_name}</h6>
                <h5 class="card-title fw-bolder">Username:</h5>
                <p class="card-text ">@${user.username}</p>
                <p class="card-text"><small class="text-primary">Active now</small></p>
            </div>
        </div>`;

    let currentName = 
    `Current Name:<input type="text" class="form-control" value="${user.account_name}" style="width: 60%;" readonly>`
       
    $('#userProfileCard').html('');
    $('#userProfileCard').append(userProfile);
    $('#currentName').html('');
    $('#currentName').append(currentName);
    $('#topRigthName').html(user.account_name);
}