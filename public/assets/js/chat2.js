 //Parameter
const clearChat2 = ()=>{
    var val='';
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear chat!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ms-2 mt-2',
        buttonsStyling: false
    }).then(async function (result) {
        if (result.value) {
            val = await clearChat();

            if(val !== -1){
                $('#messageList').html('');
                // var child = document.getElementById('b'+val);
                // document.getElementById('chatsGroup').removeChild(child);
                // document.getElementById('search').setAttribute('hidden', true);
                // document.getElementById('params').setAttribute('hidden', true);
                // $('#to_user').html('');
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Chat has been cleared.',
                    icon: 'success'
                  })

            }
            else{
                Swal.fire({ 
                    title: 'Error!',
                    text: 'Some error occured!',
                    icon: 'error'
                  })
            }
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Your messaages are safe :)',
              icon: 'error'
            })
          }
    });
};

////////////
const leaveChat = ()=>{
    var val='';
    Swal.fire({
        title: 'Are you sure to leave this group?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave group!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ms-2 mt-2',
        buttonsStyling: false
    }).then(async function (result) {
        if (result.value) {
            val = await leaveGroup();
            if(val){
                $('#messageList').html('');

                document.getElementById('search').setAttribute('hidden', true);
                document.getElementById('params').setAttribute('hidden', true);
                $('#to_user').html('');
                Swal.fire({
                    title: 'Success!',
                    text: 'You have just left the group.',
                    icon: 'success'
                  })

            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Some error occured!',
                    icon: 'error'
                  })
            }
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              icon: 'error'
            })
          }
    });
};

const leaveGroup = async()=>{

    let id = document.getElementById('groupId').innerHTML;
    
    let result = await fetch('/leave-group?id='+id)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {
        console.log(err);
    });

    if(!result)
        console.log('delete failed!');

    console.log('successfully deleted!');

    return result;

}

////////// delete group

const delete_group = ()=>{
    var val='';
    Swal.fire({
        title: 'Do you want to delete and leave the group?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete group!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ms-2 mt-2',
        buttonsStyling: false
    }).then(async function (result) {
        if (result.value) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'The group and all messages with it will be deleted!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, sure!',
                    cancelButtonText: 'No, cancel!',
                    confirmButtonClass: 'btn btn-success mt-2',
                    cancelButtonClass: 'btn btn-danger ms-2 mt-2',
                    buttonsStyling: false
                }).then(async function (result) {
                    if (result.value) {
                        val = await deleteGroup();
                        if(val){
                            $('#messageList').html('');

                            document.getElementById('search').setAttribute('hidden', true);
                            document.getElementById('params').setAttribute('hidden', true);
                            $('#to_user').html('');
                            Swal.fire({
                                title: 'Success!',
                                text: 'You have just deleted the group.',
                                icon: 'success'
                            })

                        }
                        else{
                            Swal.fire({
                                title: 'Error!',
                                text: 'Some error occured!',
                                icon: 'error'
                              })
                        }
                      } else if (
                        // Read more about handling dismissals
                        result.dismiss === Swal.DismissReason.cancel
                      ) {
                        Swal.fire({
                          title: 'Cancelled',
                          icon: 'error'
                        })
                      }
                });

               
            } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              icon: 'error'
            })
        }
    });
};

const deleteGroup = async()=>{

    let groupId = document.getElementById('groupId').innerHTML;

    let result = await fetch('/delete-group?id='+groupId)
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {
        console.log(err);
    });

    if(!result){
        console.log('Unsuccessful delete!');
    }
    console.log('Deleted :)');

    return result;

}

const getUsersToAdd = async()=>{
  
    let groupId = document.getElementById('groupId').innerHTML;

    const response = await fetch('/get-users-to-add?id='+groupId)
    .then(response => response.json())
    .catch(err => {console.log(err);});
    
    if(!response.result){
      console.log('Unsuccessfull getusersToAdd');
      return;
    }

    resultAllUser = '';
    response.result.forEach((user)=>{
        addAllUsers(user);
    });

    localStorage.setItem('members', JSON.stringify({members:response.result}));

    $('#add_users_group').html('');
    $('#add_users_group').append(resultAllUser);

}

const addMember = async()=>{

    let groupId = $('#groupId').html();
    let members = JSON.parse(localStorage.getItem('members')).members;

    console.log('members = '+members);

    var result = [];

    for(let  x of members){
        if(document.getElementById('formCheck'+x.user_id).checked){
            result.push(x.user_id);
        }
    }

    console.log('result = '+result);

    let response = await fetch('/add-users', {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          newUsers:result,
          groupId:groupId
        })
    })
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => {console.log(err);});

    // console.log('Add users::'+response);

    let numberOfMem = $('.members').html();
    numberOfMem = parseInt(numberOfMem.split('\s')[0])+result.length;

    $('.members').html(numberOfMem+" members");

    const response2 = await fetch('/get-group-members-info?id='+groupId)
    .then(response => response.json())
    .catch(er => {console.log(er);});

    var members1 = response2.members;
    var owner = response2.owner;
    var current_user = response2.current_user;

    // console.log('members = '+members[0]);
    // console.log(typeof owner);

    membersTemp = '';

    if(!members1){
        console.log('members = '+members1);
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

    members1.forEach((user)=>{
        // console.log('user = '+user);
        add_members(user);
    });

    $('#groupMembers').html('');
    $('#groupMembers').append(membersTemp);

    
}

$('#searchAddUsers').keyup(async function (e) { 

    var val = $('#searchAddUsers').val();

    // console.log('val = ' + val);
    if(!val)
        await getUsersToAdd();

    let members = JSON.parse(localStorage.getItem('members')).members;
    // console.log(chats);

    for(let i=0; i < members.length; i++ ){
        if (!members[i].username.toLowerCase().includes(val.toLowerCase())) {
            // console.log(user);
            childNode = document.getElementById('form' + members[i].user_id);
            console.log('childNode = '+childNode);
            document.getElementById('add_users_group').removeChild(childNode);

            members.splice(i, 1);
            localStorage.removeItem('members');
            localStorage.setItem('members', JSON.stringify({members:members}));

        }
    }

});

const updateGroupPhoto = async()=>{

    let groupId = $('#groupId').html();
    let photo = document.getElementById('groupProfilePhoto').files[0];

    console.log('photo = '+photo);

    if(!photo)
        return photo;

    let formData = new FormData();
    formData.append('photo', photo);

    let response = await fetch('/update-group-photo?id='+groupId, {
        method:"POST",
        body:formData
    })
    .then(response => response.json())
    .then(response => response)
    .catch(err => {console.log(err);});

    if(!response.result){
        console.log('Failed!');
    }else{
        console.log('Updated!');
        $('#groupPhoto').html('');
        $('#groupPhoto').append(`<img class="card-img img-fluid rounded-circle img-thumbnail" style="width:130px; height:130px;" src="public/assets/groupImages/${response.photo}" alt="Card image">`);
    }

}