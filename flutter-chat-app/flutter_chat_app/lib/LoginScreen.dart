import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:http/http.dart' as http;
import 'package:crypto/crypto.dart' as crypto;
import 'package:hex/hex.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'OnlineUsers.dart';
import 'storage.dart';

const base_url =  "http://10.0.2.2:3000";

generateMd5(String data) {
  var content = new Utf8Encoder().convert(data);
  var md5 = crypto.md5;
  var digest = md5.convert(content);
  return HEX.encode(digest.bytes);
}

class LoginScreen extends StatelessWidget {
  Duration get loginTime => Duration(milliseconds: 2250);

  Future<String> _authUser(LoginData data) {
    var url = '$base_url/users/login';
    var response;

    return Future.delayed(loginTime).then((_) async {
      try {
        response = await http.post(
            url,
            body: {
              'username': data.name,
              'password': generateMd5(data.password),
            });
      } catch (Exception) {
          return "Server has gone!";
      }

      final Map resp = json.decode(response.body);
      try {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString(
            'accessToken', resp['tokens']['accessToken']);
        await prefs.setString('username', data.name);
        storage.username = data.name;
        return null;
      } catch (Exception){
        print(resp['message']);
        return resp['message'];
//        return response.body['message'].toString();
      }
    });
  }

  Future<String> _recoverPassword(String name) {
    print('Name: $name');
    return Future.delayed(loginTime).then((_) {
      return null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return FlutterLogin(
      title: '',
      logo: 'assets/evilcorp.png',
      onLogin: _authUser,
      onSignup: _authUser,
      onRecoverPassword: _recoverPassword,
      onSubmitAnimationCompleted: () {
        Navigator.of(context).pushReplacement(MaterialPageRoute(
          builder: (context) => OnlineUsers(),
        ));
      },
      emailValidator: (val) => null,
      passwordValidator: (val) => null,
      messages: LoginMessages(
        usernameHint: 'Username',
      ),

    );
  }
}
