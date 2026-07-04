// ==========================================================
// ITEM MASTER ROUTES  (Module 1)
// ==========================================================
// This file defines all the API "endpoints" (URLs) the React
// frontend will call to Add / Edit / Delete / Search / Export items.
//
// Base URL for everything here: http://localhost:5000/api/items
// ==========================================================

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const XLSX = require('xlsx');

// ----------------------------------------------------------
// GET /api/items            -> list all items (supports ?search=)
// ----------------------------------------------------------
router.get('/', (req, res) => {
  try {
    const { search } = req.query;
    let rows;

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      const stmt = db.prepare(`
        SELECT * FROM items
        WHERE item_code LIKE ? OR item_name LIKE ? OR category LIKE ?
           OR supplier_name LIKE ? OR location LIKE ?
        ORDER BY item_name ASC
      `);
      rows = stmt.all(term, term, term, term, term);
    } else {
      const stmt = db.prepare('SELECT * FROM items ORDER BY item_name ASC');
      rows = stmt.all();
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------
// GET /api/items/:id        -> get one item
// ----------------------------------------------------------
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------
// POST /api/items           -> add new item
// ----------------------------------------------------------
router.post('/', (req, res) => {
  try {
    const {
      item_code, item_name, category, unit,
      opening_stock, minimum_stock, supplier_name, location, remarks
    } = req.body;

    if (!item_code || !item_name) {
      return res.status(400).json({ success: false, message: 'Item Code and Item Name are required' });
    }

    const opening = Number(opening_stock) || 0;

    const stmt = db.prepare(`
      INSERT INTO items
        (item_code, item_name, category, unit, opening_stock, current_stock, minimum_stock, supplier_name, location, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      item_code.trim(),
      item_name.trim(),
      category || '',
      unit || '',
      opening,
      opening, // current_stock starts equal to opening_stock
      Number(minimum_stock) || 0,
      supplier_name || '',
      location || '',
      remarks || ''
    );

    res.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(400).json({ success: false, message: `Item Code "${req.body.item_code}" already exists` });
    }
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------
// PUT /api/items/:id        -> edit existing item
// ----------------------------------------------------------
router.put('/:id', (req, res) => {
  try {
    const {
      item_code, item_name, category, unit,
      minimum_stock, supplier_name, location, remarks
    } = req.body;

    if (!item_code || !item_name) {
      return res.status(400).json({ success: false, message: 'Item Code and Item Name are required' });
    }

    const stmt = db.prepare(`
      UPDATE items SET
        item_code = ?, item_name = ?, category = ?, unit = ?,
        minimum_stock = ?, supplier_name = ?, location = ?, remarks = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(
      item_code.trim(),
      item_name.trim(),
      category || '',
      unit || '',
      Number(minimum_stock) || 0,
      supplier_name || '',
      location || '',
      remarks || '',
      req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(400).json({ success: false, message: `Item Code "${req.body.item_code}" already exists` });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------
// DELETE /api/items/:id     -> delete item
// ----------------------------------------------------------
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------
// GET /api/items/export/excel   -> download all items as .xlsx
// ----------------------------------------------------------
router.get('/export/excel', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM items ORDER BY item_name ASC');
    const rows = stmt.all();

    const excelData = rows.map(r => ({
      'Item Code': r.item_code,
      'Item Name': r.item_name,
      'Category': r.category,
      'Unit': r.unit,
      'Opening Stock': r.opening_stock,
      'Current Stock': r.current_stock,
      'Minimum Stock': r.minimum_stock,
      'Supplier Name': r.supplier_name,
      'Location': r.location,
      'Remarks': r.remarks
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Item Master');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=Item_Master.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
