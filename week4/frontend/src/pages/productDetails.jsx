export default function ProductDetails({ product }) {
  if (!product) return <p>No product selected</p>;

  return (
    <div className="p-4">
      <img
        src={product.image}
        alt={product.name}
        className="h-100 w-100 object-cover rounded"
      />
      <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
      <p className="text-gray-700 mt-2 mb-3">Price: ${product.price}</p>
      <p>{product.desc}</p>
    </div>
  );
}
