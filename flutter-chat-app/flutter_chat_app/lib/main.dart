import 'package:flutter/material.dart';
import './OnlineUsers.dart';
import './LoginScreen.dart';
import 'ChatScreen.dart';

void main() => runApp(MyMaterial());

class MyMaterial extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/users': (context) => OnlineUsers(),
        '/chat': (context) => ChatScreen()
      },
    );
  }
}