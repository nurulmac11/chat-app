import 'package:flutter/cupertino.dart';

class Message {
  String from;
  String to;
  String message;

  Message(this.from, this.to, this.message);
}

class Messages with ChangeNotifier {
  List<dynamic> messages = [];

  void addMessage(msg) {
    print(msg);
    print("added");
    messages.add(msg);
    notifyListeners();
  }

  List<dynamic> getMessagesOf(user) {
    return messages.where((msg) => msg.from == user || msg.to == user).toList();
  }

}