var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

var botPatience = 0;

function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        botRegexsts = /Dr. Q, status(!|.)?/;
        botRegexBio = /(F|f)rom a biological/;
        botRegexWee = /(KUN|kun)/;
        botRegexBTW = /Get back to work, Dr. Q/;
        
    if(request.text && botRegexsts.test(request.text) && botPatience < 3) {
      this.res.writeHead(200);
      postMessage(cool());
      botPatience++;
      this.res.end();
    } 
    
    else if(request.text && botRegexBio.test(request.text) && botPatience < 3) {
      this.res.writeHead(200);
      postMessage("http://google.com");
      botPatience++;
      this.res.end();
    } 
    
    
    else if(request.text && botRegexWee.test(request.text) && botPatience < 3) {
      this.res.writeHead(200);
      postMessage("Weeaboo");
      botPatience++;
      this.res.end();
    } 
    
    else if(request.text && botRegexBTW.test(request.text) && botPatience < 3) {
      this.res.writeHead(200);
      postMessage("okay");
      botPatience = 0;
      this.res.end();
    } 
    
    else if(botPatience >= 3 && botPatience <= 5){
      this.res.writeHead(200);
      postMessage("d[-_-]b );
      this.res.end();
    }
    
    else {
      console.log("don't care");
      this.res.writeHead(200);
      this.res.end();
    }
}

function postMessage(response) {
  var botResponse,options, body, botReq;

  botResponse = response

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
