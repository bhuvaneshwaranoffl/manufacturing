import {
  Boxes, Layers, PackagePlus, Cog, Gauge,
  BellRing, History, FileBarChart, LayoutDashboard, Users
} from 'lucide-react';

// Every module from the project brief. Only the ones marked
// "active: true" are clickable right now — the rest light up
// as we build them module by module.
const MODULES = [
  { num: '01', label: 'Item Master', icon: Boxes, active: true },
  { num: '02', label: 'Product / BOM', icon: Layers, active: false },
  { num: '03', label: 'Stock In', icon: PackagePlus, active: false },
  { num: '04', label: 'Production', icon: Cog, active: false },
  { num: '05', label: 'Live Stock', icon: Gauge, active: false },
  { num: '06', label: 'Low Stock Alerts', icon: BellRing, active: false },
  { num: '07', label: 'Stock History', icon: History, active: false },
  { num: '08', label: 'Reports', icon: FileBarChart, active: false },
  { num: '09', label: 'Dashboard', icon: LayoutDashboard, active: false },
  { num: '10', label: 'Users', icon: Users, active: false },
];

export default function Sidebar({ current }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">SM</div>
        <div className="sidebar-brand-text">
          <div className="name">Sahayatha MFG</div>
          <div className="sub">Inventory &amp; BOM</div>
        </div>
      </div>

      <div className="sidebar-section-label">Modules</div>

      {MODULES.map((m) => {
        const Icon = m.icon;
        const isActive = m.label === current;
        return (
          <button
            key={m.num}
            className={`nav-item ${isActive ? 'active' : ''} ${!m.active ? 'disabled' : ''}`}
            disabled={!m.active}
            title={m.active ? m.label : `${m.label} — coming soon`}
          >
            <span className="num">{m.num}</span>
            <Icon size={15} />
            {m.label}
          </button>
        );
      })}

      <div className="sidebar-footer">
        Module 1 of 10 live<br />
        Build in progress
      </div>
    </aside>
  );
}
