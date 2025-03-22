export default function ProductCard({ product, onSelect }) {
  return (
    <div
      className="border bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300"
      onClick={() => onSelect(product)}
    >
      <div className="h-48 w-full flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full w-auto object-contain rounded-md"
        />
      </div>
      <h2 className="text-lg font-semibold mt-3 text-gray-800">{product.name}</h2>
      <p className="text-gray-600 mt-1 font-medium">${product.price}</p>
    </div>
  );
}
