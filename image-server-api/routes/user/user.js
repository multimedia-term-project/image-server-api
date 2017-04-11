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
}
