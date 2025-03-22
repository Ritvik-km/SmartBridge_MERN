import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">YourCart</h1>
        <ul className="md:flex">
          <li className="text-white p-2 mr-6 cursor-pointer">
            <a href="">Home</a>
          </li>
          <li className="text-white p-2 mr-6 cursor-pointer">Products</li>
          <li className="text-white p-2 mr-6 cursor-pointer">Contact</li>
        </ul>
      </div>
    </nav>
  );
}
