/**
 * IndexedDB storage for Subject PDF Notes
 * Allows saving large PDF files locally in the browser
 */

export interface PdfMeta {
  id: string;
  name: string;
  subject: string;
  sem: number;
  size: number;
  added: number;
}

export interface PdfRecord extends PdfMeta {
  blob: Blob;
}

const DB_NAME = 'btech_journey_db';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_notes';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePdf(meta: PdfMeta, file: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const record: PdfRecord = {
      ...meta,
      blob: file,
    };
    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function listPdfs(): Promise<PdfRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results: PdfRecord[] = request.result || [];
      // Sort most recent first
      results.sort((a, b) => b.added - a.added);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deletePdf(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
