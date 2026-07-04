import { useState } from 'react';
import { X } from 'lucide-react';

const UNITS = ['Nos', 'Meter', 'Kg', 'Litre', 'Box', 'Roll', 'Set', 'Pair'];

const emptyForm = {
  item_code: '', item_name: '', category: '', unit: 'Nos',
  opening_stock: '', minimum_stock: '', supplier_name: '', location: '', remarks: ''
};

export default function ItemFormModal({ item, onClose, onSave }) {
  const isEdit = Boolean(item);
  const [form, setForm] = useState(
    item
      ? {
          item_code: item.item_code, item_name: item.item_name, category: item.category || '',
          unit: item.unit || 'Nos', opening_stock: item.opening_stock, minimum_stock: item.minimum_stock,
          supplier_name: item.supplier_name || '', location: item.location || '', remarks: item.remarks || ''
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.item_code.trim() || !form.item_name.trim()) {
      setError('Item Code and Item Name are required.');
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Item' : 'Add New Item'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-grid">
              <div className="form-field">
                <label>Item Code <span className="required">*</span></label>
                <input value={form.item_code} onChange={set('item_code')} placeholder="e.g. BAT-001" autoFocus />
              </div>
              <div className="form-field">
                <label>Item Name <span className="required">*</span></label>
                <input value={form.item_name} onChange={set('item_name')} placeholder="e.g. Battery 12V" />
              </div>

              <div className="form-field">
                <label>Category</label>
                <input value={form.category} onChange={set('category')} placeholder="e.g. Electrical" />
              </div>
              <div className="form-field">
                <label>Unit</label>
                <select value={form.unit} onChange={set('unit')}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label>Opening Stock</label>
                <input
                  type="number" min="0" step="any"
                  value={form.opening_stock} onChange={set('opening_stock')}
                  placeholder="0" disabled={isEdit}
                />
                {isEdit && <span className="form-hint">Use Stock In (Module 3) to change stock later.</span>}
              </div>
              <div className="form-field">
                <label>Minimum Stock</label>
                <input
                  type="number" min="0" step="any"
                  value={form.minimum_stock} onChange={set('minimum_stock')} placeholder="0"
                />
              </div>

              <div className="form-field">
                <label>Supplier Name</label>
                <input value={form.supplier_name} onChange={set('supplier_name')} placeholder="e.g. ABC Supplies" />
              </div>
              <div className="form-field">
                <label>Location</label>
                <input value={form.location} onChange={set('location')} placeholder="e.g. Rack A1" />
              </div>

              <div className="form-field full">
                <label>Remarks</label>
                <textarea value={form.remarks} onChange={set('remarks')} placeholder="Optional notes" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
