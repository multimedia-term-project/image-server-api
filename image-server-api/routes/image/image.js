var aws = require('aws-sdk');
var shortid = require('shortid');
var multer  = require('multer');
var exif = require('exif').ExifImage
var image = require('./image.schema.js');

aws.config.loadFromPath('./aws.config.json');
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

      exif({image: req.files[0].buffer}, function (err, data) {
          if (!data) {
              image.create({
                  url: "https://s3.us-east-2.amazonaws.com/multimedia-term-project/" + fileName,
                  name : fileName,
                  userId: req.param.userId
              }, function (err, image) {
                  if (err) {
                    res.status(500).send(err);
                  }
                  res.json(image)
            });
          } else {
              image.create({
                  url: "https://s3.us-east-2.amazonaws.com/multimedia-term-project/" + fileName,
                  name: fileName,
                  userId: req.param.userId,
                  created: Date(data.exif.CreateDate),
                  location: {
                      longitude: data.gps.longitude,
                      latitude: data.gps.latitude
                  }
              }, function (err, image) {
                  if (err) {
                      res.status(500).send(err);
                  }
                  res.json(image)
              });
          }
      });
    });
  });

  app.get('/image/:userId', function (req, res) {
      image.find({'userId': req.param.userId}, function (err, images) {
          if (err) {
            res.status(500).send(err);
          }

          res.json(images);
      });
  });

  app.delete('/image/:imageId', function (req, res) {
      image.findById(req.params.imageId, function (err, image_){
          if (err) {
              res.status(500).send(err);
          }
          var params = {
              Bucket : "multimedia-term-project",
              Key : image_.name
          };
          s3.deleteObject(params, function (err, data) {
              if (err) {
                  res.status(500).send(err);
              }
              image.deleteOne({_id: req.params.imageId}, function (err, data) {
                  if (err) {
                      res.status(500).send(err);
                  }
                  res.send("Object was Successfully Deleted!")
              })
          });
      });
  });


}
