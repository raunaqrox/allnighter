/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var moment = require('moment')
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');


/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var addLinkController = require('./controllers/addLink');
var addCategoryController = require('./controllers/addCategory');
var categoryController = require('./controllers/category');
var linkController = require('./controllers/link');
var pathController = require('./controllers/path');
var addPathController = require('./controllers/addPath');
var apiController = require('./controllers/api');
var typeController = require('./controllers/type');
var commentController = require('./controllers/comment');
var ratingController = require('./controllers/rating');
var statsController = require('./controllers/stats');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'.red);
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', false);
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.locals.momet = moment;
/**
 * Middleware
 *
 */
// function ensureAuthenticated (req, res, next) {
//   if (req.isAuthenticated()) {
//       return next();
//   }else{
//     req.session.returnTo = req.path;
//     res.redirect('/login');
//   }  
// }

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/profile', passportConf.isAuthenticated, userController.getMyProfile);

app.get('/profile/:slug', userController.getUserProfile);

app.get('/add-link', passportConf.isAuthenticated, addLinkController.getAddLink);
app.post('/add-link', passportConf.isAuthenticated, addLinkController.postLink);

app.get('/add-category', passportConf.isAuthenticated, addCategoryController.getAddCategory);
app.post('/add-category', passportConf.isAuthenticated, addCategoryController.postCategory);

app.get('/add-path', passportConf.isAuthenticated, addPathController.getAddPath);
app.post('/add-path', passportConf.isAuthenticated, addPathController.postAddPath);
app.get('/path/:id/:slug', pathController.getPath);

app.get('/category/:slug', categoryController.getCategory);
app.get('/category/child/:slug', categoryController.getCatChild);

app.get('/categories', categoryController.getCategories);
app.post('/categories', categoryController.searchCategory);
app.get('/links', linkController.getLinks);
app.post('/links', linkController.searchLinks);
app.post('/update-link', passportConf.isAuthenticated, linkController.updateLink);

app.get('/paths', pathController.getPaths);

app.get('/api/category-search', apiController.categorySearch);
app.get('/api/link-search', apiController.linkSearch);
app.get('/api/type-search', passportConf.isAuthenticated, apiController.typeSearch);
// ajax
app.get('/add-type', passportConf.isAuthenticated, typeController.addType);

app.post('/add-comment', passportConf.isAuthenticated, commentController.postComment);

app.post('/add-rating', passportConf.isAuthenticated, ratingController.postRating);

app.get('/my-links', passportConf.isAuthenticated, linkController.myLinks);

app.get('/my-stats', passportConf.isAuthenticated, statsController.myStats);

app.post('/follow', passportConf.isAuthenticated, userController.follow);
app.post('/unfollow', passportConf.isAuthenticated, userController.unfollow);

/**
 * OAuth authentication routes. (Sign in)
 */

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
