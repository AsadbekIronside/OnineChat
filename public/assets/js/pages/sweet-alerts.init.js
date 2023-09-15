/*
Template Name: Nazox -  Admin & Dashboard Template
Author: Themesdesign
Contact: themesdesign.in@gmail.com
File: Sweetalert Js File
*/

// import { clearChat } from '../chat';

!function ($) {
    "use strict";

    var SweetAlert = function () {
    };

    //examples
    SweetAlert.prototype.init = function () {

        //Success Message
        $('#sa-success').click(function () {
            Swal.fire(
                {
                    title: 'Good job!',
                    text: 'You clicked the button!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#5664d2',
                    cancelButtonColor: "#ff3d60"
                }
            )
        });

        //Warning Message

        $('#deleteAccount').click(function () {
            Swal.fire({
                title: "Do you want to delete your account?",
                showCancelButton: true,
                confirmButtonColor: "#1cbb8c",
                cancelButtonColor: "#ff3d60",
                confirmButtonText: "Yes",
              }).then(function (result) {
                if (result.value) {
                    
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1cbb8c",
                        cancelButtonColor: "#ff3d60",
                        confirmButtonText: "Yes, delete it!"
                      }).then(async function (result) {
                        if (result.value) {

                            await fetch('/delete-user');

                        }
                    });

                }
            });
        });
  

        //Parameter
        $('#sa-params').click(function () {
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
                        var child = document.getElementById(val);
                        document.getElementById('chatsGroup').removeChild(child);
                        document.getElementById('search').setAttribute('hidden', true);
                        document.getElementById('params').setAttribute('hidden', true);
                        $('#to_user').html('');
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
        });

        //Custom Image
        $('#sa-image').click(function () {
            Swal.fire({
                title: 'Sweet!',
                text: 'Modal with a custom image.',
                imageUrl: 'assets/images/logo-dark.png',
                imageHeight: 20,
                confirmButtonColor: "#5664d2",
                animation: false
            })
        });
		
        //Auto Close Timer
        $('#sa-close').click(function () {
            var timerInterval;
            Swal.fire({
            title: 'Auto close alert!',
            html: 'I will close in <strong></strong> seconds.',
            timer: 2000,
            confirmButtonColor: "#5664d2",
            onBeforeOpen:function () {
                Swal.showLoading()
                timerInterval = setInterval(function() {
                Swal.getContent().querySelector('strong')
                    .textContent = Swal.getTimerLeft()
                }, 100)
            },
            onClose: function () {
                clearInterval(timerInterval)
            }
            }).then(function (result) {
            if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.timer
            ) {
                console.log('I was closed by the timer')
            }
            })
        });



        //custom html alert
        $('#custom-html-alert').click(function () {
            Swal.fire({
                title: '<i>HTML</i> <u>example</u>',
                icon: 'info',
                html: 'You can use <b>bold text</b>, ' +
                '<a href="//themesdesign.in/">links</a> ' +
                'and other HTML tags',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger ml-1',
                confirmButtonColor: "#47bd9a",
                cancelButtonColor: "#ff3d60",
                confirmButtonText: '<i class="fas fa-thumbs-up me-1"></i> Great!',
                cancelButtonText: '<i class="fas fa-thumbs-down"></i>'
            })
        });

        //position
        $('#sa-position').click(function () {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            })
        });

        //Custom width padding
        $('#custom-padding-width-alert').click(function () {
            Swal.fire({
                title: 'Custom width, padding, background.',
                width: 600,
                padding: 100,
                confirmButtonColor: "#5664d2",
                background: '#fff url(//subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/geometry.png)'
            })
        });

        //chaining modal alert
        $('#chaining-alert').click(function () {
            Swal.mixin({
                input: 'text',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                confirmButtonColor: "#5664d2",
                cancelButtonColor: "#74788d",
                progressSteps: ['1', '2', '3']
              }).queue([
                {
                  title: 'Question 1',
                  text: 'Chaining swal2 modals is easy'
                },
                'Question 2',
                'Question 3'
              ]).then( function (result) {
                if (result.value) {
                  Swal.fire({
                    title: 'All done!',
                    html:
                      'Your answers: <pre><code>' +
                        JSON.stringify(result.value) +
                      '</code></pre>',
                    confirmButtonText: 'Lovely!'
                  })
                }
              })
        });

        //Danger
        $('#dynamic-alert').click(function () {
            swal.queue([{
                title: 'Your public IP',
                confirmButtonColor: "#5664d2",
                confirmButtonText: 'Show my public IP',
                text: 'Your public IP will be received ' +
                'via AJAX request',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        $.get('https://api.ipify.org?format=json')
                            .done(function (data) {
                                swal.insertQueueStep(data.ip)
                                resolve()
                            })
                    })
                }
            }]).catch(swal.noop)
        });


    },
        //init
        $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
}(window.jQuery),

//initializing
    function ($) {
        "use strict";
        $.SweetAlert.init()
    }(window.jQuery);
