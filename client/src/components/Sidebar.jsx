import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, Package, Users, 
  FileText, ShoppingCart, LogOut, TrendingUp, Sun, Moon 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // 1. THEME STATE (Default to Dark)
  const [isDark, setIsDark] = useState(true);

  // 2. TOGGLE FUNCTION
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // 3. APPLY THEME TO HTML TAG
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-xl transition-all duration-200 mb-1
      ${isActive(to) 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"}`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </Link>
  );

  return (
    // SIDEBAR BACKGROUND: White in Light Mode, Slate-900 in Dark Mode
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 border-r transition-colors duration-300
                    bg-white border-slate-200 
                    dark:bg-slate-900 dark:border-slate-800">
      
      {/* Brand Header */}
      <div className="h-24 flex items-center px-8 border-b mb-4 transition-colors duration-300
                      border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mr-3 shadow-lg">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider leading-none transition-colors duration-300 text-slate-800 dark:text-white">DECENT</h1>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">Marble</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <p className="px-8 text-xs font-bold uppercase tracking-widest mb-4 transition-colors duration-300 text-slate-400 dark:text-slate-500">Analytics</p>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/analytics" icon={TrendingUp} label="Reports" />

        <p className="px-8 text-xs font-bold uppercase tracking-widest mb-4 mt-8 transition-colors duration-300 text-slate-400 dark:text-slate-500">Management</p>
        <NavItem to="/inventory" icon={Package} label="Stock Inventory" />
        <NavItem to="/add-product" icon={PlusCircle} label="Add Product" />

        <p className="px-8 text-xs font-bold uppercase tracking-widest mb-4 mt-8 transition-colors duration-300 text-slate-400 dark:text-slate-500">Sales</p>
        <NavItem to="/customers" icon={Users} label="Customers" />
        <NavItem to="/invoices" icon={FileText} label="Invoices" />
      </div>

      {/* FOOTER: Logout + Theme Switch */}
      <div className="p-6 border-t transition-colors duration-300 border-slate-200 dark:border-slate-800">
        
        {/* THEME TOGGLE BUTTON */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200
                     bg-slate-100 text-slate-600 hover:bg-slate-200
                     dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition group">
          <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
          <span className="font-medium text-sm">Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;