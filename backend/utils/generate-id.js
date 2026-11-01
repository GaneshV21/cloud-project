const crypto = require("node:crypto");

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
// Segment lengths: "qwert2-gftjaj-ganer22q" → 6-6-8 (20 characters + 2 hyphens)
const SEGMENTS = [6, 6, 8];

const randomSegment = (length) => {
  let out = "";
  for (let i = 0; i < length; i++) out += CHARS[crypto.randomInt(CHARS.length)];
  return out;
};

// Random id like "qwert2-gftjaj-ganer22q", using a cryptographically secure source
const generateId = () => SEGMENTS.map(randomSegment).join("-");

// Mongo duplicate-key error (unique index clash)
const isDuplicateKeyError = (error) => error?.code === 11000;

// Runs create(id) with a fresh id, retrying on the (very unlikely) chance of a clash
const createWithUniqueId = async (create, attempts = 3) => {
  for (let i = 1; ; i++) {
    try {
      return await create(generateId());
    } catch (error) {
      if (!isDuplicateKeyError(error) || i >= attempts) throw error;
    }
  }
};

module.exports = { generateId, createWithUniqueId };
