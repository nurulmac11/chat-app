import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import 'storage.dart';

class Message {
  String from;
  String to;
  String message;

  Message(this.from, this.to, this.message);
}

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  IO.Socket socket;
  String username = '';
  List<dynamic> messages = [];
  String chatTo = '';
  final msgController = TextEditingController();
  ScrollController _scrollController = new ScrollController();

  void _setState(fn) {
    if (mounted) {
      setState(fn);
    }
  }

  void autoScroll() {
    Timer(
        Duration(milliseconds: 100),
        () => _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut));
  }

  @override
  void initState() {
    // Get username from sp
    SharedPreferences.getInstance().then((SharedPreferences sp) {
      username = sp.getString("username");
    });

    // Get socket from storage
    socket = storage.socket;
    receiveMessage();
    super.initState();
  }

  void receiveMessage() async {
    // Start to listen chat messages
    // TODO
    // Move to initialization and save messages to storage ?
    socket.on(
        'chat',
        (data) => {
              _setState(() {
                messages
                    .add(new Message(data['from'], data['to'], data['text']));
              }),
              autoScroll(),
            });
  }

  void sendMessage(msg) {
    var payload = {
      "username": username,
      "text": msg,
      "to": chatTo,
      "from": username,
    };
    _setState(() {
      messages.add(new Message(username, chatTo, msg));
    });
    this.socket.emit('msgToServer', payload);
    autoScroll();
    msgController.clear();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Get who are we sending to messages ?
    final Map arguments = ModalRoute.of(context).settings.arguments as Map;
    if (arguments != null) chatTo = arguments['chatTo'];
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    msgController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chat App'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: Scrollbar(
              child: ListView(
                controller: _scrollController,
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                children: messages
                        .map((msg) => ListTile(
                              subtitle: Text(
                                "From: ${msg.from}",
                                textDirection: msg.from == username
                                    ? TextDirection.rtl
                                    : TextDirection.ltr,
                              ),
                              leading: Icon(Icons.message),
                              title: Text(
                                msg.message,
                                textDirection: msg.from == username
                                    ? TextDirection.rtl
                                    : TextDirection.ltr,
                              ),
                            ))
                        .toList() ??
                    [],
              ),
            ),
          ),
          Container(
            height: 100,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: msgController,
                      maxLines: 3,
                      decoration: InputDecoration(hintText: 'Write a message.'),
                    ),
                  ),
                  RaisedButton(
                    onPressed: () => sendMessage(msgController.text),
                    child: Text("Send"),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
