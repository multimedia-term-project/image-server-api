var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var s3 = new aws.S3();

module.exports = function(app) {
  app.post("/image/:userId", function(req, res){
    var params = {
      Bucket : "multimedia-term-project",
      ACL : "public-read",
      Key : req.body.name,
      Body : req.file
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json(data);
    });
  });
}
