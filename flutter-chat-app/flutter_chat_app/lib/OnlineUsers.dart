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
        (data) => {
              msgs.addMessage(
                  new Message(data['from'], data['to'], data['text'])),
            });
  }

  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    height = MediaQuery.of(context).size.height;
    width = MediaQuery.of(context).size.width;

    final List<Widget> _children = [
      Consumer<Messages>(builder: (context, myModel, child) {
        return UserList(
            userList: myModel.getChatUsers(),
            username: username,
            unread: myModel.unread);
      }),
      UserList(userList: userList, username: username, unread: {}),
    ];

    void onTabTapped(int index) {
      setState(() {
        _currentIndex = index;
      });
    }

    return Scaffold(
      body: DefaultTabController(
        length: 2,
        child: Scaffold(
          appBar: AppBar(
            title: Text('Chat App'),
          ),
          bottomNavigationBar: BottomNavigationBar(
            onTap: onTabTapped, // new
            currentIndex: _currentIndex, // new
            items: [
              BottomNavigationBarItem(
                icon: new Icon(Icons.message),
                title: new Text('Chat'),
              ),
              BottomNavigationBarItem(
                icon: new Icon(Icons.people),
                title: new Text('Users'),
              ),
            ],
          ),
          body: _children[_currentIndex],
        ),
      ),
    );
  }
}

class UserList extends StatelessWidget {
  const UserList({
    Key key,
    @required this.userList,
    @required this.username,
    this.unread,
  }) : super(key: key);

  final List userList;
  final String username;
  final Map<String, int> unread;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: userList
              .where((x) => x != username)
              .map((user) => ListTile(
                    leading: Icon(Icons.person),
                    title: Text(user),
                    trailing: unread.containsKey(user) && unread[user] > 0
                        ? Text(unread[user].toString(),
                    style: TextStyle(color: Colors.red), textScaleFactor: 1.2,)
                        : Text(''),
                    onTap: () {
                      Navigator.of(context)
                          .pushNamed('/chat', arguments: {'chatTo': user});
                    },
                  ))
              .toList() ??
          [],
    );
  }
}
