///long polling
var chatTimer = '';

function getChat() {

    var url = '/Home/Chat';
    $('#chatWindowContent').load(url, function () { $('#chatWindow').scrollTop($('#chatWindowContent').outerHeight()) });
    chatTimer = setTimeout(function () { getChat() }, 1000);

}

sendMessage = function (theForm) {


    clearTimeout(chatTimer);
    var url = '/Home/Chat';
    $.post(url, $(theForm).serialize(), function (data) {
        $('#chatField').val('');
        $('#chatWindowContent').load(url, function () {

            $('#chatWindow').scrollTop($('#chatWindowContent').outerHeight())
            var chatTimer = setTimeout(function () { getChat() }, 1000);
           

        });

    });

}

if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
    setTimeout(function () { window.scrollTo(0, 1); }, 10)
}
