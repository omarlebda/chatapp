document.addEventListener('DOMContentLoaded', () => {
				

				var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
				var username = localStorage.getItem("username");
				if(!username){
				    username = prompt("Please enter username");
				    localStorage.setItem("username", username);
				}
				if(username){
					document.querySelector('#name-of-client').innerHTML = username;
				}
				let active_room = localStorage.getItem("active_room");
				if(!active_room){
				    localStorage.setItem("active_room", "General");
				}
				if(active_room){
					joinRoom(active_room);
				}
				
				
				document.querySelector('#clear').onclick = () =>{
					document.querySelector('#display-msg').innerHTML="";
					socket.emit('delete', {'room': active_room});
				};
				
				
				
				// send message to the server
				document.querySelector('#send-btn').onclick = () =>{
					socket.send({'msg': document.querySelector('#input-msg').value, 'username': username, 'room': active_room});
					document.querySelector('#input-msg').value = '';
				};

				document.querySelector('#create-btn').onclick = () =>{
					socket.emit('create',{'msg': document.querySelector('#create-room').value, 'username': username, 'room': active_room});
					document.querySelector('#create-room').value = '';
				};
				
			    socket.on('message', data => {
			    	
			    	const p = document.createElement('p');
			    	const span_username = document.createElement('span');
			    	const span_timestamp = document.createElement('span');
			    	const br = document.createElement('br');

			    	if (data.username){
			    		span_username.innerHTML = data.username;
				    	span_timestamp.innerHTML = data.time_stamp;
				    	p.innerHTML = span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML + br.outerHTML;
				    	document.querySelector('#display-msg').append(p);
			    	} else{
			    		printSysMsg(data.msg)
			    	}
			    	
			    	
			    });

			    
			    // room selection
			    document.querySelectorAll('.select-room').forEach(p => {
			    	p.onclick = () => {
			    		let newRoom = p.innerHTML;
			    		if(newRoom === active_room){
			    			msg = `You are alread in the ${active_room} room.`;
			    			printSysMsg(msg);
			    		}else{
			    			leaveRoom(active_room);
			    			joinRoom(newRoom);
			    			active_room = newRoom;
			    			localStorage.setItem("active_room", active_room);
			    		}

			    	};
			    });


			    // room creation
			    socket.on('create', data => {
			    	
			    	const pf = document.createElement('p');
			    	pf.innerHTML = data.msg;
			    	pf.className = "select-room";
			    	if(data.msg === "sorry room with the same name already exist")
			    	{
			    		alert(data.msg);
			    	}
			    	else{
			    		document.querySelector('#room-nav').append(pf);
			    		pf.onclick = () => {
			    			let newRoom = pf.innerHTML;
				    		if(newRoom === active_room){
				    			msg = `You are alread in the ${active_room} room.`;
				    			printSysMsg(msg);
				    		}else{
				    			leaveRoom(active_room);
				    			joinRoom(newRoom);
				    			active_room = newRoom;
				    		}
			    		}
			    	}
			    	 	
			    });

			    socket.on('updat_join', data => {
			    	if(data.username === username){
				    	for(let i = 0, size = data.messages.length; i < size; i++)
				    	{
				    		const p = document.createElement('p');
				    		const span_username = document.createElement('span');
					    	const span_timestamp = document.createElement('span');
					    	const br = document.createElement('br');
					    	span_username.innerHTML = data.messages[i][0];
					    	span_timestamp.innerHTML = data.messages[i][2];
					    	p.innerHTML = span_username.outerHTML + br.outerHTML + data.messages[i][1] + br.outerHTML + span_timestamp.outerHTML + br.outerHTML;
				    		document.querySelector('#display-msg').append(p);
				    	}
			        }
			    });

			    // Leave Rooms
			    function leaveRoom(room){
			    	socket.emit('leave', {'username':username, 'room': room});
			    }


			    // Join Room
			    function joinRoom(room){

			    	socket.emit('join', {'username':username, 'room': room});

			    	// Clear Messages
			    	document.querySelector('#display-msg').innerHTML= "";

			    }


			    function printSysMsg(msg){
			    	const p = document.createElement('p');
			    	p.innerHTML = msg;
			    	document.querySelector('#display-msg').append(p);
			    }

			});