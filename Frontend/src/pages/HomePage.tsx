import React, { useState, useEffect } from "react";
import { getProducts, type Product as ApiProduct } from "../features/auth/api";

const HomeDashboard: React.FC = () => {
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      
      // La API puede devolver { products: [...] } o directamente [...]
      const allProducts = Array.isArray(data) ? data : (data.products || data.data || []);
      
      console.log("Productos recibidos:", allProducts);
      
      // Filtrar productos disponibles
      const available = allProducts.filter((p: ApiProduct) => p.available);
      
      // Dividir en recomendados y más vendidos (simulado)
      const half = Math.ceil(available.length / 2);
      setRecommended(available.slice(0, half));
      setBestSellers(available.slice(half));
    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Establecer arrays vacíos en caso de error
      setRecommended([]);
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* BARRA DIRECCIÓN */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600 text-xs">
              📍
            </span>
            ¡Comienza tu pedido! Elige tu dirección
          </button>
        </div>
      </div>

      {/* BARRA ROJA PROMO */}
      <div className="w-full bg-red-600 text-center text-xs md:text-sm text-white font-semibold py-2">
        ENVÍO GRATIS DE LUNES A JUEVES por compras mayores a S/24.90 | EXCLUSIVO POR WEB
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        {/* HERO PRINCIPAL */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-0 py-8">
            <div className="bg-red-600 rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[320px]">
              {/* Lado texto */}
              <div className="flex flex-col justify-center px-8 py-10 text-white">
                <div className="border-4 border-white px-6 py-4 inline-block mb-6">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-wide">
                    CHINA WEEK
                  </div>
                </div>
                <p className="uppercase text-xs tracking-widest mb-2">
                  VÁLIDO EN:
                </p>
                <p className="text-sm mb-4">
                  SALÓN | CHINAWOK.COM.PE | (01) 612-8000
                </p>
                <button className="mt-4 inline-flex items-center justify-center bg-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-900">
                  Comprar
                </button>
              </div>

              {/* Lado imágenes */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-l from-red-600/40 to-transparent z-0" />
                <div className="relative z-10 h-full grid grid-cols-2 gap-2 p-4">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/4194621/pexels-photo-4194621.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Plato principal"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-2xl overflow-hidden flex-1">
                      <img
                        src="https://images.pexels.com/photos/4194613/pexels-photo-4194613.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Acompañamiento"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden flex-1">
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
        <section className="bg-gray-50 py-10">
          <div className="max-w-6xl mx-auto px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-wide mb-6">
              RECOMENDADOS PARA TI
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              </div>
            ) : recommended.length > 0 ? (
              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {recommended.map((p) => (
                      <ProductCard key={p.product_id} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">
                No hay productos disponibles en este momento
              </p>
            )}
          </div>
        </section>

        {/* OTRAS PROMOS / MÁS VENDIDOS */}
        <section className="bg-white py-10">
          <div className="max-w-6xl mx-auto px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-wide mb-6">
              LOS MÁS VENDIDOS
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {bestSellers.map((p) => (
                    <ProductCard key={p.product_id} product={p} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">
                No hay productos disponibles en este momento
              </p>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white mt-8">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-3 uppercase text-xs tracking-widest">
              SOBRE NOSOTROS
            </h3>
            <ul className="space-y-1 text-gray-300">
              <li>Nosotros</li>
              <li>Términos y Condiciones</li>
              <li>Políticas de Privacidad</li>
              <li>Libro de Reclamaciones</li>
              <li>Trabaja con nosotros</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 uppercase text-xs tracking-widest">
              SERVICIO AL CLIENTE
            </h3>
            <ul className="space-y-1 text-gray-300">
              <li>Locales</li>
              <li>Zona de Reparto</li>
              <li>Contáctanos</li>
              <li>Preguntas Frecuentes</li>
              <li>Comprobantes Electrónicos</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 uppercase text-xs tracking-widest">
              SÍGUENOS
            </h3>
            <div className="flex gap-3 text-lg">
              <span>📘</span>
              <span>📷</span>
              <span>▶️</span>
              <span>🐦</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 uppercase text-xs tracking-widest">
              SUSCRÍBETE
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Entérate de nuestras promociones y noticias.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-3 py-2 rounded-md text-black text-sm"
              />
              <button className="bg-red-600 px-4 py-2 rounded-md text-sm font-semibold">
                Enviar
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} China Wok (clone demo). Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

type ProductCardProps = {
  product: ApiProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => setQuantity((prev) => prev + 1);
  const handleRemove = () => setQuantity((prev) => Math.max(0, prev - 1));

  return (
    <article className="bg-white rounded-3xl shadow-sm border border-gray-100 w-64 flex-shrink-0 overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
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
        <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center text-sm">
          ♡
        </button>
      </div>
      <div className="px-4 py-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-2">
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
              <div className="text-base font-bold">
                S/ {product.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-600 rounded-lg p-1.5">
              <button
                onClick={handleRemove}
                className="h-7 w-7 rounded-full bg-white border border-green-600 text-green-600 flex items-center justify-center font-bold hover:bg-green-600 hover:text-white transition-colors"
              >
                −
              </button>
              <span className="font-semibold text-green-600 text-sm">{quantity}</span>
              <button
                onClick={handleAdd}
                className="h-7 w-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold hover:bg-green-700 transition-colors"
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