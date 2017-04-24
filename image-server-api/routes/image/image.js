var aws = require('aws-sdk');
var shortid = require('shortid');
var multer  = require('multer');
var exif = require('exif').ExifImage
var amqp = require('amqplib/callback_api');
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
          var imageBody = {
              url: "https://s3.us-east-2.amazonaws.com/multimedia-term-project/" + fileName,
              name: fileName,
              userId: req.param.userId
          }
          if (!data) {
              image.create(imageBody, function (err, image) {
                  if (err) {
                      res.status(500).send(err);
                  }
                  res.json(image)
              });
          } else {
              imageBody.location = {
                  longitude: data.gps.longitude,
                  latitude: data.gps.latitude
              };
              imageBody.created = Date(data.exif.CreateDate);
              image.create(imageBody, function (err, image) {
                  if (err) {
                      res.status(500).send(err);
                  }
                  res.json(image)
              });
          }
          amqp.connect('amqp://rabbitmq', function (err, conn) {
              conn.createChannel(function (err, ch) {
                  var message = Buffer.from(JSON.stringify(imageBody));
                  var queue = 'images';
                  ch.assertQueue(queue, {durable: true});
                  ch.sendToQueue(queue, message);
                  console.log(" [x] Sent %s", imageBody.name);
              });
          });
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
                  res.send("Object was Successfully Deleted!");
              })
          });
      });
  });
}
