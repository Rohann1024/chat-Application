async function joinChatRoom(event){
	event.preventDefault();
	const userName=document.querySelector("#username").value;
	const roomCode=document.querySelector("#roomCode").value;
	console.log(userName);
	console.log(roomCode);
	if(userName && roomCode){
		try{
			const response = await fetch('http://localhost:5000/api/users', {
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    body: JSON.stringify({
			        user: userName,
			        roomCode: roomCode,
			    }),
			});
			 if (response.ok) {
                const data = await response.json();
                console.log('ok find..');
                console.log(data.roomName);
                window.location.href = `chat.html?username=${encodeURIComponent(userName)}&roomName=${encodeURIComponent(data.roomName)}&roomCode=${encodeURIComponent(roomCode)}`;
                // Redirect to chat page or perform any other actions as needed
            } else {
                // Log error message if response status is not okay
                console.error('Error creating chat room:', response.statusText);
            }
		}catch(error){
			console.log('Error while creating new Chat Room',error);
		}
	}
	else{
		alert("Please provide all the Fields");
	}

}
async function createChatRoom(event){
	event.preventDefault();
	const ownName=document.querySelector("#ownName").value;
	const roomName=document.querySelector('#roomName').value;
	const roomCode=document.querySelector("#rCode").value;
	console.log(ownName);
	console.log(roomCode);
	console.log(roomName);
	if(ownName && roomName && roomCode){
		try{
			const response = await fetch('http://localhost:5000/api/create', {
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    body: JSON.stringify({
			        admin: ownName,
			        roomName: roomName,
			        roomCode: roomCode,
			    }),
			});
			 if (response.ok) {
                const data = await response.json();
                console.log(data);
                window.location.href = `chat.html?username=${encodeURIComponent(ownName)}&roomName=${encodeURIComponent(roomName)}&roomCode=${encodeURIComponent(roomCode)}`;
                // Redirect to chat page or perform any other actions as needed
            } else {
                // Log error message if response status is not okay
                console.error('Error creating chat room:', response.statusText);
            }
		}catch(error){
			console.log('Error while creating new Chat Room',error);
		}
	}
	else{
		alert('Please enter all Fields While creating new Room');
	}
}