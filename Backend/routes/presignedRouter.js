const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config({path: '../config.env'});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

router.get('/presigned-url', (req, res) => {
  const { filename, fileType } = req.query;

  if (!filename || !fileType) {
    return res.status(400).json({ status: 'fail', message: 'Missing filename or fileType' });
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    ContentType: fileType,
    Expires: 60, // URL expires in 60 seconds
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error('Error generating pre-signed URL:', err);
      return res.status(500).json({ status: 'fail', message: 'Could not generate pre-signed URL' });
    }

    res.status(200).json({ status: 'success', url });
  });
});

module.exports = router;
