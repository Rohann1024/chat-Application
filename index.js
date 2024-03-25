const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const http=require('http');
const PORT=process.env.PORT||3000;
const app=express();
const socketio=require('socket.io');
const server=http.createServer(app);
const formatMessage=require('./utils/messages');
const {userJoin,getUser,userDisconnect,fetchUsers}=require('./utils/users');
const io=socketio(server);
server.listen(PORT,()=>console.log("Port Started at location",PORT));
app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/chat-join',(req,res)=>{
	const {username,roomCode}=req.body;
	console.log(username,roomCode);
	res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});
const bot='Talk Time Bot';
	io.on('connection',socket=>{
		socket.on('joinRoom',async({username,roomName})=>{
			const user=await userJoin(socket.id,username,roomName);
			socket.join(user.roomName);

			console.log("new web socket connection..");
			console.log(user.roomName,user.username);
		socket.emit('message',formatMessage(bot,'Welcome to Talk Time'));
			io.to(user.roomName).emit('roomUsers',{
			room:user.roomName,
			users:await fetchUsers(user.roomName)
		})
		//Brodcast to everybody excepts the user who loged in
		socket.broadcast.to(user.roomName).emit('message',formatMessage(bot,`${user.username} has Joined the chat`));
	});
		
		//Brodcast to everyone include user
		socket.on('disconnect',async()=>{
			const user=await userDisconnect(socket.id);
			if(user){
			io.to(user.roomName).emit('message',formatMessage(bot,`${user.username} has left the chat`));
			console.log(user);
			io.to(user.roomName).emit('roomUsers',{
			room:user.roomName,
			users:await fetchUsers(user.roomName)
		});
			}

		});
		//Listen For the message
		socket.on('chatMessage',async(msg)=>{
			const user=await getUser(socket.id);
			console.log(msg);
			io.to(user.roomName).emit('message',formatMessage(`${user.username}`,msg));
		});


	});
// Serve static files from the 'public' directory