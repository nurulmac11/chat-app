import 'package:flutter/material.dart';
import './OnlineUsers.dart';
import './LoginScreen.dart';
import 'ChatScreen.dart';
import 'package:provider/provider.dart';

import 'models/Messages.dart';

void main() => runApp(MyMaterial());

class MyMaterial extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<Messages>(
      create: (context) => Messages(),
      child: MaterialApp(
        initialRoute: '/',
        routes: {
          '/': (context) => LoginScreen(),
          '/users': (context) => OnlineUsers(),
          '/chat': (context) => ChatScreen()
        },
      ),
    );
  }
}