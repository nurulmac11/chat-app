import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_socket_io/flutter_socket_io.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:provider/provider.dart';

import 'models/Messages.dart';
import 'storage.dart';

class OnlineUsers extends StatefulWidget {
  @override
  _OnlineUsersState createState() => _OnlineUsersState();
}

class _OnlineUsersState extends State<OnlineUsers> {
  double height, width;
  String accessToken;
  String username;
  IO.Socket socket;
  List<dynamic> userList = [];

  @override
  void initState() {
    // Start operations inside shared preferences
    // to store username, accesstoken etc.

    SharedPreferences.getInstance().then((SharedPreferences sp) {
      accessToken = sp.getString("accessToken");
      username = sp.getString("username");

      //Creating the socket
      // Passing access token which received from login screen
      socket = IO.io('http://10.0.2.2:81', <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
        'query': "token=$accessToken"
      });

      // Connect to the socket
      socket.connect();

      // Notify server with username
      socket.emit('loginMe', username);

      // Get active users continuously and update user list
      socket.on(
          'activeUsers',
          (data) => {
                setState(() {
                  userList = data;
                }),
              });

      // Save socket to storage use it afterwards.
      storage.socket = socket;
      receiveMessage(socket);
    });
    super.initState();
  }

  void receiveMessage(socket) async {
    // Start to listen chat messages
    // TODO
    // Move to initialization and save messages to storage ?
    final msgs = Provider.of<Messages>(context, listen: false);
    socket.on(
        'chat',
            (data) =>
        {
          print('msg received? '),
          msgs.addMessage(
              new Message(data['from'], data['to'], data['text'])),
        });
  }

  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  @override
  Widget build(BuildContext context) {
    height = MediaQuery.of(context).size.height;
    width = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(title: Text('Chat App')),
      body: ListView(
        children: userList
                .where((x) => x != username)
                .map((user) => ListTile(
                      leading: Icon(Icons.person),
                      title: Text(user),
                      onTap: () {
                        Navigator.of(context)
                            .pushNamed('/chat', arguments: {'chatTo': user});
                      },
                    ))
                .toList() ??
            [],
      ),
    );
  }
}
