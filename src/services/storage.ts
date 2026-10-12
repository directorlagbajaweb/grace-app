import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

import { decrypt, encrypt } from '@/utils/encrypt';

export type Entry = {
  id: string;
  text: string;
  createdAt: number;
};

// What is written to AsyncStorage: same shape, but `text` is ciphertext.
type StoredEntry = Entry;

const ENTRIES_KEY = 'grace.entries';
const ENCRYPTION_KEY_NAME = 'grace.encryptionKey';
const KEY_BYTES = 32;
export const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

let cachedKey: string | null = null;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

// Creates the key on first launch; reuses it after that.
export async function getOrCreateKey(): Promise<string> {
  if (cachedKey) return cachedKey;
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
  if (!key) {
    key = toHex(Crypto.getRandomBytes(KEY_BYTES));
    await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
  }
  cachedKey = key;
  return key;
}

async function readStored(): Promise<StoredEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const writeStored = (entries: StoredEntry[]) =>
  AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));

export async function saveEntry(text: string): Promise<void> {
  const key = await getOrCreateKey();
  const entry: StoredEntry = {
    id: Crypto.randomUUID(),
    text: await encrypt(text, key),
    createdAt: Date.now(),
  };
  const entries = await readStored();
  entries.push(entry);
  await writeStored(entries);
}

// Returns entries with their text decrypted, oldest first. Entries that can't
// be decrypted (corrupted, or written by the old XOR cipher) are skipped.
export async function getAllEntries(): Promise<Entry[]> {
  const key = await getOrCreateKey();
  const entries = await readStored();
  const decrypted = await Promise.all(
    entries.map(async (entry) => {
      try {
        return { ...entry, text: await decrypt(entry.text, key) };
      } catch {
        return null;
      }
    })
  );
  return decrypted.filter((entry): entry is Entry => entry !== null);
}

export async function clearAllEntries(): Promise<void> {
  await AsyncStorage.removeItem(ENTRIES_KEY);
}

// Deletes entries older than 30 days. Runs on every launch (see app/_layout.tsx).
export async function deleteOldEntries(now: number = Date.now()): Promise<void> {
  const entries = await readStored();
  const kept = entries.filter((entry) => now - entry.createdAt <= RETENTION_MS);
  if (kept.length !== entries.length) await writeStored(kept);
}
