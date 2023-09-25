
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

    if (months === currentdate.getMonth() && days === currentdate.getDate()) {

        dayTitle += 'Today';
        // console.log(dayTitle);

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                       <div class="chat-day-title">
                            <span class="title">${dayTitle}</span>
                       </div>
                     </li>`;
            titleArray.push(dayTitle);
        }

    }
    else if (months === currentdate.getMonth() && days < currentdate.getDate()) {

        dayTitle += days + ' ';

        switch (months) {
            case 0: dayTitle += 'January'; break;
            case 1: dayTitle += 'February'; break;
            case 2: dayTitle += 'March'; break;
            case 3: dayTitle += 'April'; break;
            case 4: dayTitle += 'May'; break;
            case 5: dayTitle += 'June'; break;
            case 6: dayTitle += 'July'; break;
            case 7: dayTitle += 'August'; break;
            case 8: dayTitle += 'September'; break;
            case 9: dayTitle += 'Oktober'; break;
            case 10: dayTitle += 'November'; break;
            case 11: dayTitle += 'December'; break;
        }

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }
    }
    else if (months <= currentdate.getMonth()) {
        dayTitle += days + ' ';

        switch (months) {
            case 0: dayTitle += 'January'; break;
            case 1: dayTitle += 'February'; break;
            case 2: dayTitle += 'March'; break;
            case 3: dayTitle += 'April'; break;
            case 4: dayTitle += 'May'; break;
            case 5: dayTitle += 'June'; break;
            case 6: dayTitle += 'July'; break;
            case 7: dayTitle += 'August'; break;
            case 8: dayTitle += 'September'; break;
            case 9: dayTitle += 'Oktober'; break;
            case 10: dayTitle += 'November'; break;
            case 11: dayTitle += 'December'; break;
        }

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }

    }


    if (message.from_user_id !== to_user_info.user_id) {
        temp += ` <li class="right" id="message${message.message_id}">
                        <div class="conversation-list">
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content">
                                    <p class="mb-0" id="mess${message.message_id}">${message.message}</p>
                                    <div class="btn-group dropstart" style="position:absolute; bottom:26px; margin-left:15px;">
                                            <a class="dropdown-toggle" data-bs-toggle="dropdown" data-toggle="dropdown">
                                            <i class="ri-more-2-fill ri-lg"></i>
                                            </a>
                                        <div class="dropdown-menu" style="position:absolute; min-width:0.3rem;">
                                            <a class="dropdown-item" style="padding:0.3rem 1.2rem;" href="#editMessage" data-bs-toggle="modal"
                                             onclick="edit_message(${message.message_id})"><i class="ri-pencil-fill"></i></a>
                                            <a class="dropdown-item" style="padding:0.3rem 1.2rem;" href="#" onclick="delete_message(${message.message_id })"><i class="ri-delete-bin-7-fill"></i></a>
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
                            <img src="public/assets/uploadImages/${to_user_info.profile_photo}" alt="avatar-2">
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
async function sendMessage() {
    const mess = document.getElementById('message').value;
    const toUserId = document.getElementById('userId').innerHTML;
    const time = new Date();

    // console.log(toUserId);

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
        messageList.forEach((element) => {
            addMessage(element, to_user_info);
        });
    }
}

const delete_message = async(id) => {
    let result = await fetch('/delete-message?id='+id)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {console.log(err);});

    if(result){
        $('#message'+id).remove();
        Swal.fire({
            title: 'Deleted!',
            icon: 'success'
          });
    }else{
        Swal.fire({
            title: 'Failed!',
            text: 'Unknown error occured.',
            icon: 'error'
          })
    }
    
}

const edit_message = async (id) => {
    
    let mess = await fetch('/get-edit-message?id='+id)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {console.log(err);})
    
    // console.log(mess);
    if(mess){

        $('#updateMessage').val(mess.message);
        $('#sendEditMess').click(async ()=>{

            var message = $('#updateMessage').val();

            if(message.localeCompare(mess.message) !== 0){

                var result = await fetch ('/edit-message?id='+id, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({mess: message})
                })
                .then(response => response.json())
                .then(response => response.result)
                .catch(err => {console.log(err);});

                if(result){
                    Swal.fire({
                        title: 'Edited!',
                        icon: 'success'
                      });
                      $('#mess'+mess.message_id).html(message);
                }else{
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Unknown error occured.',
                        icon: 'error'
                      })
                }

            }

        });

        $('#updateMessage').keypress((event) => { 
            if(event.key === 'Enter'){
                event.preventDefault();
                $('#sendEditMess').click();
            }
        });
    }
}

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
                    <div class="col-5 col-sm-4">
                    <img src="public/assets/uploadImages/${user.profile_photo}" class="rounded-circle ms-3" style="height:80px; width:80px;">
                    </div>
                    <div class="col-7 col-sm-8">
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
            console.log('contacts'+ data);
            localStorage.removeItem('contacts');
            localStorage.setItem('contacts', JSON.stringify(data));
            data.contacts.forEach(user => add_contacts(user));
            $('#modal_body_group').html('');
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

    $('#toUserPhoto').html('');
    $('#toUserPhoto').append(`<img class="card-img img-fluid rounded-circle img-thumbnail" 
    style="background-position: center; height: 140px; width: 140px; object-fit: cover;"
     src="public/assets/uploadImages/${response.profile_photo}" alt="Card image">`);

    document.getElementById('search').removeAttribute('hidden');
    document.getElementById('params').removeAttribute('hidden');

    let chatTemp = 
    ` <a class="dropdown-item" href="#toUserProfile" data-bs-toggle="modal">View Profile</a>
      <a class="dropdown-item" href="javascript:void(0);" onclick="clearChat2()">Clear chat</a>`;

    $('#dropdownMenu').html('');

    $('#dropdownMenu').append(chatTemp);

    myInterval = setInterval(async () => {
        await getMessages(userId);
        // console.log('log ishlavotti');
    }, 800);

    document.querySelector('#modal_close_contact').click();
    const contactTemp =
    ` <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_chat(${response.user_id})" id="b${response.user_id}">
            <div class="d-flex">
                <div class="user-img away  align-self-center me-4 ">
                    <img src="public/assets/uploadImages/${response.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                </div>
                <div class="flex-1 overflow-hidden align-self-center">
                    <h5 class="text-truncate font-size-14 mb-1">${response.account_name}</h5>
                </div>
            </div>
       </a>`;

    $('#chatsGroup').append(contactTemp);

       ///enter messaage div
    let enterMessage = 
            `<div class="col">
                <div class="position-relative">
                    <input id="message" name="message" type="text" class="form-control chat-input" placeholder="Enter Message...">        
                </div>
            </div>
            <div class="col-auto">
                <button type="button" id="send_button" class="btn btn-primary chat-send w-md waves-effect waves-light" onclick="sendMessage()"><span class="d-none d-sm-inline-block me-2">Send</span> <i class="mdi mdi-send"></i></button>
            </div>`;

    $('#enterMessage').html('');
    $('#enterMessage').append(enterMessage);

    //press enter
    document.getElementById('message').addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('send_button').click();
        }
    });
};



///// live search contacts

document.getElementById('searchContact').addEventListener('keyup', async() => {

    let val = document.getElementById('searchContact').value;

    if(!val)
        await get_contacts();
    // console.log('val = '+val);

    let contacts = localStorage.getItem('contacts');
    contacts = JSON.parse(contacts).contacts;
    // console.log(contacts);
    for(let i=0; i < contacts.length; i++){
        
        if (!contacts[i].username.toLowerCase().includes(val.toLowerCase())) {
            // console.log(user);
            childNode = document.getElementById('a' + contacts[i].user_id);
            document.getElementById('modal_body_group').removeChild(childNode);
            contacts.splice(i, 1);
            localStorage.removeItem('contacts');
            localStorage.setItem('contacts', JSON.stringify({contacts: contacts}) );
        }
    }
});

//// get chats

var resultChat;

const add_chats = async (user) => {

    var now = new Date();
    var time = new Date(user.create_time);
    var resultTime;
    // console.log(user);
    if (now.getDate() - time.getDate() > 0)
        resultTime = now.getDate() - time.getDate() + '  days ago';
    else if (now.getHours() - time.getHours() > 0)
        resultTime = now.getHours() - time.getHours() + ' hours ago';
    else
        resultTime = now.getMinutes() - time.getMinutes() + ' minutes ago';

    if(user.message){

        var contactTemp =
        ` <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_chat(${user.user_id})" id="b${user.user_id}">
                <div class="d-flex">
                    <div class="user-img away  align-self-center me-4 ">
                        <img src="public/assets/uploadImages/${user.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                    </div>
                    <div class="flex-1 overflow-hidden align-self-center">
                        <h5 class="text-truncate font-size-14 mb-1">${user.account_name}</h5>
                        <p class="text-truncate mb-0">${user.message}</p>
                    </div>
                    <div class="font-size-11">${resultTime}</div>
                </div>
           </a>`;

    }else{

        var contactTemp =
        ` <a href="javascript:void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_chat(${user.user_id})" id="b${user.user_id}">
                <div class="d-flex">
                    <div class="user-img away  align-self-center me-4 ">
                        <img src="public/assets/uploadImages/${user.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                    </div>
                    <div class="flex-1 overflow-hidden align-self-center">
                        <h5 class="text-truncate font-size-14 mb-1">${user.account_name}</h5>
                    </div>
                </div>
           </a>`;

    }

    resultChat += contactTemp;
}

const get_chats = async () => {
    resultChat = '';
    await fetch('/get-chats')
        .then(response => response.json())
        .then(data => {
            if(data.data){
                // console.log(data);
                localStorage.removeItem('chats');
                localStorage.setItem('chats', JSON.stringify(data))
                data.chats.forEach(user => {
                    // console.log(user);
                    add_chats(user);
                });
                $('#chatsGroup').html('');
                $('#chatsGroup').append(resultChat);
            }
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

    $('#cardBody').html('');
    $('#cardBody').append(cardBody);

    $('#toUserPhoto').html('');
    $('#toUserPhoto').append(`<img class="card-img img-fluid rounded-circle img-thumbnail" style="object-fit: cover; height:140px; width:140px" src="public/assets/uploadImages/${response.profile_photo}" alt="Card image">`);

    document.getElementById('search').removeAttribute('hidden');
    document.getElementById('params').removeAttribute('hidden');

    let chatTemp = 
    ` <a class="dropdown-item" href="#toUserProfile" data-bs-toggle="modal">View Profile</a>
      <a class="dropdown-item" href="javascript:void(0);" onclick="clearChat2()">Clear chat</a>`;

    $('#dropdownMenu').html('');
    $('#dropdownMenu').append(chatTemp);

    ///enter messaage div
    let enterMessage = 
            `<div class="col">
                <div class="position-relative">
                    <input id="message" name="message" type="text" class="form-control chat-input" placeholder="Enter Message...">        
                </div>
            </div>
            <div class="col-auto">
                <button type="button" id="send_button" class="btn btn-primary chat-send w-md waves-effect waves-light" onclick="sendMessage()"><span class="d-none d-sm-inline-block me-2">Send</span> <i class="mdi mdi-send"></i></button>
            </div>`;

    $('#enterMessage').html('');
    $('#enterMessage').append(enterMessage);


    ///keypress
    document.getElementById('message').addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('send_button').click();
        }
    });


    titleArray = [];
    myInterval = setInterval(async () => {
        await getMessages(userId);
        // console.log('log ishlavotti');
    }, 800);

};

////  search chats

document.getElementById('searchChats').addEventListener('keyup', async() => {
    var val = document.getElementById('searchChats').value;

    // console.log('val = ' + val);
    if(!val)
        await get_chats();

    let chats = localStorage.getItem('chats');
    chats = JSON.parse(chats).chats;
    // console.log(chats);
 
    for(let i=0; i < chats.length; i++){
        if (!chats[i].account_name.toLowerCase().includes(val.toLowerCase())) {
            // console.log(user);
            childNode = document.getElementById('b' + chats[i].user_id);
            document.getElementById('chatsGroup').removeChild(childNode);
            chats.splice(i, 1);
            localStorage.removeItem('chats');
            localStorage.setItem('chats', JSON.stringify({chats: chats}));
        }
    }
});


//alerts

async function clearChat() {

    const to_user_id = document.getElementById('userId').innerHTML;

    const response = await fetch('/clear-chat?userId=' + to_user_id)
        .then(response => response.json());

    return response.ok.startsWith('ok') ? parseInt(response.result) : -1;
}

/////Notification

var resultUnrep;

const add_unreplied = async (user) => {

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
                <img src="public/assets/uploadImages/${user.profile_photo}" class="me-3 rounded-circle avatar-xs" alt="user-pic">
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

    resultUnrep += unrepliedTemp;

}

const get_unreplied = async () => {

    $('#notifGroup').html('');
    resultUnrep = '';
    var response = await fetch('/get-unreplied')
        .then(response => response.json())
        .then(data => data.result);

    if(response.length > 0){
        response.forEach(user => add_unreplied(user));
        $('#notifGroup').append(resultUnrep);
        document.querySelector('.noti-dot').removeAttribute('hidden');
    }
    else    
        document.querySelector('.noti-dot').setAttribute('hidden', true);
}

$(document).ready(async () => {
    await get_unreplied();
});

const start_unreplied_chat = async (userId) => {
    await start_chat(userId);

    var child = document.getElementById('c' + userId);
    var fatherDiv = document.getElementById('notifGroup');
    fatherDiv.removeChild(child);

    // await get_unreplied();

}



////////////////////save account_name


document.getElementById('saveName').addEventListener('click', async () => {
    let val = document.getElementById('newName').value;
    document.getElementById('newName').value = '';
    // console.log('value='+val);
    if (val) {
        await fetch('/update-user-name', {
            method: 'POST',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({ name: val })
        }).then(response => response.json());
        document.getElementById('accountName').innerHTML = val;
        document.getElementById('topRigthName').innerHTML = val;
    }
});

/////

const show_user_profile = async () => {

    let user = await fetch('get-user-info')
        .then(response => response.json())
        .then(response => response.result);

    let userProfile =
        ` <div class="col-md-4">
            <img class="card-img rounded-circle img-thumbnail" style="background-position: center; height: 140px; width: 140px; object-fit: cover;"
            src="public/assets/uploadImages/${user.profile_photo}" alt="Card image" id="userProf">
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

/////update profile image

const updatePhoto = async () => {
    // console.log('adfdsf');
    var formData = new FormData();
    var photo = document.getElementById('profilePhot').files[0];

    if (!photo)
        return;
    // console.log('photo='+photo);
    formData.append('photo', photo);

    await fetch('/update-profile-photo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById('userProf').setAttribute('src', `public/assets/uploadImages/${response.result}`);
        document.getElementById('topRightPhoto').setAttribute('src', `public/assets/uploadImages/${response.result}`);
        document.getElementById('btnClosePhoto').click();
    });

}

//////groups

const newGroup = () => {
    document.getElementById('modal_close_group').click();

}

var groupInfo;
const selectContacts = async () => {

    groupInfo = {};
    var groupNameNode = document.getElementById('groupName');
    var groupName = groupNameNode.value;
    groupNameNode.value = '';

    if (!groupName) {
        groupNameNode.style.borderColor = 'red';
        document.getElementById('groupNameLabel').style.color = 'red';
    }
    else {
        $('#selectContacts').modal('show');
        document.getElementById('closeModalgr').click();
        groupInfo.name = groupName;
        await getAllUsers();
    }
}

document.getElementById('groupName').addEventListener('keypress', (event)=>{
    if(event.key === 'Enter'){
        event.preventDefault();
        document.getElementById('nextBtn').click();
    }
})

var resultAllUser;

const getAllUsers = async () => {
    resultAllUser = '';
    await fetch('/all-users')
        .then(response => response.json())
        .then(response => {
            // console.log('response='+response);
            let user_idArray = response.result.map(user => user.user_id);
            localStorage.removeItem('allUsers');
            localStorage.setItem('allUsers', JSON.stringify({ array: user_idArray }));
            response.result.forEach((user) => { addAllUsers(user) });
            $('#select_group_users').html('');
            $('#select_group_users').append(resultAllUser);
        });
}

const addAllUsers = (user) => {
    let usersTemp =
        `<div class="form-check mb-3" id="form${user.user_id}">
            <input class="form-check-input" type="checkbox" id="formCheck${user.user_id}">
            <label class="form-check-label ms-2" for="formCheck${user.user_id}">
                <div class="d-flex">
                    <div class="user-img away align-self-center me-4">
                        <img src="public/assets/uploadImages/${user.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:30px;width:30px;">
                    </div>
                    <div class="flex-1 align-self-center me-4">
                        <h5 class="text-truncate font-size-14 mb-1">${user.account_name}</h5>
                        <p class="text-truncate mb-0 text-primary">@${user.username}</p>
                    </div>
                </div>
            </label>
         </div>`
    resultAllUser += usersTemp;
}

const createGroup = async () => {

    let result = '';
    let userIdArray = JSON.parse(localStorage.getItem('allUsers')).array;

    for (let i = 0; i < userIdArray.length; i++) {
        if (document.getElementById('formCheck' + userIdArray[i]).checked) {
            result += userIdArray[i] + ',';
        }
    }
    // console.log('result = '+result);
    result = result.substring(0, result.length - 1);

    groupInfo.users = result;

    // console.log(groupInfo);

    let result2 = await fetch('/create-group', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ data: groupInfo })
    });
    let result3 = await result2.json();
    console.log("kelgan data ::", result3);
    document.getElementById('closeModalLast').click();
    start_new_group(result3.result);
}   
var groupResult;

const getGroups = async()=>{

    groupResult = '';
    const result = await fetch('/get-groups')
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {console.log(err);});

    if(!result){
        console.log("groups: "+result);
        return;
    }

    sessionStorage.removeItem('groups');
    sessionStorage.setItem('groups', JSON.stringify({groups:result}));
    // console.log('groups = '+result);
    result.forEach((group)=>{
        add_groups(group);
    });

    $('#groupsBody').html('');
    $('#groupsBody').append(groupResult);

}

const add_groups = (group)=>{
    // console.log('group = '+group.id);

    const groupTemp =
        `<a href="javascript: void(0);" class="list-group-item list-group-item-action fw-bolder" onclick="start_new_group(${group.id})" 
            id="g${group.id}">
                <div class="card m-0">
                    <div class="row no-gutters align-items-center">
                        <div class="col-5 col-sm-4">
                        <img src="public/assets/groupImages/${group.photo}" class="rounded-circle img-thumbnail ms-3" style="height:80px; width:80px">
                        </div>
                        <div class="col-7 col-sm-8">
                            <div class="card-body">
                            <h6 class="fw-bolder">${group.name}</h6>
                            </div>
                        </div>
                    </div>
                </div>
         </a> `;

    groupResult+=groupTemp;
}

$('#searchGroup').keyup(async function (e) { 

    e.preventDefault();
    var groups = JSON.parse(sessionStorage.getItem('groups')).groups;
    var val = $('#searchGroup').val();

    if(!val){
        await getGroups();
        return;
    }

    // console.log('val = '+val);
    for(let i = 0; i < groups.length; i++){
        if(!groups[i].name.toLowerCase().includes(val.toLowerCase())){

            $('#g'+groups[i].id).remove();
            groups.splice(i, 1);
            sessionStorage.removeItem('groups');
            sessionStorage.setItem('groups', JSON.stringify({groups: groups}));
        }
    }

});

var membersTemp;

const start_new_group = async(id)=>{

    let group = await fetch('/get-group-info?id='+id)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {console.log(err);});

    if(!group){
        console.log('groupInfo = '+group);
        return;
    }
    let users = group.users.split(',');

    let groupProfile = 
        `<h5 class="font-size-15 mb-1 text-truncate">${group.name}<p id="groupId" hidden>${group.id}</p></h5>
        <p class="text-truncate mb-0 members">${users.length+1} members</p>`;

    $('#to_user').html('');
    $('#to_user').html(groupProfile);
    document.getElementById('modal_close_group').click();
    document.getElementById('params').removeAttribute('hidden');
    document.getElementById('search').removeAttribute('hidden');

    let menuTemp =
    ` <a class="dropdown-item" href="#groupProfile" data-bs-toggle="modal"><i class="bi bi-info-circle align-middle fa-lg me-2"></i>View Group Info</a>
      <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="leaveChat()"><i class="bi bi-box-arrow-right align-middle fa-lg me-2"></i>Leave Group</a>`

    $('#dropdownMenu').html('');

    $('#dropdownMenu').append(menuTemp);

    ////

    const cardBody =
        `<h6 class="card-text ">${group.name}</h6>
         <p class="card-text members">${users.length+1} members</p>`;

    $('#cardBodyGroup').html('');
    $('#cardBodyGroup').append(cardBody);

    $('#groupPhoto').html('');
    $('#groupPhoto').append(`<img class="card-img img-fluid rounded-circle img-thumbnail mt-3" style="width:130px; height:130px;" src="public/assets/groupImages/${group.photo}" alt="Card image">`);


    membersTemp='';

    const response = await fetch('/get-group-members?members='+group.users+'&owner='+group.owner)
    .then(response => response.json())
    .catch(er => {console.log(er);});

    var members = response.members;
    var owner = response.owner;
    var current_user = response.current_user;

    // console.log('members = '+members[0]);
    // console.log(typeof owner);

    if(members.length ===0 ){
        console.log('members = '+members);
        return;
    }

    if(owner){
        membersTemp +=
        `<a href="#groupMemberProfile" data-bs-toggle="modal" class="list-group-item list-group-item-action fw-bolder" data-bs-dismiss="modal" onclick="show_member_profile(${owner.user_id})">
            <div class="d-flex">
                <div class="user-img away  align-self-center me-4 ">
                    <img src="public/assets/uploadImages/${owner.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                </div>
                <div class="flex-1 overflow-hidden align-self-center">
                    <h5 class="text-truncate font-size-14 mb-1">${owner.account_name}</h5>
                </div>
                <div class="font-size-13 text-primary">Owner</div>
            </div>
          </a>`;    
          if(owner.user_id === current_user){
                let menuTemp =
                `<a class="dropdown-item" href="#groupProfile" data-bs-toggle="modal"><i class="bi bi-info-circle align-middle fa-lg me-2"></i>View Group Info</a>
                <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="delete_group()"><i class="bi bi-box-arrow-right align-middle fa-lg me-2"></i>Delete And Leave Group</a>`
            
                $('#dropdownMenu').html('');
            
                $('#dropdownMenu').append(menuTemp);
          }
    }

    members.forEach((user)=>{
        // console.log('user = '+user);
        add_members(user);
    });

    $('#groupMembers').html('');
    $('#groupMembers').append(membersTemp);

    ////set send button

    let enterMessage = 
            `<div class="col">
                <div class="position-relative">
                    <input id="messageGroup" name="message" type="text" class="form-control chat-input" placeholder="Enter Message...">        
                </div>
            </div>
            <div class="col-auto">
                <button type="button" id="messageGroup" class="btn btn-primary chat-send w-md waves-effect waves-light" onclick="send_group_messages()"><span class="d-none d-sm-inline-block me-2">Send</span> <i class="mdi mdi-send"></i></button>
            </div>`;

    $('#enterMessage').html('');
    $('#enterMessage').append(enterMessage);

    /////press enter
    
    document.getElementById('messageGroup').addEventListener('keypress', async(event)=>{
        if(event.key === 'Enter'){
            event.preventDefault();
            await send_group_messages();
        }
    })

    $('#messageList').html('');

    // cursor
    // $('#messageGroup').focus();

    titleArray = [];

    let grId = group.id;
    countMessage = 0;
    clearInterval(myInterval);
    myInterval = setInterval(async()=>{
        await get_group_messages(grId);
    }, 1000);

}

const add_members = (user)=>{

    var temp = 
    ` <a href="#groupMemberProfile" data-bs-toggle="modal" class="list-group-item list-group-item-action fw-bolder" data-bs-dismiss="modal" onclick="show_member_profile(${user.user_id})">
            <div class="d-flex">
                <div class="user-img away  align-self-center me-4 ">
                    <img src="public/assets/uploadImages/${user.profile_photo}" class="rounded-circle avatar-xs" alt="avatar-3" style="height:50px;width:50px;">
                </div>
                <div class="flex-1 overflow-hidden align-self-center">
                    <h5 class="text-truncate font-size-14 mb-1">${user.account_name}</h5>
                </div>
            </div>
       </a>`;

    membersTemp+=temp;
}

const show_member_profile = async(userId)=>{

    let user = await fetch('/show-member-profile?userId=' + userId)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => console.log(err));

    if(!user){
        $('#otaDiv').html('');
        console.log('result : '+false);
        return;
    }

    let userProfile =
        `<div class="col-md-4">
            <img class="card-img rounded-circle img-thumbnail" style="background-position: center; height: 130px; width: 130px; object-fit: cover;"
            src="public/assets/uploadImages/${user.profile_photo}" alt="Card image" id="userProf">
        </div>
        <div class="col-md-8 mb-1">
            <div class="card-body">
                <h5 class="card-title fw-bolder">Name:</h5>
                <h6 class="card-text " id="accountName">${user.account_name}</h6>
                <h5 class="card-title fw-bolder">Username:</h5>
                <p class="card-text ">@${user.username}</p>
            </div>
        </div>
        <hr>
        <div>
            <a href="javascript:void(0);" data-bs-dismiss="modal" style="font-weight:bolder; margin-left:36%" onclick="start_chat(${user.user_id})">
               SEND MESSAGE
            </a>
        </div>`;

    $('#otaDiv').html('');
    $('#otaDiv').html(userProfile);
   
}
var countMessage = 0;
const get_group_messages = async(groupId)=>{
    
    let messages = await fetch('/get-group-messages?id='+groupId+'&count='+countMessage)
    .then(response => response.json())
    .catch(err =>{ console.log(err);});

    if(!messages.result){
        // console.log('messages = '+messages);
        return;
    }
    countMessage = messages.result[messages.result.length-1].id;

    messages.result.forEach((message)=>{
        add_group_messages(message, messages.user_id);
    });

}

const add_group_messages = (message, current_user_id)=>{

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

    if (months === currentdate.getMonth() && days === currentdate.getDate()) {

        dayTitle += 'Today';
        // console.log(dayTitle);

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                       <div class="chat-day-title">
                            <span class="title">${dayTitle}</span>
                       </div>
                     </li>`;
            titleArray.push(dayTitle);
        }

    }
    else if (months === currentdate.getMonth() && days < currentdate.getDate()) {

        dayTitle += days + ' ';

        switch (months) {
            case 0: dayTitle += 'January'; break;
            case 1: dayTitle += 'February'; break;
            case 2: dayTitle += 'March'; break;
            case 3: dayTitle += 'April'; break;
            case 4: dayTitle += 'May'; break;
            case 5: dayTitle += 'June'; break;
            case 6: dayTitle += 'July'; break;
            case 7: dayTitle += 'August'; break;
            case 8: dayTitle += 'September'; break;
            case 9: dayTitle += 'Oktober'; break;
            case 10: dayTitle += 'November'; break;
            case 11: dayTitle += 'December'; break;
        }

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }
    }
    else if (months <= currentdate.getMonth()) {
        dayTitle += days + ' ';

        switch (months) {
            case 0: dayTitle += 'January'; break;
            case 1: dayTitle += 'February'; break;
            case 2: dayTitle += 'March'; break;
            case 3: dayTitle += 'April'; break;
            case 4: dayTitle += 'May'; break;
            case 5: dayTitle += 'June'; break;
            case 6: dayTitle += 'July'; break;
            case 7: dayTitle += 'August'; break;
            case 8: dayTitle += 'September'; break;
            case 9: dayTitle += 'Oktober'; break;
            case 10: dayTitle += 'November'; break;
            case 11: dayTitle += 'December'; break;
        }

        if (!titleArray.includes(dayTitle)) {

            temp += `<li> 
                         <div class="chat-day-title">
                           <span class="title">${dayTitle}</span>
                         </div>
                    </li>`;
            titleArray.push(dayTitle);

        }

    }

    // console.log('message.user = '+ message.user);
    // console.log(current_user_id);

    if (message.user_id === current_user_id) {
        temp += ` <li class="right" id="grmess${message.id}">
                        <div class="conversation-list">
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content">
                                    <p class="mb-0" id="grmessage${message.id}">${message.message}</p>
                                    <div class="btn-group dropstart" style="position:absolute; rigtht:0; bottom:26px; margin-left:15px;">
                                            <a class="dropdown-toggle" data-bs-toggle="dropdown" data-toggle="dropdown">
                                            <i class="ri-more-2-fill ri-lg"></i>
                                            </a>
                                        <div class="dropdown-menu" style="position:absolute; min-width:0.3rem;">
                                            <a class="dropdown-item" style="padding:0.3rem 1.2rem;" href="#editGrMessage" data-bs-toggle="modal"
                                            onclick="edit_group_message(${message.id})"><i class="ri-pencil-fill"></i></a>
                                            <a class="dropdown-item" style="padding:0.3rem 1.2rem;" href="#"><i class="ri-delete-bin-7-fill"
                                            onclick="delete_group_message(${message.id})"></i></a>
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
                            <img src="public/assets/uploadImages/${message.profile_photo}" alt="avatar-2">
                        </div>
                        <div class="ctext-wrap">
                            <div class="conversation-name">${message.account_name}</div>
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

const send_group_messages = async()=>{

    let groupId = parseInt(document.getElementById('groupId').innerHTML);
    // console.log(groupId);
    let message = document.getElementById('messageGroup').value;
    document.getElementById('messageGroup').value = '';
    
    if(!message){
        return;
    }

    let response = await fetch('/post-group-messages', {
        method:'POST',
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({message:message, groupId:groupId})
    })
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => console.log(err));

    if(!response){
        console.log('Unsuccessful post');
        return;
    }
}
