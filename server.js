"use strict"
/* Serveur pour le site OnlineMessaging */
let express = require('express');
let mustache = require('mustache-express');
let model = require('./model');
let variable;

let fetch;
(async () => {
  fetch = await import('node-fetch').then(module => module.default);
})();

const app = express();

const cookieSession = require('cookie-session');
app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie',
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
app.use(express.static('style'));
app.use(express.static('script'));
//app.use(express.static('models'));


/**** Routes pour voir les pages du site ****/

/* Retourne la page principale OnlineMessaging */
app.get('/', (req, res) => {
  res.render('index');
});

/* Retourne la page principale OnlineMessaging si un user est connecté */
app.get('/', (req, res) => {
    var user = model.readUser(req.session.userID);
    res.render('index', user);
});

app.listen(3001, () => console.log('listening on http://localhost:3001'));