const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs')
const axios = require('axios')

let statedata=[]
try {
  statedata = (JSON.parse(fs.readFileSync('./private/statesdaily.json')))
  //console.log(statedata)
} catch(err) {
  console.log(err)
}
statedata.reverse()


let popdata=[]
try {
  popdata = (JSON.parse(fs.readFileSync('./private/states.json')))
  //console.log(statedata)
  popdata = popdata["data"]
} catch(err) {
  console.log(err)
}

statepop={}
for (let i=0; i<popdata.length; i++){
    let d = popdata[i]
    let s = d["State"]
    let p = d["Pop"]
    //console.log("i="+i)
    //console.log(JSON.stringify(d))
    //console.log(s)
    //console.log(p)
    statepop[s]= p
}

console.log(JSON.stringify(popdata,2))
console.log("===== statepop ======")
console.log(JSON.stringify(statepop,2))
console.log("**********")

function getStateData(){
    axios.get("https://covidtracking.com/api/v1/states/daily.json")
      .then(r => {console.dir(typeof(r)); statedata = r['data']; statedata.reverse(); console.log('new data!')})
      .catch(e => {console.log("error "+e)})
      .finally(() => {console.log('finally: ')})
}

getStateData()
lastStatedataTime = new Date()


console.log('statedatalen = '+statedata.length )
for (let i in statedata){
  for (let j in statedata[i]){
    if (statedata[i][j]==null){
      statedata[i][j]=0
    }
  }
}
usstates = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}
// require the socket.io module


//var apikey = require('./config/apikey');

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

const mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/mycoviddb', { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const commentController = require('./controllers/commentController')
const profileController = require('./controllers/profileController')
const forumPostController = require('./controllers/forumPostController')
const quiz2Controller = require('./controllers/quiz2Controller')
// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)


var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session(
  { secret: 'zzbbyanana',
    resave: false,
    saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="YellowCartwheel"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.user = req.user
      res.locals.loggedIn = true
    }
  else {
    res.locals.loggedIn = false
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile')
    });

app.get('/editProfile',isLoggedIn, (req,res)=>{
  res.render('editProfile')
})

app.get('/profiles', isLoggedIn, profileController.getAllProfiles);
app.get('/showProfile/:id', isLoggedIn, profileController.getOneProfile);


app.post('/updateProfile',profileController.update)

// add page for editProfile and views
// add router for updateProfile and send browser to /profie

// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});


app.get('/', function(req, res, next) {
  //res.render('index',{title:"YellowCartwheel"});
  res.redirect('/us')
});

app.use('/us',(req,res,next) =>{
    const now = new Date()
    let dt = (now - lastStatedataTime)/1000/60
    if (dt > 5){ // check every 5 minute
        console.log("getting new state data")
        console.log("at time "+now)
        getStateData()
    }
    states = req.body.state || 'MA'
    if (typeof(states)=="string"){
        states = [states]
    }
    yaxistype = req.body.yaxistype || 'linear'
    units = req.body.units || 'per10000'
    fields = req.body.fields || ['positiveIncrease']
    if (typeof(fields)=="string"){
        fields = [fields]
    }
    //console.log('statedata=')
    //console.dir(statedata)
    datechecked = statedata[0]['datechecked'] || 'unknown'
    data = statedata.filter(d=>(d.state==states[0]))
    data.pop()
    data2 = {}
    data3 = {}
    for(let i=0; i<states.length; i++){
        let s = states[i]
        data2[s] = statedata.filter(d=>(d.state==s))
        //data2[s].pop()  // the last day is repeated for some reason
    }
    dates = data2[states[0]].map(d => d['date'])
    //console.dir(req.body)
    //console.dir(data2)
    //console.dir(fields)
    //console.dir(dates)


  res.render('us2',
        {data:data,
         data2:data2,
         data3:data3,
         fields:fields,
         dates:dates,
         usstates:usstates,
         states:states,
         statepop:statepop,
         state:states[0],
         yaxistype: yaxistype,
         dateChecked: datechecked,
         units:units
            })
})

function weeklyaverage(nums) {
  z=[]
  for (i in nums) {
        z.push(nums.slice(Math.max(i-6,0),parseInt(i)+1).reduce((t,n) => t+n)/7)
  }
  return z
}

app.get('/chat',(req,res,next)=>{
  res.render('chat',{title:"ChatDemo"});
})

app.get('/quiz2',quiz2Controller.getAllMovieRatings)


app.get('/forum',forumPostController.getAllForumPosts)

app.post('/forum',forumPostController.saveForumPost)

app.post('/forumDelete',forumPostController.deleteForumPost)

app.get('/showPost/:id',
        forumPostController.attachAllForumComments,
        forumPostController.showOnePost)

app.get('/showPostComments/:id',
        forumPostController.attachAllForumComments,
        (req,res)=>{
          res.render('forumPostComments',{title:"comments"})
        })

app.post('/saveForumComment',forumPostController.saveForumComment)




app.get('/griddemo', function(req, res, next) {
  res.render('griddemo',{title:"Grid Demo"});
});



app.get('/bmidemo', (req, res) => {
  res.render('bmidemo',{title:"BMI Demo"});
});



// myform demo ...

app.get('/myform', function(req, res, next) {
  res.render('myform',{title:"Form Demo"});
});

app.post('/processform', commentController.saveComment)

app.get('/showComments', commentController.getAllComments)
// app.use('/', indexRouter);  // this is how we use a router to handle the / path
// but here we are more direct

app.get('/showComment/:id', commentController.getOneComment)

function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",url:req.body.url, coms:req.body.theComments})
}



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
