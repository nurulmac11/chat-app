class Message {
  String from;
  String to;
  String message;

  Message(this.from, this.to, this.message);
}

class Messages {
  List<dynamic> messages = [];

  void addMessage(msg) {
    messages.add(msg);
  }

}