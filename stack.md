#The tech behind Bolt

##Heroku

Our app is relatively small in scope and retains a limited amount of user data, so we deployed with [Heroku](https://www.heroku.com). The free version is shockingly easy to set up, giving us a simple way to avoid deployment bugs and a heavy web infrastructure. Heroku’s easy setup also allowed us to begin testing on mobile immediately so we could get straight into developing our location-based features.

If you decide to deploy Bolt on Heroku, follow the deployment guide below and make sure to read the section on MLab.

###Deployment Guide

If you haven’t tried out [Heroku’s Hello World guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction), take a look at it before deploying bolt. Make sure you have heroku’s toolbelt installed so you can go to the root directory of the project and login to your Heroku account from the command line:
```
$ heroku login
Enter your Heroku credentials.
Email: zeke@example.com
Password: ****
```

Then, create your project with a custom name:
```
$ heroku create example-site-name
Creating example-site-name... done, stack is cedar-14
http://example-site-name.herokuapp.com/ | git@heroku.com:example-site-name.git
```

This will also make a remote called `heroku.` If you want to work on a heroku app you’ve already created you can add the remote yourself with git :
```
$ git remote add heroku git@heroku.com:example-site-name.git
```

If you forgot to give your app a custom name, you can always rename it later:
```
$ heroku apps:rename newname
```
Now you’re ready to deploy your app! As long as you are up to date with origin/master, all you have to do is:
```
$ git push heroku master
```

## Mongodb & MLab

In order to persist our Bolt's data, we used Mongodb via MLab’s (previously named MongoLab) plugin for Heroku. Mongodb makes server-side data interactions simple so we could focus on our app’s features instead of managing our database. Our persistent data did not rely on relationships between sets, so we did not need anything like SQL relationship tables. 

MLab offers Mongodb as a service and plays nicely with Heroku. To use MLab, you’ll need to make a free account and connect it to your heroku account. [This Scotch.io tutorial](https://scotch.io/tutorials/use-mongodb-with-a-node-application-on-heroku) by Igor Ribeiro Lima can help setting this up for the first time.

### Transfering to your own MLab project

If you want to run Bolt with your own MLab account, and we would appreciate if you did, make sure to change the MLab link in server.js:

```
// ========================================
// Connect to MLab database
// Please replace this line with your own
//  MLab link
mongoose.connect('mongodb://heroku_l3g4r0kp:61docmam4tnk026c51bhc5hork@ds029605.MLab.com:29605/heroku_l3g4r0kp');
// ========================================
```

##Angular

Since we we would potentially need a non-trivial amount of user data flowing from one controller to another (to be displayed in our views, recorded into our database, or both), we decided to use Angular as our front-end framework. Angular's declarative structure, coupled with its straightforward approach to the MV* pattern, made it the clear choice for our front-end architecture. 

###Design to development to deployment
Bolt contains a lot of moving pieces. Whether we were keeping track of current user location, previous achievements, or profile information, modularity was key to our app structure. Angular made it easy to separate our app by its various features, which would eventually become factories in our services file, the logic of which was used by one (or many) controllers in our app, which would clearly organize the data into the view as directed by our templates, as shown below:
    
```
Feature concept -> Service -> Controller -> View
```

This 'feature-first' approach to our work enabled us to have a firm grasp on our progress throughout the iterative development cycle. As we transitioned from an initial MVP to a richer app experience, keeping track of our features was as easy as looking at the templates in our view library. Unsurprisingly, this lent itself very well to the debugging process by travelling backwards up the chain from a completed feature. If we found anything amiss, we just needed to trace the flow of data. Was (for example) our profile page not displaying user information correctly? We could simply check if it was available on the $scope of the template. If it wasn't, did the data exist in the controller at all? If it did, there was our answer. If not, we would continue to move up the chain (to, in this case, the service). Was our 'Profile' factory fetching the data from our database correctly? The answer to this question would determine the state of our app's support of any given feature.

## Firebase & Geofire

We also used Geofire, an open-source JS library, to store and query user locations for multiplayer matches. Geofire uses Firebase as a medium for data storage. In short, Firebase is a cloud based service that provides real time data updates between devices. While we didn't use Firebase to store the bulk of our data, it should be noted that Firebase can be used in combination with angular to promote three-way data binding (dom element, angular model, and Firebase).

We used Geofire in light of its optimized querying techniques. Using this technology, our application is able to selectively load data that is in near proximity to the search location. Our geofire database contains usernames and corresponding geographical coordinates. A query consists of a specified center location and radius. The advantage of using geofire is apparent when considering massive amounts of data. By only searching relevant points, Geofire promotes vast scalability. For our app specifically, when a user searches for a multiplayer match, he or she will only load the data of users who are within close proximity. Thus, if our app’s user base were to span the globe, the search time for multiplayer matches would remain relatively constant. Ultimately, we decided to use geofire because of its scalability.



