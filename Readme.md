Image Server API
---

## Authentication


### Sign Up
``` js
POST /user/signup
{
  "email": String,
  "password": String,
  "Name": String
}


{
  "status": Number,
  "userId": String  
}

```

### Sign In

``` js
POST /user/signin

{
  "email": String,
  "password": String
}


{
  "status": Number,
  "userId": String  
}
```

## Image

### Upload

``` js

POST /image/:userId

{
  "image": Image,
}

{
  "imageUrl": URL, //link to image on S3
}

```

### Retrieval

``` js

GET /image/:userId



{
  "images": [
    {
      "imageUrl": URL,
      "date": Date,
      "location": {
        "longitude": Number,
        "latitude": Number
      }
    }, ...
  ]
}

```
