import 'package:flutter/cupertino.dart';

import '../storage.dart';

class Message {
  String from;
  String to;
  String message;

  Message(this.from, this.to, this.message);
}

class Messages with ChangeNotifier {
  List<dynamic> messages = [];
  List<dynamic> chatUsers = [];
  Map<String, int> unread = {};

  void addChatUser(user) {
    chatUsers.add(user);
    notifyListeners();
  }

  void addMessage(msg) {
    print('adding msg');
    var username = storage.username;
    if (!chatUsers.contains(msg.from) && msg.from != username) {
      // Incoming message
      this.addChatUser(msg.from);
      storage.sendNotification(msg.from, msg.message, msg.from);
    } else if (msg.from == username && !chatUsers.contains(msg.to)) {
      // Outgoing message
      this.addChatUser(msg.to);
    }

    // Update unread for incoming
    if (msg.from != username) {
      if(unread.containsKey(msg.from)){
        unread[msg.from] += 1;
      } else {
        unread[msg.from] = 1;
      }
    }

    messages.add(msg);
    notifyListeners();
  }

  List<dynamic> getMessagesOf(user) {
    if(unread.containsKey(user))
      unread[user] = 0;
    return messages.where((msg) => msg.from == user || msg.to == user).toList();
  }

  List<dynamic> getChatUsers() {
    return chatUsers;
  }

}