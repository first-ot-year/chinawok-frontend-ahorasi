import React, { useState, useEffect } from "react";
import { getProducts, type Product } from "../features/auth/api";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["all", "promos", "platos", "bebidas", "postres"];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = selectedCategory === "all" ? undefined : selectedCategory;
      const data = await getProducts(category);
      
      setProducts(data);
    } catch (err) {
      setError("Error al cargar los productos. Por favor, intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded-md flex items-center justify-center text-sm font-semibold">
              China Wok
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <button className="hover:text-red-600">Menú</button>
            <button className="hover:text-red-600">Promos exclusivas</button>
            <button className="hover:text-red-600">Locales</button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-green-600 text-white rounded-full px-4 py-2 text-sm font-semibold">
              <span>S/ 0.00</span>
            </button>
          </div>
        </div>
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Filtro de categorías */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Nuestros Productos
          </h1>
          <span className="text-sm text-gray-600">
            {filteredProducts.length} productos encontrados
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* PRODUCTOS GRID */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleRemoveFromCart = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={product.imageUrl || "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        
        {product.tag && (
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {product.tag}
          </span>
        )}

        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
              No disponible
            </span>
          </div>
        )}

        <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-base hover:bg-white transition-colors">
          ♡
        </button>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-base mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs line-through text-gray-400">
                    S/ {product.originalPrice.toFixed(2)}
                  </span>
                  {product.discount && (
                    <span className="bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              )}
              <div className="text-lg font-bold text-gray-900">
                S/ {product.price.toFixed(2)}
              </div>
            </div>
          </div>

          {product.available ? (
            quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Agregar al carrito
              </button>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-600 rounded-lg p-2">
                <button
                  onClick={handleRemoveFromCart}
                  className="h-8 w-8 rounded-full bg-white border border-green-600 text-green-600 flex items-center justify-center font-bold hover:bg-green-600 hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="font-semibold text-green-600">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            )
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed"
            >
              No disponible
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductsPage;