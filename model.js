"use strict"

let Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

/* Fonction permettant de se connecter sur le site */
exports.login = function (email, password) {
  let result = db.prepare('SELECT * FROM user WHERE email = ? AND password = ?').get(email, password);
  if (result && result.userID) {
    return {
      userID : result.userID,
      name: result.name
    };
  } else {
    return {
      userID : -1
    };
  }
}

/* Fonction permettant de créer un compte utilisateur sur le site */
exports.signup = function (name, email, password) {
  let result = db.prepare('INSERT INTO user(name, email, password) VALUES (?, ?, ?)').run(name, email, password);
  return result.lastInsertRowid;
}

exports.deleteUser = function (name, email, password) {
  let deleteUser = db.prepare('DELETE FROM user WHERE userID = ?').run(userID);
  if(deleteUser.changes === 1){
    return true;
  }
  else{
    return false;
  }
}