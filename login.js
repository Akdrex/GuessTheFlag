const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gtf'
});

const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/logintest.html'));

});


app.post('/auth', function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    console.log("yolegang");
    if (username && password) {
        connection.query('SELECT * FROM compte WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                response.redirect('/index');
            } else {
                response.send('Mauvais mot de passe');
            }
            response.end();
        });
    } else {
        response.send('Svp rentrez un nom dutilisateur et un mot de passe');
        response.end();
    }
});

app.get('/index', function(request, response) {
    if (request.session.loggedin) {
        response.render(path.join(__dirname+'/index.html'));
    } else {
        response.send('NON CE NEST PAS LE BON MOT DE PASSE');
    }
    response.end();
});

app.listen(3000);