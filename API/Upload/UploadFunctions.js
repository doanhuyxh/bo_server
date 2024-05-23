const fs = require('fs').promises;
const path = require('path');
const Logger = require('../../utils/logging');

// Upload base64 image
// fileFormat: PNG, JPEG, MP4
async function uploadMediaFile(fileData, fileFormat = 'png') {
  try {
    if (fileData) {
      // Fake name with 64 ASCII chars
      const fileName =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        '_'+`.${fileFormat}`;
      const filePath = path.join('uploads', fileName);

      // Sử dụng fs.promises.writeFile thay vì fs.appendFile
      await fs.writeFile(filePath, fileData);

      const newImageUrl = `https://${process.env.HOST_NAME2}/uploads/${fileName}`;
      console.log(newImageUrl);
      return newImageUrl;
    }
  } catch (e) {
    Logger.error('UploadFunction', e);
    throw e; // Ném lỗi để đảm bảo reject được gọi
  }
}

module.exports = {
  uploadMediaFile,
};
