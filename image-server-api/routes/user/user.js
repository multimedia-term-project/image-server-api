var user = require("./user.schema.js");
var shortid = require('shortid');

module.exports = function (app) {

  // Handles POST /user/signup
  app.post("/user/signup", function(req, res){

    // Generates new user Id
    var userId = shortid.generate();

    // Creates new document in user collection
    user.create({
      name : req.body.name,
      email : req.body.email,
      password : req.body.password,
      _id : userId
    }).then(function (user, err) { // After document is added respond to client
      if (err) {
        res.status(500).send(err);
      }

      res.json({
        name : user.name,
        userId : user._id
      });
    });
  });

  app.post("/user/signin", function(req, res){

    user.findOne({email: req.body.email}).then(function(user, err) {

      if (err) {
        res.status(500).send(err);
      }

      if (user == null) {
        res.status(404).send("email does not exist");
      }

      if (user.password == req.body.password) {
        res.json(user);
      } else {
        res.status(401).send("Incorect password");
      }
      
    });
  });

}
