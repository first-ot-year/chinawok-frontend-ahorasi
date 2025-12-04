import React, { useState, useEffect, useRef } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageToS3,
  type Product,
} from "../features/auth/api";

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      // ✅ El API devuelve { success: true, data: [...], count: N }
      const productsArray = response?.data || [];
      setProducts(productsArray);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (product_id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await deleteProduct(product_id);
      alert("Producto eliminado correctamente");
      loadProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto");
    }
  };

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administración de Productos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona el catálogo de productos de China Wok
              </p>
            </div>
            <button
              onClick={handleCreateProduct}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <p className="text-sm text-gray-600">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <p className="text-sm text-gray-600">Disponibles</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.available).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <p className="text-sm text-gray-600">No Disponibles</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => !p.available).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <p className="text-sm text-gray-600">Categorías</p>
            <p className="text-2xl font-bold text-blue-600">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat} ({products.filter((p) => p.category === cat).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            S/ {product.price.toFixed(2)}
                          </p>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                S/ {product.originalPrice.toFixed(2)}
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.available ? "Disponible" : "No disponible"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product.product_id)
                            }
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No hay productos en esta categoría
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
};

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    discount: product?.discount || 0,
    category: product?.category || "",
    tag: product?.tag || "",
    imageUrl: product?.imageUrl || "",
    available: product?.available ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(formData.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Crear preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const publicUrl = await uploadImageToS3(selectedFile);
      setFormData({ ...formData, imageUrl: publicUrl });
      setPreviewUrl(publicUrl);
      alert('Imagen subida correctamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.category) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    if (!formData.imageUrl) {
      alert("Por favor sube una imagen del producto");
      return;
    }

    setLoading(true);

    try {
      if (product) {
        await updateProduct(product.product_id, formData);
        alert("Producto actualizado correctamente");
      } else {
        await createProduct(formData);
        alert("Producto creado correctamente");
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* SUBIDA DE IMAGEN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto *
            </label>
            
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Controles de subida */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  📁 Seleccionar imagen
                </button>

                {selectedFile && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-2">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                    <button
                      onClick={handleUploadImage}
                      disabled={uploading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {uploading ? "Subiendo..." : "☁️ Subir a S3"}
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, WEBP. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Ej: Chaufa Especial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe el producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Original (S/)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Ej: promos, platos, bebidas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiqueta (opcional)
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Ej: nuevo, popular, yape"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Producto disponible
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;