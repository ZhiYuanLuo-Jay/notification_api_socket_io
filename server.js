// Load the express module and store it in the variable express (Where do you think this comes from?)
var express = require("express");
const webpush = require("web-push");

// invoke express and store the result in the variable app
var app = express();

// require body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// require session
var session = require('express-session');
app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// Load the cron module, store in variable
var cron = require('node-cron');
const parser = require('cron-parser');


// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Root Route ----------------------------------------------------------
app.get('/', function(request, response) {  
    response.render("index",  {taskIn: '', taskBack: ''});
})

// passing data from Front-End to Server
app.post('/input', function(req, res) {
    // console.log("POST DATA \n", req.body)
    req.session.cron = req.body['API'];
    req.session.task = req.body['TASK']
    res.redirect('/output')
});

// Handling the API Cron data
app.get('/output', function(req, res) {
    var cron = req.session.cron.split(",");
    var task = req.session.task.split(",");
    
    var task24 = [], cron24 = [], task3 = [];
    var curDate = new Date(); // console.log("Current Time in milliseconds", curDate.getTime())

    // rebuild the API obj from cron data and task data
    var apiArr = [];
    for(var i=0; i<cron.length; i++){
        let obj ={};
        obj['cron']=cron[i];
        obj['task']=task[i];
        // console.log(obj);
        apiArr.push(obj);
    }
    console.log("\n");
    console.log("apiArr: ", apiArr);

    for(var i=0; i<apiArr.length; i++){
        // console.log(apiArr[i]['cron']);
        var interval = parser.parseExpression(apiArr[i]['cron']);
        // var t = new Date('Thu Mar 14 2017 08:15:00 GMT-0700')
        let nextEvent = new Date(interval.next().toString());
        let prevEvent = new Date(interval.prev().toString());
        console.log("Next Event:", "\t", nextEvent, nextEvent.getTime());
        console.log('Prev Date: ', "\t", prevEvent, prevEvent.getTime());

        // Events, happening in the next 24 hours: 
        if(nextEvent.getTime() - curDate.getTime()<= 86400000){
            console.log("Happens in 24: " + apiArr[i]['task']);
            task24.push(apiArr[i]['task']);
            cron24.push(apiArr[i]['cron']);
            
        }
        // Event, previous 3 hours from the current time:
        if(curDate.getTime() - prevEvent.getTime()<= 10800000){
            console.log("Happened back 3: " + apiArr[i]['task']);
            task3.push(apiArr[i]['task']);
        }
    }

    console.log('Happens in 24:', task24);
    console.log('Happened back 3:', task3);
    
    // Push Notification when an event is starting using Socket.io  
    io.on('connection', function(socket) { //2
        socket.on('subscribe', function(data) { 
            console.log("====================================== SOCKET.io ============================================")
            var cron = require('node-cron');
            // console.log(cron24);
            // console.log(task24);

            for (let i=0; i<cron24.length; i++){              
                cron.schedule(cron24[i], function() {
                    socket.emit('receive'+i, task24[i]);
                }, false).start();               
            }            
        });
    })

    
    res.render("index", {taskIn: task24, taskBack: task3});
})

const server = app.listen(8000, function() {
    console.log("listening on port 8000");
})

// using socket
const io = require('socket.io')(server);
