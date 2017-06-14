#! /usr/bin/env node

console.log('This script is running!!!!');


var async = require('async')
var Actor = require('./models/Actor.js');
var Script = require('./models/Script.js');
const _ = require('lodash');
const dotenv = require('dotenv');
var mongoose = require('mongoose');
var fs = require('fs')


var highUsers = require('./highusers.json');
var actors1 = require('./actorsv1.json');
var posts1 = require('./postsv1.json')

dotenv.load({ path: '.env' });

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');


//var connection = mongo.connect('mongodb://127.0.0.1/test');
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
var db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});



String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function timeStringToNum (v) {
  var timeParts = v.split(":");
  return parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
}

function highActorCreate(random_actor) {
  actordetail = {};
  actordetail.profile = {};

  actordetail.profile.name = random_actor.name.first.capitalize() +' '+random_actor.name.last.capitalize();
  actordetail.profile.gender = random_actor.gender;
  actordetail.profile.location = random_actor.location.city.capitalize() +', '+random_actor.location.state.capitalize();
  actordetail.profile.picture = random_actor.picture.large;
  actordetail.class = 'high_read';
  actordetail.username = random_actor.login.username;
  

  
  var actor = new Actor(actordetail);
       
  actor.save(function (err) {
    if (err) {
      console.log("Something went wrong!!!")
      return -1;
    }
    console.log('New high Actor: ' + actor.username);
  });

}

function ActorCreate(actor1) {
  actordetail = {};
  actordetail.profile = {};

  actordetail.profile.name = actor1.name
  actordetail.profile.gender = actor1.gender;
  actordetail.profile.location = actor1.location;
  actordetail.profile.picture = actor1.picture;
  actordetail.profile.bio = actor1.bio;
  actordetail.profile.age = actor1.age;
  actordetail.class = actor1.class;
  actordetail.username = actor1.username;
  

  
  var actor = new Actor(actordetail);
       
  actor.save(function (err) {
    if (err) {
      console.log("Something went wrong!!!")
      return -1;
    }
    console.log('New Actor: ' + actor.username);
  });

}

function PostCreate(new_post) {
  
  Actor.findOne({ username: new_post.actor}, (err, act) => {
    if (err) { console.log(err); return next(err); }

    console.log('Looking up Actor ID is : ' + act._id); 
    var postdetail = new Object();
    postdetail.actor = {};
    postdetail.body = new_post.body
    postdetail.post_id = new_post.id;
    postdetail.class = new_post.class;
    postdetail.picture = new_post.picture;
    postdetail.actor.$oid = act._id.toString();
    //postdetail.actor=`${act._id}`;
    //postdetail.actor2=act;
    postdetail.time = timeStringToNum(new_post.time);

    /*
    bookdetail = { 
    title: title,
    summary: summary,
    author: author,
    isbn: isbn
    }; 

    var postdetail = {
    class: new_post.class,
    post_id: new_post.id,
    actor2: act,
    time: timeStringToNum(new_post.time),
    picture: new_post.picture,
    body: new_post.body
    }
    */

    console.log('Looking up Actor: ' + act.username); 
    //console.log(mongoose.Types.ObjectId.isValid(postdetail.actor.$oid));
    //console.log(postdetail);

    fs.appendFileSync('upload_postsv1.json', JSON.stringify(postdetail));

    
    //var post = new Script(postdetail, 'throw');

    //console.log('@@@@@New post before save: ' + post.post_id);
     /*    
    post.save(function (err) {
      if (err) {
        console.log("Something went wrong!!!")
        console.log(err);
        return -1;
      }
      else {
            console.log('#########New post: ' + post.post_id);
        }
      
    });//save */

  });

}
/*
for (var i = 0, len = actors1.length; i < len; i++) {
  if ((actors1[i].class == "cohort") || (actors1[i].class == "normal"))
    {
      console.log("@@@Looking at "+actors1[i].username);
      ActorCreate(actors1[i]);
    }

}*
for (var i = 0, len = highUsers.results.length; i < len; i++) {
  
      highActorCreate(highUsers.results[i]);
}*/
for (var i = 0, len = posts1.length; i < len; i++) {
      
      PostCreate(posts1[i]);
}

//PostCreate(posts1[0]);
//PostCreate(posts1[1]);
console.log('After Lookup:');




    //All done, disconnect from database
    mongoose.connection.close();