var aws = require('aws-sdk');
var shortid = require('shortid');
var multer  = require('multer')

aws.config.loadFromPath('./config.json');
var s3 = new aws.S3();

module.exports = function(app) {
  var upload = multer();
  app.post("/image/:userId", multer().any(), function(req, res){
    var fileName = shortid.generate() + "-" + req.files[0].originalname;
    var params = {
      Bucket : "multimedia-term-project",
      ACL : "public-read",
      Key : fileName,
      Body : req.files[0].buffer
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json({
          url : "https://s3.us-east-2.amazonaws.com/multimedia-term-project/" + fileName
      });
    });
  });
}
