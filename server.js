const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const flash = require('connect-flash');

const app = express();
const port = 8080;

const connection = mysql.createConnection({
  host: "34.64.168.98",
  user: "shoppingmall2023",
  password: "12567",
  database: "shoppingmall2023",
});

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [username],
      (err, results) => {
        if (err) return done(err);

        if (!results || results.length === 0) {
          return done(null, false, { message: '해당 사용자를 찾을 수 없습니다.' });
        }

        const user = results[0];
        if (user.pw !== password) {
          return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }

        return done(null, user);
      }
    );
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  connection.query(
    'SELECT * FROM user WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return done(err);

      if (!results || results.length === 0) {
        return done(null, false, { message: '세션에 저장된 사용자를 찾을 수 없습니다.' });
      }

      const user = results[0];
      return done(null, user);
    }
  );
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('사용자 프로파일 페이지입니다.');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
