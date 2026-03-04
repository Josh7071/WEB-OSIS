const fs = require('fs');
const { google } = require('googleapis');
const { getClient } = require('./googleAuth');

async function getDriveApi() {
  const auth = getClient(['https://www.googleapis.com/auth/drive']);
  return google.drive({ version: 'v3', auth });
}

async function uploadFile(localPath, originalName, mimeType) {
  const drive = await getDriveApi();
  const result = await drive.files.create({
    requestBody: {
      name: originalName,
      parents: [process.env.DRIVE_FOLDER_ID]
    },
    media: {
      mimeType,
      body: fs.createReadStream(localPath)
    },
    fields: 'id,name,webViewLink'
  });
  fs.unlinkSync(localPath);
  return result.data;
}

async function listFiles() {
  const drive = await getDriveApi();
  const result = await drive.files.list({
    q: `'${process.env.DRIVE_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id,name,createdTime,webViewLink)',
    orderBy: 'createdTime desc'
  });
  return result.data.files || [];
}

async function getDownloadStream(id) {
  const drive = await getDriveApi();
  return drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' });
}

async function deleteFile(id) {
  const drive = await getDriveApi();
  await drive.files.delete({ fileId: id });
}

module.exports = { uploadFile, listFiles, getDownloadStream, deleteFile };
