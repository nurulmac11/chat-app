import 'package:socket_io_client/socket_io_client.dart' as IO;

class Storage {
  static final Storage _appData = new Storage._internal();

  IO.Socket socket;
  String text;

  factory Storage() {
    return _appData;
  }  Storage._internal();

}final storage = Storage();