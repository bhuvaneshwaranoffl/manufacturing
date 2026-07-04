// ==========================================================
// ITEMS API  (Mobile / Offline version)
// ==========================================================
// Same function names as the version that used to talk to the
// Node backend, but now everything reads/writes the phone's own
// local database. Nothing here needs internet or a PC.
// ==========================================================

import * as localDb from '../db/localDb';
import * as XLSX from 'xlsx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const getItems = (search = '') => localDb.getItems(search);
export const createItem = (payload) => localDb.createItem(payload);
export const updateItem = (id, payload) => localDb.updateItem(id, payload);
export const deleteItem = (id) => localDb.deleteItem(id);

// ----------------------------------------------------------
// EXPORT EXCEL
// ----------------------------------------------------------
// Builds the .xlsx file entirely on the phone, then:
//  - on Android: saves it to the device and opens the native
//    "Share" sheet so you can save it to Files, WhatsApp, email, etc.
//  - in a regular desktop browser (for testing): triggers a normal download.
// ----------------------------------------------------------
export async function exportItemsExcel() {
  const { data } = await localDb.getItems();

  const excelData = data.map((r) => ({
    'Item Code': r.item_code,
    'Item Name': r.item_name,
    'Category': r.category,
    'Unit': r.unit,
    'Opening Stock': r.opening_stock,
    'Current Stock': r.current_stock,
    'Minimum Stock': r.minimum_stock,
    'Supplier Name': r.supplier_name,
    'Location': r.location,
    'Remarks': r.remarks,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Item Master');

  const fileName = `Item_Master_${new Date().toISOString().slice(0, 10)}.xlsx`;

  if (Capacitor.isNativePlatform()) {
    // Native Android: write the file to the app's cache, then share it.
    const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Cache,
    });

    await Share.share({
      title: 'Item Master Export',
      url: result.uri,
      dialogTitle: 'Save or send Item Master.xlsx',
    });
  } else {
    // Browser (used only while testing on a laptop before building the APK)
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
