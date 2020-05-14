const sharp = require('sharp');
const uuid = require('uuid/v4');
const util = require('util');
const path = require('path');
const fs = require('fs');

const fsUnlink = util.promisify(fs.unlink);

class AvatarService {
  constructor(directory) {
    this.directory = directory;
  }

  async store(buffer) {
    const filename = AvatarService.filename();
    const filePath = this.filePath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filePath);

    return filename;
  }

  async delete(filename) {
    return fsUnlink(this.filePath(filename));
  }

  static filename() {
    return `${uuid()}.png`;
  }

  filePath(filename) {
    return path.resolve(`${this.directory}/${filename}`);
  }
}

module.exports = AvatarService;
