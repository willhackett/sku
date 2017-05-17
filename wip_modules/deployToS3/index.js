const AWS = require('aws-sdk');
const zlib = require('zlib');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const __VERBOSE_LOGGING = false;

const trace = (...args) => {
  if (__VERBOSE_LOGGING) {
    console.log(...args);
  }
};

const deployToS3 = (
  {
    localDir,
    accessKeyId,
    secretAccessKey,
    prefix,
    bucket,
    cacheControlMaxAge,
    dryRun = true,
    globPattern = '**/*'
  }
) => {
  if (!localDir) {
    throw new Error('No localDir');
  }
  if (!accessKeyId) {
    throw new Error('No accessKeyId');
  }
  if (!prefix) {
    throw new Error('No prefix');
  }
  const s3 = new AWS.S3({ accessKeyId, secretAccessKey });
  const putObject = (params, callback) => {
    trace('Put Object:', params.Key, params);
    if (!dryRun) {
      s3.putObject(params, callback);
    } else {
      console.log('DRY RUN UPLOAD', params.Key, params);
    }
  };

  const folderFromRoot = localDir;
  const filesToUpload = glob.sync(globPattern, {
    cwd: folderFromRoot,
    nodir: true
  });

  if (!filesToUpload || filesToUpload.length === 0) {
    throw new Error(`No files found for ${globPattern} in ${folderFromRoot}`);
  }

  const uploadFile = fileName => {
    return new Promise((resolve, reject) => {
      const fileOnDisk = path.join(folderFromRoot, fileName);
      trace('fileOnDisk', fileOnDisk);
      const params = {
        Bucket: bucket,
        CacheControl: `max-age=${cacheControlMaxAge}`,
        ContentType: mime.lookup(fileName),
        Key: `${prefix}/${fileName}`
      };
      const buffer = fs.readFileSync(fileOnDisk);
      params.Body = buffer;
      putObject(params, (uploadError, data) => {
        if (uploadError) {
          reject(`Error Uploading File ${uploadError}`);
        } else {
          trace('Successfully Uploaded', fileName, data);
          resolve();
        }
      });
    });
  };

  trace(
    `Found ${filesToUpload.length} files in ${folderFromRoot} with the first ${filesToUpload[0]}`
  );
  return Promise.all(filesToUpload.map(uploadFile))
    .then(files => {
      trace(`All files ${files.length} Uploaded`);
      return files;
    })
    .catch(error => {
      console.error(`Error Occured: ${error}`);
    });
};

module.exports = deployToS3;
