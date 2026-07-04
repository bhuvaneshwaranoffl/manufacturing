import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Download, Pencil, Trash2, Boxes } from 'lucide-react';
import { getItems, createItem, updateItem, deleteItem, exportItemsExcel } from '../api/items';
import StockGauge, { StatusPill } from '../components/StockGauge';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ItemMaster() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(null); // null = closed, {} = add, item = edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [banner, setBanner] = useState(null);

  const load = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await getItems(searchTerm);
      setItems(res.data || []);
    } catch (err) {
      setBanner({ type: 'error', text: 'Could not reach the backend. Is the server running on port 5000?' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const handleSave = async (form) => {
    if (modalItem && modalItem.id) {
      await updateItem(modalItem.id, form);
    } else {
      await createItem(form);
    }
    setModalItem(null);
    setShowAddModal(false);
    await load(search);
  };

  const handleDelete = async () => {
    try {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
      await load(search);
    } catch (err) {
      setDeleteTarget(null);
      setBanner({ type: 'error', text: 'Could not delete this item.' });
    }
  };

  const modalOpen = showAddModal || Boolean(modalItem);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="eyebrow">Module 01</div>
          <h1>Item Master</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="content">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Search by code, name, category, supplier, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-secondary" onClick={exportItemsExcel}>
              <Download size={15} /> Export Excel
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th>Supplier</th>
                  <th>Location</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="loading-row"><td colSpan={8}>Loading items…</td></tr>
                )}

                {!loading && items.length === 0 && (
                  <tr><td colSpan={8}>
                    <div className="empty-state">
                      <Boxes size={28} style={{ marginBottom: 10, color: 'var(--muted-2)' }} />
                      <h3>{search ? 'No items match your search' : 'No items yet'}</h3>
                      <p>{search ? 'Try a different search term.' : 'Add your first item to start building your inventory.'}</p>
                      {!search && (
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                          <Plus size={16} /> Add Item
                        </button>
                      )}
                    </div>
                  </td></tr>
                )}

                {!loading && items.map((it) => (
                  <tr key={it.id}>
                    <td className="item-name-cell">
                      <div className="name">{it.item_name}</div>
                      <div className="code">{it.item_code}</div>
                    </td>
                    <td>{it.category ? <span className="tag">{it.category}</span> : <span className="cell-muted">—</span>}</td>
                    <td className="cell-mono">{it.unit || '—'}</td>
                    <td><StockGauge current={it.current_stock} minimum={it.minimum_stock} unit={it.unit} /></td>
                    <td><StatusPill current={it.current_stock} minimum={it.minimum_stock} /></td>
                    <td>{it.supplier_name || <span className="cell-muted">—</span>}</td>
                    <td>{it.location || <span className="cell-muted">—</span>}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="Edit" onClick={() => setModalItem(it)}>
                          <Pencil size={14} />
                        </button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setDeleteTarget(it)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && items.length > 0 && (
          <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted)' }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {modalOpen && (
        <ItemFormModal
          item={modalItem}
          onClose={() => { setModalItem(null); setShowAddModal(false); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this item?"
          message={`"${deleteTarget.item_name}" (${deleteTarget.item_code}) will be permanently removed. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
