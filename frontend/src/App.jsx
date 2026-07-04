import Sidebar from './components/Sidebar';
import ItemMaster from './pages/ItemMaster';

// For now we only have one real page (Item Master). As we build
// Modules 2-10, this is where new pages get added and switched.
function App() {
  return (
    <div className="app-shell">
      <Sidebar current="Item Master" />
      <div className="main">
        <ItemMaster />
      </div>
    </div>
  );
}

export default App;
