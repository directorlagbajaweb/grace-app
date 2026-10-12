/*
 * Jest stand-in for expo-crypto. The real AES functions call a native module
 * that doesn't exist under Node, so this implements the same subset of the API
 * with Node's crypto module: real AES-GCM, not a fake.
 *
 * Usage in a test file:
 *   jest.mock('expo-crypto', () => require('@/testing/expoCryptoMock'));
 */

const nodeCrypto = require('crypto');

const hexToBytes = (hex: string) =>
  Uint8Array.from(hex.match(/../g) ?? [], (byte) => parseInt(byte, 16));

const concat = (a: Uint8Array, b: Uint8Array) => {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
};

export const getRandomBytes = (n: number): Uint8Array =>
  Uint8Array.from(nodeCrypto.randomBytes(n));

export const randomUUID = (): string => nodeCrypto.randomUUID();

export class AESEncryptionKey {
  constructor(readonly raw: Uint8Array) {}

  static async import(hex: string, _encoding: 'hex'): Promise<AESEncryptionKey> {
    return new AESEncryptionKey(hexToBytes(hex));
  }
}

export class AESSealedData {
  constructor(
    private readonly ivBytes: Uint8Array,
    private readonly cipherBytes: Uint8Array,
    private readonly tagBytes: Uint8Array
  ) {}

  static fromParts(iv: Uint8Array, ciphertextWithTag: Uint8Array, tagLength = 16) {
    const split = ciphertextWithTag.length - tagLength;
    return new AESSealedData(
      iv,
      ciphertextWithTag.slice(0, split),
      ciphertextWithTag.slice(split)
    );
  }

  async iv() {
    return this.ivBytes;
  }

  async tag() {
    return this.tagBytes;
  }

  async ciphertext(options?: { includeTag?: boolean }) {
    return options?.includeTag ? concat(this.cipherBytes, this.tagBytes) : this.cipherBytes;
  }
}

const algorithm = (key: AESEncryptionKey) => `aes-${key.raw.length * 8}-gcm`;

export async function aesEncryptAsync(
  plaintext: Uint8Array,
  key: AESEncryptionKey,
  options: { nonce: { bytes: Uint8Array }; tagLength?: number }
): Promise<AESSealedData> {
  const iv = options.nonce.bytes;
  const cipher = nodeCrypto.createCipheriv(algorithm(key), key.raw, iv, {
    authTagLength: options.tagLength ?? 16,
  });
  const body = concat(Uint8Array.from(cipher.update(plaintext)), Uint8Array.from(cipher.final()));
  return new AESSealedData(iv, body, Uint8Array.from(cipher.getAuthTag()));
}

export async function aesDecryptAsync(
  sealed: AESSealedData,
  key: AESEncryptionKey
): Promise<Uint8Array> {
  const tag = await sealed.tag();
  const decipher = nodeCrypto.createDecipheriv(algorithm(key), key.raw, await sealed.iv(), {
    authTagLength: tag.length,
  });
  decipher.setAuthTag(tag);
  return concat(
    Uint8Array.from(decipher.update(await sealed.ciphertext())),
    Uint8Array.from(decipher.final())
  );
}
