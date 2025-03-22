import { useState } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import ProductList from "./components/productList";
import ProductDetails from "./pages/productDetails";
import Footer from "./components/footer";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      <Navbar />
      <Hero />
      {selectedProduct ? (
        <ProductDetails product={selectedProduct} />
      ) : (
        <ProductList onSelect={setSelectedProduct} />
      )}
      <Footer />
    </div>
  );
}

export default App;
