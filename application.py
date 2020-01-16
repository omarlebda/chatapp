import os

from flask import Flask, session, render_template, redirect, url_for, escape, request, flash
from flask_session import Session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from time import localtime, strftime
from collections import defaultdict
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

ROOMS = ["General"]
# messages = {'General': [["username1","msg1","time1"]], 'Testing':[["username2","msg2","time2"]], "More":[["username3","msg3","time3"]]}
messages = {"General": []}

@app.route("/", methods=["GET", "POST"])
def index():
	return render_template("index.html", rooms=ROOMS)



@socketio.on('message')
def message(data):

	send({'msg': data['msg'], 'username': data['username'], 'time_stamp': strftime('%b-%d %I:%M%p', localtime()), 'room': data['room']}, broadcast=True, room=data['room'])

	

	if data['room'] in messages.keys():

		if len(messages[data['room']]) > 100:
			messages[data['room']].pop(0)

		messages[data['room']].append([data['username'],data['msg'], strftime('%b-%d %I:%M%p', localtime())])

	else:
		messages[data['room']] = [[data['username'],data['msg'], strftime('%b-%d %I:%M%p', localtime())]]

@socketio.on('create')
def on_create(data):
	if(data['msg'] in ROOMS):
		socketio.emit('create', {'msg': "sorry room with the same name already exist"}, room=data['room'])
	else:
		ROOMS.append(data['msg'])
		socketio.emit('create',{'msg': data['msg']}, room=data['room'])

@socketio.on('join')
def on_join(data):
	if data['room'] in messages.keys():
		pass
	else:
		messages[data['room']] = []
	username = data['username']
	room = data['room']
	join_room(room)
	send({'msg': username + " has joined the " + room + " room."}, room=data['room'])
	socketio.emit('updat_join' ,{'messages': messages[data['room']], 'username': data['username'], 'time_stamp': strftime('%b-%d %I:%M%p', localtime())}, room=data['room'])


@socketio.on('leave')
def on_leave(data):
	username = data['username']
	room = data['room']
	leave_room(room)
	send({'msg': username + " has left the " + room + " room."}, room=data['room'])


@socketio.on('delete')
def on_delete(data):
	messages[data['room']] = [];
if __name__ == '__main__':
	socketio.run(app, debug=True)