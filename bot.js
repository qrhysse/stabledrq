var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var botRegexsts = /Dr. Q, status(!|.)?/i;
  var botRegexBio = /from a biological/i;
  var botRegexWee = /(-|\s)kun/i;
  var botRegexDad = /(^dad$|\sdad)/i;
      // botRegexDad = /I'm/;
      
  if(request.text && botRegexsts.test(request.text)) {
    this.res.writeHead(200);
    postMessage(cool());
    this.res.end();
  } 
  else if(request.text && botRegexBio.test(request.text)) {
    this.res.writeHead(200);
    postMessage("http://google.com");
    this.res.end();
  } 
  
  else if(request.text && botRegexWee.test(request.text)) {
    this.res.writeHead(200);
    postMessage("Goddamn Weeaboo");
    this.res.end();
  } 
  
  else if(request.text && botRegexDad.test(request.text) && request.name !== "Dr. Q") {
    this.res.writeHead(200);
    postMessage("Hi Dad, I'm Dad");
    this.res.end();
  }
  
  // else if(request.text && botRegexDad.test(request.text)) {
  //   var req = request.text;
  //   var repl = req.replace("I'm", "Hi");
  //   var joke = repl + " I'm Dad.";
  //   // this.res.writeHead(200);
  //   // postMessage("Hello");
  //   // this.res.end();
    
  //   // if(req.includes("Dad")){
  //   //   console.log("don't care");
  //   //   this.res.writeHead(200);
  //   //   this.res.end();
  //   // }
    
  //   // else {
  //   //   this.res.writeHead(200);
  //   //   postMessage(joke);
  //   //   this.res.end();
  //   // }
    
  // }
  
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(response) {
  var botResponse, options, body, botReq;

  botResponse = response;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


exports.respond = respond;
