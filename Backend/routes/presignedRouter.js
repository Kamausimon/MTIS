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

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
});

router.get('/presigned-url', (req, res) => {
  const { filename, fileType } = req.query;

  if (!filename || !fileType) {
    return res.status(400).json({ status: 'fail', message: 'Missing filename or fileType' });
  }
 
  const sanitizedFileName = filename.replace(/\s+/g, '_');
  const s3Key =  sanitizedFileName;
  const bucketUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;


  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: s3Key,
    ContentType: fileType,
    Expires: 60,
  };



s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error('Error generating pre-signed URL:', err);
      return res.status(500).json({ status: 'fail', message: 'Could not generate pre-signed URL' });
    }

    res.status(200).json({ status: 'success', url, key: params.Key, bucketUrl });
    console.log('Pre-signed URL:', url);
  });

});

module.exports = router;
