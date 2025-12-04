import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, type Product as ApiProduct } from "../features/auth/api";
import { useCart } from "../features/auth/useCart";
import { useSession } from "../features/auth/useSession";

const HomeDashboard: React.FC = () => {
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      const allProducts = Array.isArray(data) ? data : (data.products || data.data || []);
      const available = allProducts.filter((p: ApiProduct) => p.available);
      
      const half = Math.ceil(available.length / 2);
      setRecommended(available.slice(0, half));
      setBestSellers(available.slice(half));
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setRecommended([]);
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* BARRA DIRECCIÓN con animación */}
      <div className="w-full bg-white shadow-md animate-[slide-down_0.5s_ease-out]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600 text-lg animate-pulse">
              📍
            </span>
            ¡Comienza tu pedido! Elige tu dirección
          </button>
        </div>
      </div>

      {/* BARRA ROJA PROMO con efecto de brillo */}
      <div className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-center text-sm text-white font-bold py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_ease-in-out_infinite]"></div>
        <span className="relative z-10">
          🔥 ENVÍO GRATIS DE LUNES A JUEVES por compras mayores a S/24.90 | EXCLUSIVO POR WEB 🔥
        </span>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        {/* HERO PRINCIPAL con animación mejorada */}
        <section className="bg-white animate-[fade-in_0.8s_ease-out]">
          <div className="max-w-6xl mx-auto px-4 md:px-0 py-8">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[360px] shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col justify-center px-10 py-12 text-white">
                <div className="border-4 border-yellow-400 px-8 py-5 inline-block mb-6 transform hover:rotate-2 transition-transform animate-[bounce-in_1s_ease-out]">
                  <div className="text-4xl md:text-5xl font-extrabold tracking-wide text-yellow-300">
                    CHINA WEEK
                  </div>
                </div>
                <p className="uppercase text-sm tracking-widest mb-2 font-bold">✨ VÁLIDO EN:</p>
                <p className="text-base mb-6 font-semibold">🏪 SALÓN | 🌐 CHINAWOK.COM.PE | 📞 (+51) 940-433-950</p>
                <button className="mt-4 inline-flex items-center justify-center bg-yellow-400 text-red-700 px-8 py-4 rounded-full font-bold text-base hover:bg-yellow-300 shadow-xl transform hover:scale-110 hover:-rotate-2 transition-all">
                  🛒 Comprar Ahora
                </button>
              </div>

              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-red-600/40 to-transparent z-0" />
                <div className="relative z-10 h-full grid grid-cols-2 gap-3 p-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform animate-[fade-in_1s_ease-out_0.2s_both]">
                    <img
                      src="https://images.pexels.com/photos/4194621/pexels-photo-4194621.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Plato principal"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl overflow-hidden flex-1 shadow-xl transform hover:scale-105 transition-transform animate-[fade-in_1s_ease-out_0.4s_both]">
                      <img
                        src="https://images.pexels.com/photos/4194613/pexels-photo-4194613.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Acompañamiento"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden flex-1 shadow-xl transform hover:scale-105 transition-transform animate-[fade-in_1s_ease-out_0.6s_both]">
                      <img
                        src="https://images.pexels.com/photos/4194620/pexels-photo-4194620.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Bebida"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMENDADOS */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 animate-[fade-in_1s_ease-out]">
          <div className="max-w-6xl mx-auto px-4 md:px-0">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl animate-bounce">⭐</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-800">
                RECOMENDADOS PARA TI
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-red-500 to-transparent rounded"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 absolute top-0 left-0"></div>
                </div>
              </div>
            ) : recommended.length > 0 ? (
              <div className="overflow-x-auto pb-6">
                <div className="flex gap-5 min-w-max">
                  {recommended.map((p, idx) => (
                    <div
                      key={p.product_id}
                      className="animate-[slide-up_0.6s_ease-out]"
                      style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12 text-lg">
                No hay productos disponibles en este momento 😢
              </p>
            )}
          </div>
        </section>

        {/* LOS MÁS VENDIDOS */}
        <section className="bg-white py-12 animate-[fade-in_1s_ease-out]">
          <div className="max-w-6xl mx-auto px-4 md:px-0">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl animate-pulse">🔥</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-800">
                LOS MÁS VENDIDOS
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-red-500 to-transparent rounded"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 absolute top-0 left-0"></div>
                </div>
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="overflow-x-auto pb-6">
                <div className="flex gap-5 min-w-max">
                  {bestSellers.map((p, idx) => (
                    <div
                      key={p.product_id}
                      className="animate-[slide-up_0.6s_ease-out]"
                      style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12 text-lg">
                No hay productos disponibles en este momento 😢
              </p>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER mejorado */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10 text-sm">
          <div className="space-y-3">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-widest text-yellow-400 flex items-center gap-2">
              <span>ℹ️</span> SOBRE NOSOTROS
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Nosotros</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Términos y Condiciones</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Políticas de Privacidad</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Libro de Reclamaciones</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Trabaja con nosotros</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-widest text-yellow-400 flex items-center gap-2">
              <span>🤝</span> SERVICIO AL CLIENTE
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Locales</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Zona de Reparto</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Contáctanos</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Preguntas Frecuentes</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">→ Comprobantes Electrónicos</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-widest text-yellow-400 flex items-center gap-2">
              <span>📱</span> SÍGUENOS
            </h3>
            <div className="flex gap-4 text-2xl">
              <span className="hover:scale-125 transition-transform cursor-pointer">📘</span>
              <span className="hover:scale-125 transition-transform cursor-pointer">📷</span>
              <span className="hover:scale-125 transition-transform cursor-pointer">▶️</span>
              <span className="hover:scale-125 transition-transform cursor-pointer">🐦</span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-widest text-yellow-400 flex items-center gap-2">
              <span>✉️</span> SUSCRÍBETE
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Entérate de nuestras promociones y noticias.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2.5 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 rounded-lg text-sm font-bold hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all shadow-lg">
                Enviar
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} China Wok (clone demo). Todos los derechos reservados. Made with ❤️
        </div>
      </footer>

      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// ========== PRODUCT CARD mejorado ==========
type ProductCardProps = {
  product: ApiProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.product.product_id === product.product_id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (quantity === 0) {
      addItem(product);
    } else {
      updateQuantity(product.product_id, quantity + 1);
    }
  };

  const handleRemove = () => {
    updateQuantity(product.product_id, quantity - 1);
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 w-72 flex-shrink-0 overflow-hidden flex flex-col hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={product.imageUrl || "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
            ✨ {product.tag}
          </span>
        )}
        <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 flex items-center justify-center text-lg hover:bg-red-50 hover:text-red-600 transition-colors shadow-md">
          ♡
        </button>
      </div>
      <div className="px-5 py-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
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
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              )}
              <div className="text-xl font-bold text-red-600">
                S/ {product.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:from-red-700 hover:to-red-600 transition-all shadow-md transform hover:scale-105"
            >
              🛒 Agregar
            </button>
          ) : (
            <div className="flex items-center justify-between bg-red-50 border-2 border-red-600 rounded-xl p-2">
              <button
                onClick={handleRemove}
                className="h-8 w-8 rounded-full bg-white border-2 border-red-600 text-red-600 flex items-center justify-center font-bold hover:bg-red-600 hover:text-white transition-all"
              >
                −
              </button>
              <span className="font-bold text-red-600 text-base">{quantity}</span>
              <button
                onClick={handleAdd}
                className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 transition-all shadow-md"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default HomeDashboard;