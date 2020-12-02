var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

//Keys
const config = require('./config');

const User = require('./models/user');

var app = express();

//Database connection
const URL = "mongodb://localhost:27017/todoDb";
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'Connection Error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(session({secret: "secret", saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({_id: id}, function(err, user) {
		done(err, user);
	});
});

//Local
passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({email: username, password: password}, function(err, user) {
		if (err) return done(err);

		if (!user) return done(null, false);

		if (!user.validPassword(password)) return done(null, false);

		return done(null, user);
	})
}));


//Facebook
passport.use(new FacebookStrategy({
	clientID: "113742617138227",
	clientSecret: "734869850d9580dcafd73638db7277d2",
	callbackURL: "http://localhost:3000/auth/facebook/callback",
	profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
},
function(accessToken, refreshToken, profile, done) {
	User.findOne({ facebookID: profile.id }, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			user = new User({
				fullname: profile.name.familyName + " " + profile.name.givenName,
				email: profile.emails[0].value,
				facebookID: profile.id,
				password: '',
				created: new Date()
			});

			user.save(function(err) {
				if (err) {
					console.log(err);
				}

				return done(err, user);
			})
		}
		else {
			return done(null, user);
		}
	})
})
);

//Google
passport.use(new GoogleStrategy({
	clientID: config.GOOGLE_CLIENT_ID,
	clientSecret: config.GOOGLE_SECRET_ID,
	callbackURL: "http://localhost:3000/auth/google/callback"
}, 
function(token, secret, profile, done) {
	User.findOne({ googleID: profile.id }, function(err, user) {
		if (err) {
			return done(err);
		}

		console.log(user);

		if (!user) {
			user = new User({
				fullname: profile.displayName,
				email: profile.emails[0].value,
				googleID: profile.id,
				password: '',
				created: new Date()
			});

			user.save(function(err) {
				if (err) {
					console.log(err);
				}

				return done(err, user);
			})
		}
		else {
			return done(null, user);
		}
	})
}))

//LinkedIn
passport.use(new LinkedInStrategy({
	clientID: config.IN_CLIENT_ID,
	clientSecret: config.IN_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/linkedin/callback",
	scope: ['r_emailaddress', 'r_liteprofile'],
}, 
function(accessToken, refreshToken, profile, done) {
	User.findOne({ googleID: profile.id }, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			user = new User({
				fullname: profile.displayName,
				email: profile.emails[0].value,
				linkedInID: profile.id,
				password: '',
				created: new Date()
			});

			user.save(function(err) {
				return done(err, user);
			})
		}
		else {
			return done(null, user);
		}
	})
}))

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
