require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function testUpload() {
  try {
    console.log("Testing R2 connection with bucket:", process.env.R2_BUCKET_NAME);
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'test-upload.txt',
      Body: 'Hello World from Test Script',
      ContentType: 'text/plain',
    });
    const result = await r2Client.send(command);
    console.log("SUCCESS! Upload worked. Result:", result);
  } catch (error) {
    console.error("FAILED! Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("HTTP Status Code:", error.$metadata?.httpStatusCode);
    console.log("Full error:", error);
  }
}

testUpload();
