document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Once the user clicks send the message is emitted
        document.querySelector('#send-btn').onclick = () => {

            // Get the channelname
            var channelName = document.querySelector('p').innerHTML;

            // Get the user's message from the text box
            var message = document.querySelector('#message').value;

            // Get the current signed in user from local storage
            var displayname = localStorage.getItem("displayname");

            socket.emit('message', {'channel_name': channelName, 'message': message, 'displayname': displayname});
        };
    });

    // When a new message comes in add it to the unordered list
    socket.on('messages', data => {
        let messages = document.querySelector('#messages');
        $('#messages').empty();
        for (var i=0; i < data['messages'].length; i++) {
            let li = document.createElement('li');
            li.className = "message-container";

            console.log(data['messages']);

            li.innerHTML = `<p class="time-left">${data['messages'][i][0].displayname}</p><br><p>${data['messages'][i][0].message}</p>`;
            messages.append(li);
        }
    });
});