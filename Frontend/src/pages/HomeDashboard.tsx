import React from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  tag?: string;
  imageUrl: string;
};

const recommended: Product[] = [
  {
    id: "1",
    name: "Promo Dúo Sopa al Wok",
    description:
      "2 encajate a elección y 2 sopas wantán personales.",
    price: 29.9,
    originalPrice: 71.6,
    discount: 58,
    imageUrl:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    name: "Dúo Encájate",
    description:
      "Caja con fideos salteados, pollo y verduras salteadas al wok.",
    price: 29.9,
    discount: 33,
    tag: "yape",
    imageUrl:
      "https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    name: "Dúo Clásico al Wok",
    description:
      "Arroz chaufa individual y tallarín taypá acompañados de wantanes.",
    price: 23.9,
    discount: 46,
    originalPrice: 44.6,
    imageUrl:
      "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "4",
    name: "Dúo Encajate al Wok",
    description:
      "2 encajate a elección y 4 wantanes personales.",
    price: 29.9,
    discount: 43,
    originalPrice: 52.5,
    imageUrl:
      "https://images.pexels.com/photos/4194622/pexels-photo-4194622.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const bestSellers: Product[] = [
  {
    id: "5",
    name: "Promo Combinados",
    description: "2 combinados taypá + 2 wantanes.",
    price: 24.9,
    discount: 45,
    originalPrice: 45.9,
    imageUrl:
      "https://images.pexels.com/photos/4194610/pexels-photo-4194610.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "6",
    name: "ChinaWeek para Dos",
    description: "2 encajate a elección + 2 gaseosas personales.",
    price: 22.9,
    discount: 40,
    originalPrice: 38.5,
    imageUrl:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "7",
    name: "ChinaWeek Sabor al Wok",
    description: "2 sabores al wok a elección.",
    price: 29.9,
    discount: 40,
    originalPrice: 49.9,
    imageUrl:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "8",
    name: "ChinaWeek Trío Encájate",
    description: "3 encajate a elección + 1 gaseosa de 1L.",
    price: 32.9,
    discount: 40,
    originalPrice: 54.9,
    imageUrl:
      "https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const HomeDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded-md flex items-center justify-center text-sm font-semibold">
              China Wok
            </div>
          </div>

          {/* Menú principal */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <button className="hover:text-red-600">Menú</button>
            <button className="hover:text-red-600">Promos exclusivas</button>
            <button className="hover:text-red-600">Locales</button>
            <button className="hover:text-red-600">Buscar</button>
          </nav>

          {/* Lado derecho */}
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-gray-500">Llámanos</span>
              <span className="text-green-600 font-semibold">
                01 - 612 - 8000
              </span>
            </div>
            <div className="flex flex-col text-right leading-tight">
              <span className="text-gray-500 text-xs">Hola,</span>
              <button className="text-green-600 font-semibold text-xs md:text-sm hover:underline">
                INICIAR SESIÓN
              </button>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white rounded-full px-4 py-2 text-xs md:text-sm font-semibold">
              <span>S/ 0.00</span>
            </button>
          </div>
        </div>
      </header>

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

            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {recommended.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OTRAS PROMOS / MÁS VENDIDOS */}
        <section className="bg-white py-10">
          <div className="max-w-6xl mx-auto px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-wide mb-6">
              LOS MÁS VENDIDOS
            </h2>

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
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
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="bg-white rounded-3xl shadow-sm border border-gray-100 w-64 flex-shrink-0 overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
        <img
          src={product.imageUrl}
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
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.originalPrice && (
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
          <button className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
            +
          </button>
        </div>
      </div>
    </article>
  );
};

export default HomeDashboard;