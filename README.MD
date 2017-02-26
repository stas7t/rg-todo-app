# rg-todo-app
Test project for Ruby Garage

___

#### Used frameworks, libraries and technology

+ Server side: 
  * [Node.js](https://nodejs.org)
  * [Express.js](http://expressjs.com)
+ Client side: 
  * [Angular 1.5](https://angularjs.org)
  * [Semantic UI](http://semantic-ui.com)
+ Databases: 
  * [MongoDB](https://www.mongodb.com) (for users storage)
  * [PostgreSQL](https://www.postgresql.org) (for TODO lists storage)
+ Platform: [Heroku](https://www.heroku.com)
+ User authentication based on [JWT](https://jwt.io/) (JSON Web Tokens)
+ Tests:
  * Server side tests: [Mocha](https://mochajs.org/) + [Chai](http://chaijs.com/)
  * Client side unit tests: [Karma](http://karma-runner.github.io/1.0/index.html) + [Jasnime](https://jasmine.github.io/)
  * Client side end-to-end tests: [Protractor](http://www.protractortest.org) + [Jasnime](https://jasmine.github.io/)
  
___
  
#### Scripts

Run app:  
`$ npm start`  
Server side tests:  
`$ npm test`  
Client side unit tests:  
`$ karma start`  
Client side end-to-end tests:  
`$ protractor testE2E/conf.js`
