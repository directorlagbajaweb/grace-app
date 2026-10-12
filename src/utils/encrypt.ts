import {
  AESEncryptionKey,
  AESSealedData,
  aesDecryptAsync,
  aesEncryptAsync,
  getRandomBytes,
} from 'expo-crypto';

/*
 * AES-256-GCM via expo-crypto's native implementation.
 *
 * Output format: `<iv hex>:<ciphertext + 16-byte GCM tag, hex>`
 * A fresh 12-byte IV is generated for every call. The tag is appended to the
 * ciphertext (the same layout Web Crypto uses), so tampering is detected on
 * decrypt. The key is a 64-character hex string (32 bytes).
 */

const IV_BYTES = 12;
const TAG_BYTES = 16;

function utf8Encode(text: string): number[] {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }
  return bytes;
}

function utf8Decode(bytes: ArrayLike<number>): string {
  let text = '';
  for (let i = 0; i < bytes.length; ) {
    const byte = bytes[i];
    let code: number;
    if (byte < 0x80) {
      code = byte;
      i += 1;
    } else if (byte < 0xe0) {
      code = ((byte & 0x1f) << 6) | (bytes[i + 1] & 0x3f);
      i += 2;
    } else if (byte < 0xf0) {
      code = ((byte & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f);
      i += 3;
    } else {
      code =
        ((byte & 0x07) << 18) |
        ((bytes[i + 1] & 0x3f) << 12) |
        ((bytes[i + 2] & 0x3f) << 6) |
        (bytes[i + 3] & 0x3f);
      i += 4;
    }
    text += String.fromCodePoint(code);
  }
  return text;
}

const hexToBytes = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) throw new Error('Invalid hex');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
};

const bytesToHex = (bytes: ArrayLike<number>): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

// Importing a key crosses the native bridge, so reuse it for the same hex key.
let cachedKey: { hex: string; key: Promise<AESEncryptionKey> } | null = null;

function importKey(keyHex: string): Promise<AESEncryptionKey> {
  if (cachedKey?.hex !== keyHex) {
    if (keyHex.length !== 64) throw new Error('Key must be 32 bytes (64 hex characters)');
    cachedKey = { hex: keyHex, key: AESEncryptionKey.import(keyHex, 'hex') };
  }
  return cachedKey.key;
}

export async function encrypt(text: string, keyHex: string): Promise<string> {
  const key = await importKey(keyHex);
  const iv = getRandomBytes(IV_BYTES);
  const sealed = await aesEncryptAsync(Uint8Array.from(utf8Encode(text)), key, {
    nonce: { bytes: iv },
    tagLength: TAG_BYTES,
  });
  const ciphertext = await sealed.ciphertext({ includeTag: true, encoding: 'bytes' });
  return `${bytesToHex(iv)}:${bytesToHex(ciphertext)}`;
}

export async function decrypt(payload: string, keyHex: string): Promise<string> {
  const [ivHex, cipherHex, ...rest] = payload.split(':');
  if (!ivHex || cipherHex === undefined || rest.length > 0) {
    throw new Error('Invalid encrypted payload');
  }
  const key = await importKey(keyHex);
  const sealed = AESSealedData.fromParts(hexToBytes(ivHex), hexToBytes(cipherHex), TAG_BYTES);
  const plaintext = await aesDecryptAsync(sealed, key, { output: 'bytes' });
  return utf8Decode(plaintext);
}
