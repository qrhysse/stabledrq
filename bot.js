var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

// Non-breaking spaces save the day
function spaceCalc(sbheader, header, obj) {
  var num = sbheader.length - (String(obj).length + header.length);
  return Array(num+1).join('\u00A0');
}

function getScoreboard(lols, darns) {
    console.log('getScoreboard called');
    var scoreboardHead = "-------------SCOREBOARD-------------";
    var totalLols = "TOTAL LOLS:";
    var totalDarns = "TOTAL DARNS:";
    var lolspaces = spaceCalc(scoreboardHead, totalLols, lols);
    var darnspaces = spaceCalc(scoreboardHead, totalDarns, darns);
    var lolLine = totalLols + lolspaces + lols;
    var darnLine = totalDarns + darnspaces + darns;
    var scoreboard = "-------------SCOREBOARD-------------\n\n" + lolLine + "\n" + darnLine + "\n\n---------Since July 13 2016---------";
    console.log('Scoreboard is: ', scoreboard);
    return scoreboard;
}

function scoreboard(forParse, resp) {
  var lolTrigger = /(lol|\blol)/ig;
  var darnTrigger = /(darn|\bdarn)/ig;
  var botRegexScoreboard = /\/scoreboard/i;
  var request = require('request');
  var jsonObj, lolCount, darnCount, returnval = 0;
  var count = 0;

  request('https://api.myjson.com/bins/4xupz', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonObj = JSON.parse(body);
      var lolCount = jsonObj.lols;
      var darnCount = jsonObj.darns;
      if( forParse && botRegexScoreboard.test(forParse)) {
        returnval = getScoreboard(lolCount, darnCount);
        resp.res.writeHead(200);
        postMessage(returnval, false);
        resp.res.end();
      } else {
        if( lolTrigger.test(forParse)) {
          count = (forParse.match(lolTrigger) || []).length;
          lolCount += count;
        }
        if( darnTrigger.test(forParse)) {
          count = (forParse.match(darnTrigger) || []).length;
          darnCount += count;
        }
        request({ url: 'https://api.myjson.com/bins/4xupz', method: 'PUT', json: {lols: lolCount, darns: darnCount}});
        returnval = 0;
      }
    } else {
      returnval = 0;
    }
  });
}

function respond() { 
  var request = JSON.parse(this.req.chunks[0]);
  var botRegexsts = /Dr. Q, status(!|.)?/i;
  var botRegexBio = /from a biological/i;
  var botRegexWee = /(-|\s[^a-z]?)kun/i;
  var botRegexDad = /(^dad$|\bdad[^a-z]?)/i;
  var botRegexRip = /(^r\.?i\.?p\.?$|\sr\.?i\.?p\.?[^a-z]?)/i;
  var botRegexAlex = /(^actually$|\bactually[^a-z]?)/i;
  var botRegexSandwich = /(^sandwich$|\bsandwich[^a-z]?)/i;
  var botRegexSkeleton= /(^skeletons?$|\bskeletons?[^a-z]?)/i;
  var sbPost;
  // var lolTrigger = /(lol|\blol)/ig;
  // var darnTrigger = /(darn|\bdarn)/ig;
  // var botRegexScoreboard = /\/scoreboard/i;
  //var botRegexDadJoke = /(\bI'?\s*a?m\b)/g; // I am, I'm, Im, or Iam
  var botRegexDadJoke = /\bi'?m\s+/i;
  var botRegexThbby = /\?\s*$/i;
  // var loldarnCount = require('./ld.json');
  
  // console.log(loldarnCount);
  console.log(request);    
  
  if( request.name !== "Dr. Q" ) {
    if(request.text && botRegexsts.test(request.text)) {
      this.res.writeHead(200);
      postMessage(cool(), false);
      this.res.end();
    }

    scoreboard( request.text, this );
    
    if(request.text && botRegexBio.test(request.text)) {
      var link = request.text;
      link = link.replace(/from a biological (perspective|standpoint),?/i, "");
      link = link.replace(/ /g, "+");
      link = link.replace("%", "%25");

      this.res.writeHead(200);
      postMessage("https://www.google.com/#safe=off&q="+link, true);
      this.res.end();
    } 
    
    if(request.text && botRegexWee.test(request.text)) {
      this.res.writeHead(200);
      postMessage("Goddamn Weeaboo", false);
      this.res.end();
    }

    if( request.text && botRegexThbby.test(request.text)) {
      console.log("Thbby activated.");
      this.res.writeHead(200);
      postMessage("https://s32.postimg.org/l9cjr1411/idk.jpg", false);
      this.res.end();
    }

    if(request.text && botRegexDadJoke.test(request.text)) {
      var content = request.text;
      var jokeVariable = content.replace(/.*?\bi'?m\b/i, "" );
      var joke = "Hi" + jokeVariable + ", I'm Dad.";
      this.res.writeHead(200);
      postMessage(joke, false);
      this.res.end();
      // var contentLowercase = content.toLowerCase();
      // var contentArray = content.split(' ');
      // var jokeContent;
      // var contentLCArray = contentLowercase.split(' ');
      // var firstUpperIm = contentLCArray.indexOf("i'm");
      // var firstLowerIm = contentLCArray.indexOf("im");
      // var trueIndex = -69;

      // if( (firstUpperIm !== firstLowerIm ) ) {
      //   if( firstUpperIm > -1 ) {
      //     trueIndex = firstUpperIm;
      //   } else if( firstLowerIm > -1 ) {
      //     trueIndex = firstLowerIm;
      //   }
      //   if( trueIndex != -69 ) {
      //     contentArray.splice(0, trueIndex+1);
      //     jokeContent = contentArray.join(' ');
      //   }
      // }

      console.log("Joke activated.");
      console.log(joke);
    }

    if( request.text && botRegexAlex.test(request.text)) {
      this.res.writeHead(200);
      postMessage("https://s32.postimg.org/ld1h4212t/alex.png", false);
      this.res.end();
    }
    
    if(request.text && botRegexDad.test(request.text)) {
      this.res.writeHead(200);
      postMessage("I'm not your fucking Dad.", false);
      this.res.end();
    }

    if( request.text && botRegexSandwich.test(request.text)) {
      this.res.writeHead(200);
      postMessage("can i get a bbq huge pls tyty", false);
      this.res.end();
    }

    if(request.text && botRegexRip.test(request.text)) {
      this.res.writeHead(200);
      postMessage("https://s31.postimg.org/pjuh7qfxn/RIP.jpg", false);
      this.res.end();
    }

    if( request.text && botRegexSkeleton.test(request.text)) {
      console.log("Skeleton activated.");
      this.res.writeHead(200);
      postMessage("Did somebody say skeleton?", false);
      this.res.end();
      
      // this.res.writeHead(200);
      // postMessage("Did somebody say skeleton?", false);
      // this.res.end();

      // setTimeout(function(thing){
      // thing.res.writeHead(200);
      // postMessage("https://s31.postimg.org/gzpyios4b/Mrbones1.png", false);
      // thing.res.end();
      // }(this), 10000);
      
      // setTimeout(function(thing){
      // thing.res.writeHead(200);
      // postMessage("https://s32.postimg.org/gen34js5x/Mrbones1_2.png", false);
      // thing.res.end();
      // }(this), 200000);
      
    }
  }
}

function postMessage(response, isLink) {
  var botResponse, options, body, botReq;

  botResponse = response;
  if( isLink == false ) {
    botResponse = botResponse.replace(/%/g, " percent");
  }

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
