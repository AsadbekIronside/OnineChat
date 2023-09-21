 //Parameter
 function clearChat2() {
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
function leaveChat() {
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

function delete_group() {
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
