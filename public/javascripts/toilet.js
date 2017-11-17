$(function () {
    var socket = io();
    socket.on(`toilet`, (status) => {
        console.log('receive toilet status ' + status);
        if(status == 1) {
            $('#toilet_status').attr('src', 'images/empty.png');
        } else {
            $('#toilet_status').attr('src', 'images/using.png');
        }
    });
});