import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. IMPORT ALL PAGES
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Sidebar from './components/Sidebar.jsx';

// Management Modules
import Inventory from './Inventory.jsx';
import AddProduct from './AddProduct.jsx';

// Sales Modules
import Customers from './Customers.jsx'; // <--- This was likely missing or broken
import AddClient from './AddClient.jsx';
import Invoices from './Invoices.jsx';

// Analytics
import Analytics from './Analytics.jsx';

// 2. LAYOUT WRAPPER (Keeps Sidebar on screen)
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === PUBLIC ROUTE === */}
        <Route path="/" element={<Login />} />

        {/* === PROTECTED ROUTES (Inside Layout) === */}
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

        {/* Inventory Management */}
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/add-product" element={<Layout><AddProduct /></Layout>} />

        {/* Customer Management */}
        <Route path="/customers" element={<Layout><Customers /></Layout>} />
        <Route path="/add-client" element={<Layout><AddClient /></Layout>} />

        {/* Sales & Finance */}
        <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
        
        {/* Reports */}
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;