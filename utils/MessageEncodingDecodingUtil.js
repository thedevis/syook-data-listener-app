const config = require('./../config/config');
const crypto = require("crypto");
class MessageEncodingDecodingUtil {
  constructor() {}
  static generateSignature(obj) {
    let _string = new MessageEncodingDecodingUtil().serialize(obj);
    let hash = crypto.createHash("sha256");
    return hash.update(_string).digest("hex");
  }
  static verifySignature(obj) {
    let _obj = JSON.parse(JSON.stringify(obj));
    let existingChecksum = _obj.secret_key;
    delete _obj.secret_key;
    let _signature = MessageEncodingDecodingUtil.generateSignature(_obj);
    return (_signature == existingChecksum);
  }
  static encrypt(obj) {
    let text = JSON.stringify(obj); //new MessageEncodingDecodingUtil().serialize(obj);
    const algorithm = "aes-256-ctr";
    const secretKey = config.app.SECRET_KEY;
    const iv = Buffer.from(config.app.IV, "hex");
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  }
  static decrypt(hash) {
    const algorithm = "aes-256-ctr";
    const secretKey = config.app.SECRET_KEY;
    const iv = Buffer.from(config.app.IV, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      iv
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash,'hex')),
      decipher.final(),
    ]);
    return decrpyted.toString();
  }
  serialize(obj) {
    if (Array.isArray(obj)) {
      return JSON.stringify(obj.map((i) => this.serialize(i)));
    } else if (typeof obj === "string") {
      return `"${obj}"`;
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj)
        .sort()
        .map((k) => `${k}:${this.serialize(obj[k])}`)
        .join("|");
    }
    return obj;
  }
}
module.exports = {
  MessageEncodingDecodingUtil,
};
