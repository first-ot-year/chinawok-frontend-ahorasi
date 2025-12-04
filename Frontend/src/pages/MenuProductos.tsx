import { useState, useEffect } from 'react';
import { getProducts, type Product } from '../features/auth/api';
import { useCart } from '../features/auth/useCart';

export default function MenuProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      // El API devuelve { success: true, data: [...], count: N }
      const productsArray = response?.data || [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProducts([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías únicas
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.available;
  });

  // Emojis por categoría
  const categoryEmojis: Record<string, string> = {
    'all': '🍽️',
    'Entradas': '🥟',
    'Platos principales': '🍜',
    'Sopas': '🍲',
    'Arroz': '🍚',
    'Fideos': '🍝',
    'Pollo': '🍗',
    'Carne': '🥩',
    'Mariscos': '🦐',
    'Vegetariano': '🥗',
    'Postres': '🍨',
    'Bebidas': '🥤'
  };

  const getCategoryEmoji = (category: string) => {
    return categoryEmojis[category] || '🍽️';
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    
    // Animación temporal de "agregado"
    setAddedProducts(prev => new Set(prev).add(product.product_id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.product_id);
        return newSet;
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🥡</div>
            <div className="text-2xl font-bold text-red-600 mb-4">Preparando tu menú...</div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header del menú */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 blur-xl opacity-40"></div>
              <h1 className="relative text-6xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                🍜 Nuestro Menú 🥢
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre los auténticos sabores de la cocina china preparados con ingredientes frescos
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Busca tu platillo favorito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-red-200 focus:border-red-500 focus:outline-none shadow-lg text-lg"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex gap-3 justify-center flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 whitespace-nowrap shadow-md ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200'
                }`}
              >
                <span className="mr-2">{getCategoryEmoji(category)}</span>
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No encontramos platillos</h3>
            <p className="text-xl text-gray-500">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-red-300"
              >
                {/* Imagen */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-red-100 to-yellow-100">
                  <img
                    src={product.imageUrl || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge de descuento */}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                      🔥 -{product.discount}%
                    </div>
                  )}

                  {/* Badge de categoría */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {getCategoryEmoji(product.category)} {product.category}
                  </div>

                  {/* Tag especial */}
                  {product.tag && (
                    <div className="absolute bottom-4 left-4 bg-yellow-400 text-red-700 px-4 py-1 rounded-full font-bold text-xs shadow-lg">
                      ⭐ {product.tag}
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {product.description}
                  </p>

                  {/* Precio */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            S/ {product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-3xl font-bold text-red-600">
                            S/ {product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-red-600">
                          S/ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón agregar */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={addedProducts.has(product.product_id)}
                    className={`w-full py-4 rounded-xl font-bold transform transition-all shadow-lg flex items-center justify-center gap-2 ${
                      addedProducts.has(product.product_id)
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 hover:scale-105'
                    }`}
                  >
                    <span className="text-xl">
                      {addedProducts.has(product.product_id) ? '✓' : '🛒'}
                    </span>
                    <span>
                      {addedProducts.has(product.product_id) ? '¡Agregado!' : 'Agregar al Carrito'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Banner promocional */}
        <div className="mt-16 bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            ¡Delivery Gratis en pedidos mayores a S/ 30!
          </h2>
          <p className="text-xl text-yellow-100 mb-6">
            Llama al <span className="font-bold text-white">01-612-8000</span> o haz tu pedido en línea
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-white font-bold">
              🕐 Lun-Dom: 11:00 AM - 10:00 PM
            </span>
            <span className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-white font-bold">
              ⚡ Entrega en 30-45 min
            </span>
          </div>
        </div>
      </div>

      {/* Patrón decorativo de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-10 text-9xl">🥟</div>
        <div className="absolute top-40 right-20 text-8xl">🍜</div>
        <div className="absolute bottom-40 left-20 text-7xl">🥢</div>
        <div className="absolute bottom-20 right-40 text-9xl">🍚</div>
        <div className="absolute top-1/2 left-1/3 text-6xl">🥡</div>
      </div>
    </div>
  );
}