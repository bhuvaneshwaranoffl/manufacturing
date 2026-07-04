// ==========================================================
// ON-DEVICE DATABASE  (Mobile / Offline version)
// ==========================================================
// This replaces the Node.js + Express + SQLite backend for the
// phone app. There is no server anymore — everything lives in
// the phone's own storage (IndexedDB, built into every WebView),
// so the app works with zero internet connection and zero PC.
//
// The function names and data shape match the old backend API
// on purpose, so the rest of the app (ItemMaster.jsx, the forms,
// etc.) barely had to change.
// ==========================================================

import { openDB } from 'idb';

const DB_NAME = 'sahayatha_mfg';
const DB_VERSION = 1;
const STORE_ITEMS = 'items';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ITEMS)) {
          const store = db.createObjectStore(STORE_ITEMS, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('item_code', 'item_code', { unique: true });
        }
      },
    });
  }
  return dbPromise;
}

function nowISO() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

// ----------------------------------------------------------
// LIST / SEARCH
// ----------------------------------------------------------
export async function getItems(search = '') {
  const db = await getDB();
  let rows = await db.getAll(STORE_ITEMS);

  if (search && search.trim() !== '') {
    const term = search.trim().toLowerCase();
    rows = rows.filter((r) =>
      [r.item_code, r.item_name, r.category, r.supplier_name, r.location]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  rows.sort((a, b) => a.item_name.localeCompare(b.item_name));
  return { success: true, data: rows };
}

// ----------------------------------------------------------
// CREATE
// ----------------------------------------------------------
export async function createItem(payload) {
  const db = await getDB();

  const item_code = (payload.item_code || '').trim();
  const item_name = (payload.item_name || '').trim();

  if (!item_code || !item_name) {
    throw apiError('Item Code and Item Name are required');
  }

  // enforce unique item_code, same as the old backend
  const existing = await db.getFromIndex(STORE_ITEMS, 'item_code', item_code);
  if (existing) {
    throw apiError(`Item Code "${item_code}" already exists`);
  }

  const opening = Number(payload.opening_stock) || 0;
  const record = {
    item_code,
    item_name,
    category: payload.category || '',
    unit: payload.unit || '',
    opening_stock: opening,
    current_stock: opening,
    minimum_stock: Number(payload.minimum_stock) || 0,
    supplier_name: payload.supplier_name || '',
    location: payload.location || '',
    remarks: payload.remarks || '',
    created_at: nowISO(),
    updated_at: nowISO(),
  };

  const id = await db.add(STORE_ITEMS, record);
  return { success: true, id };
}

// ----------------------------------------------------------
// UPDATE
// ----------------------------------------------------------
export async function updateItem(id, payload) {
  const db = await getDB();
  const numId = Number(id);
  const existing = await db.get(STORE_ITEMS, numId);
  if (!existing) throw apiError('Item not found', 404);

  const item_code = (payload.item_code || '').trim();
  const item_name = (payload.item_name || '').trim();
  if (!item_code || !item_name) {
    throw apiError('Item Code and Item Name are required');
  }

  if (item_code !== existing.item_code) {
    const clash = await db.getFromIndex(STORE_ITEMS, 'item_code', item_code);
    if (clash) throw apiError(`Item Code "${item_code}" already exists`);
  }

  const updated = {
    ...existing,
    item_code,
    item_name,
    category: payload.category || '',
    unit: payload.unit || '',
    minimum_stock: Number(payload.minimum_stock) || 0,
    supplier_name: payload.supplier_name || '',
    location: payload.location || '',
    remarks: payload.remarks || '',
    updated_at: nowISO(),
  };

  await db.put(STORE_ITEMS, updated);
  return { success: true };
}

// ----------------------------------------------------------
// DELETE
// ----------------------------------------------------------
export async function deleteItem(id) {
  const db = await getDB();
  const numId = Number(id);
  const existing = await db.get(STORE_ITEMS, numId);
  if (!existing) throw apiError('Item not found', 404);
  await db.delete(STORE_ITEMS, numId);
  return { success: true };
}

// ----------------------------------------------------------
// helper: shape errors the same way axios errors were shaped,
// so the existing form code (err?.response?.data?.message)
// keeps working without changes.
// ----------------------------------------------------------
function apiError(message, status = 400) {
  const err = new Error(message);
  err.response = { data: { success: false, message }, status };
  return err;
}
