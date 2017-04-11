var user = require("./user.schema.js");
var shortid = require('shortid');

module.exports = function (app) {
  app.post("/user/signup", function(req, res){
    var userId = shortid.generate();
    user.create({
      name : req.body.name,
      email : req.body.email,
      password : req.body.password,
      _id : userId

    }).then(function (user, err) {
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
