import fs from 'node:fs/promises';
import zlib from 'node:zlib';
import path from 'node:path';

/**
 * Native Node.js zlib gzip utilities for compacting skill packages
 */
export const compactor = {
  /**
   * Compresses a UTF-8 string or Buffer into a Gzip Buffer
   */
  compress(data) {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    return zlib.gzipSync(buffer, { level: 9 });
  },

  /**
   * Decompresses a Gzip Buffer into a UTF-8 string
   */
  decompress(buffer) {
    return zlib.gunzipSync(buffer).toString('utf8');
  },

  /**
   * Bundles an array of skills into a single gzipped JSON archive
   */
  async createBundle(skills) {
    const bundleData = {};

    for (const skill of skills) {
      const skillFiles = {};
      const entries = await fs.readdir(skill.path, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(skill.path, entry.name);
          skillFiles[entry.name] = await fs.readFile(filePath, 'utf8');
        }
      }

      bundleData[skill.name] = {
        name: skill.name,
        category: skill.category,
        description: skill.description,
        files: skillFiles,
      };
    }

    const json = JSON.stringify(bundleData);
    const compressed = this.compress(json);

    return {
      compressed,
      rawSizeBytes: Buffer.byteLength(json, 'utf8'),
      compressedSizeBytes: compressed.length,
      ratio: ((1 - compressed.length / Buffer.byteLength(json, 'utf8')) * 100).toFixed(1) + '%'
    };
  }
};
