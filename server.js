var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    passport	= require('passport'),
    port        = process.env.PORT || 8080,
    config = require('./config/config').config;

require('./config/passport')(passport);

app.use(function(req, res, next) {
    if ( req.method === 'OPTIONS' ) {
        console.log('OPTIONS SUCCESS');
        res.end();
    }
    else {
        next();
    }
});

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(morgan('dev'));

app.use(passport.initialize());
app.use('/public', express.static(__dirname + '/public', { maxAge: '1d' }));
//connect database
mongoose.connect(config.getEnv().database);

var apiRoutes = express.Router();

//needed for skyliner verify instance
app.get('/', function(req, res) {
    res.send('Hello! The API is working.');
});

require('./app/app')(app, apiRoutes);

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server working...');