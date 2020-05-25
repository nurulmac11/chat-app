import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class Storage {
  static final Storage _appData = new Storage._internal();

  IO.Socket socket;
  String username;
  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;

  Future<void> sendNotification(title, body, payload) async {
    var androidPlatformChannelSpecifics = AndroidNotificationDetails(
        'your channel id', 'your channel name', 'your channel description',
        importance: Importance.Max, priority: Priority.High, ticker: 'ticker');
    var iOSPlatformChannelSpecifics = IOSNotificationDetails();
    var platformChannelSpecifics = NotificationDetails(
        androidPlatformChannelSpecifics, iOSPlatformChannelSpecifics);
    await flutterLocalNotificationsPlugin.show(
        0, title, body, platformChannelSpecifics,
        payload: payload);
  }
  final GlobalKey<NavigatorState> navigatorKey = new GlobalKey<NavigatorState>();


  factory Storage() {
    return _appData;
  }  Storage._internal();

}final storage = Storage();