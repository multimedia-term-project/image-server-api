var aws = require('aws-sdk');
var shortid = require('shortid');
var multer  = require('multer');

var image = require('./image.schema.js');

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
      image.create({
          url : "https://s3.us-east-2.amazonaws.com/multimedia-term-project/" + fileName,
          userId : req.param.userId
      }).then(function (image, err) {
          if (err) {
            res.status(500).send(err);
          }
          res.json(image)
      });
    });
  });

  app.get('/image/:userId', function (req, res) {
      image.find({'userId': req.param.userId}).then(function (images, err) {
          if (err) {
            res.status(500).send(err);
          }

          res.json(images);
      });
  });
}
