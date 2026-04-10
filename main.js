const chatform = document.getElementById('chat-form');
const chatmessage = document.querySelector('.chat-messages');




//get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
});


const socket = io();

//join chat room
socket.emit('joinroom', {username, room });


//message from server
socket.on('message', message => {
    console.log(message);
    outputmessage(message);

//scroll down
    chatmessage.scrollTop = chatmessage.scrollHeight;
});


//message submit
chatform.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    // emit message to the server
    socket.emit('chatmessage', msg );


    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();


})

//out put message frpm DOM
function outputmessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
						${message.text}
						</p>`;
                        document.querySelector('.chat-messages').appendChild(div);
}



