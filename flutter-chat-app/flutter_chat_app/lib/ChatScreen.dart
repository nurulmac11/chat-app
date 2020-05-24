import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:provider/provider.dart';

import 'models/Messages.dart';
import 'storage.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  IO.Socket socket;
  String chatTo;
  String username;
  final msgController = TextEditingController();
  ScrollController _scrollController = new ScrollController();


  void autoScroll() {
    if(_scrollController.hasClients)
      Timer(
          Duration(milliseconds: 100),
              () =>
              _scrollController.animateTo(
                  _scrollController.position.maxScrollExtent,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut));
  }

  @override
  void initState() {
    // Get username from sp
    username = storage.username;

    // Get socket from storage
    socket = storage.socket;
    super.initState();
  }


  void sendMessage(msg) {
    var payload = {
      "username": username,
      "text": msg,
      "to": chatTo,
      "from": username,
    };
    final msgs = Provider.of<Messages>(context, listen: false);
    msgs.addMessage(
        new Message(username, chatTo, msg));
    this.socket.emit('msgToServer', payload);
    msgController.clear();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Get who are we sending to messages ?
    final Map arguments = ModalRoute
        .of(context)
        .settings
        .arguments as Map;
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
                child: Consumer<Messages>(
                    builder: (context, myModel, child) {
                      autoScroll();
                      return ChatMessages(scrollController: _scrollController,
                          messages: myModel.getMessagesOf(chatTo),
                          username: username);
                    })
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

class ChatMessages extends StatelessWidget {
  const ChatMessages({
    Key key,
    @required ScrollController scrollController,
    @required this.messages,
    @required this.username,
  })
      : _scrollController = scrollController,
        super(key: key);

  final ScrollController _scrollController;
  final List messages;
  final String username;

  @override
  Widget build(BuildContext context) {
    return ListView(
      controller: _scrollController,
      scrollDirection: Axis.vertical,
      shrinkWrap: true,
      children: messages
          .map((msg) =>
          ListTile(
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
    );
  }
}
