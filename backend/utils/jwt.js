const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET;
const JWT_EXPIRES_IN = "1h";
const crypto = require("node:crypto");

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  // Generate SHA256 fingerprint from the public key
  const publicKeyObject = crypto.createPublicKey(publicKey);

  const publicKeyDer = publicKeyObject.export({
    type: "spki",
    format: "der",
  });

  const fingerprint = crypto
    .createHash("sha256")
    .update(publicKeyDer)
    .digest("base64")
    .replace(/=+$/, "");

  return {
    private_key: privateKey,
    public_key: publicKey,
    fingerprint: `SHA256:${fingerprint}`,
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateKeyPair,
};
