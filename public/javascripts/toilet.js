$(function () {
    var socket = io();
    socket.on(`toilet`, (status) => {
        $('#favicon').remove();
        if(status == 0) {
            $('head').append('<link type="image/x-icon" id="favicon" rel="icon" href="favicon_empty.png">');
            $('#toilet_status').attr('src', 'images/empty.png');
        } else {
            $('head').append('<link type="image/x-icon" id="favicon" rel="icon" href="favicon_using.png">');
            $('#toilet_status').attr('src', 'images/using.png');
        }
    });
});