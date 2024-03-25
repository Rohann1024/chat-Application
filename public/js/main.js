const chatMessages=document.querySelector('#chat-messages');
//GEt username from URL
const {username,roomName,roomCode}=Qs.parse(location.search,{
	ignoreQueryPrefix:true
});

const socket=io();
//join chat room
socket.emit('joinRoom',{username,roomName});


//message to server
socket.on('message',message=>{
	console.log(message);
	outputMessage(message);
	chatMessages.scrollTop=chatMessages.scrollHeight;
});

socket.on('roomUsers',({room,users})=>{
	outputRoomName(room);
	outputRoomUser(users);
})
console.log(roomName);

//message submit;
const chatForm=document.getElementById("chat-form");
chatForm.addEventListener('submit',(e)=>{
	e.preventDefault();
	const message=e.target.elements.message.value;
//	console.log(message);
	e.target.elements.message.value="";
	//Emit message to server
	socket.emit('chatMessage',message);
})
//output Message To dom
function outputMessage(msg){
	const div=document.createElement('div');
	div.classList.add('msg');
	div.innerHTML=`
	<p class="meta">${msg.userName}  <span>${msg.time}</span></p>
	<p class="text">${msg.text}</p>
	`;
	document.querySelector('#chat-messages').appendChild(div);

}
function outputRoomName(roomName){
	document.querySelector('.room-name').innerHTML=roomName;
}
function outputRoomUser(users){
	document.querySelector('.add-user').innerHTML = '';
		console.log(users);
		for(let i=0;i<users.length;i++){
		console.log(users[i].username);
		const div=document.createElement('div');
		div.classList.add(`user`);
		div.innerHTML=`<h3>${users[i].username}</h3>`;
		document.querySelector('.add-user').appendChild(div);
}
}
