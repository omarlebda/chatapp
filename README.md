# Project 2

Web Programming with Python and JavaScript

chat web application using flask framework, socket-io and javascript
link of the video of the chat application:
https://www.youtube.com/watch?v=WzuutzGXWsE&t=155s

Server-side manuals:

I have one list that contains the rooms of the application, and one dictionar it's keys are the room names and values are list of messages inside this room.

I have one root which is index that returns for me the main page and the list of rooms

message function: recieves message, username and the room from the client side and send it back with the exact time and the username to client side, also it append in the dictionary of messages in the dictionars of messages

create function: gets the name of the new room from the client side and checks whether this room already exists in the list of rooms, if it do exist, it will send back a message that this meesage already exists, if not, it will appent it to the list of rooms and sent it back to the client side to be added in the list of rooms

join function: built in function in flask socket-io that let's the user join a room

leave function: built in function that let's the user leave a room

Personal touch: clear button that delets all messages in a list of the dictionary with the key of the given room




Client-side:

As soon as the client open the webiste, the user will be asked for a username just if it's not saved in the localstorgae of the browser, also if he didn't join a room before, the user will be asked to join a room then it will save the room in the local storage.


the same events, leave, join, create, update, delete are in the client side to recieve and send data to the server side
