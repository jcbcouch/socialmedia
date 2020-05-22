const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;

const { mongoURI } = require('./config/database');
mongoose.connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport')(passport);


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

  app.use(flash());
  app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

app.use('/ideas', require('./routes/ideas'));
app.use('/users', require('./routes/users'));
app.use('/profiles', require('./routes/profiles'))
app.use('/location', require('./routes/location'))

app.get('/', (req, res) => {
    res.render('index', { title: 'Fakeass Facebook'});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'hello'});
});





app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});