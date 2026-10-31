import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); 

  const fetchProducts = () => {
    axios.get('http://localhost:3001/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      axios.delete(`http://localhost:3001/delete-product/${id}`)
        .then(() => fetchProducts());
    }
  };

  const handleUpdate = () => {
    axios.put('http://localhost:3001/update-product', editingProduct)
      .then(() => {
        alert("✅ Updated!");
        setEditingProduct(null); 
        fetchProducts();
      });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    // MAIN BG: Adapts to Light/Dark
    <div className="p-8 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Stock Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your marble slabs and pricing.</p>
        </div>
        <button onClick={() => navigate('/add-product')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl shadow-sm border mb-8 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 transition-colors">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl font-medium outline-none transition
                       bg-slate-50 border-transparent text-slate-700 focus:ring-2 focus:ring-blue-500
                       dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 group
                                           bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img 
                src={product.image_url || "https://via.placeholder.com/400"} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${product.stock > 20 ? 'bg-green-100 text-green-700 dark:bg-emerald-500 dark:text-white' : 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-white'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-2">
                 <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">{product.category}</p>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">{product.name}</h3>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Price</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Stock</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{product.stock}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                 <button onClick={() => setEditingProduct(product)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20">
                    <Edit size={16} /> Edit
                 </button>
                 <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg transition bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL (Dark Mode Ready) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="p-8 rounded-2xl w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]
                          bg-white dark:bg-slate-800 border dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Inputs adapt to theme */}
              {['name', 'price', 'stock'].map((field) => (
                <div key={field}>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">{field}</label>
                  <input 
                    type={field === 'name' ? 'text' : 'number'}
                    className="w-full p-3 rounded-lg font-bold outline-none border transition-colors
                               bg-slate-50 border-slate-200 text-slate-700 focus:border-blue-500
                               dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-blue-500"
                    value={editingProduct[field]}
                    onChange={(e) => setEditingProduct({...editingProduct, [field]: e.target.value})}
                  />
                </div>
              ))}
              <button onClick={handleUpdate} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 mt-4">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;