export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-24 px-6">
      <h1 className="text-5xl font-extrabold">
        Welcome to{" "}
        <span className="text-orange-300 drop-shadow-md">YourCart</span>
      </h1>
      <p className="mt-4 text-lg opacity-90">
        Discover the best products on our site at amazing prices!
      </p>
      <button className="mt-6 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-md transition duration-300">
        Shop Now
      </button>
    </div>
  );
}
