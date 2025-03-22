import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TextUpdater from "./TextUpdater.jsx";
import SimpleForm from "./SimpleForm.jsx";
import UserCard from "./UserCard.jsx";
import CustomButton from "./CustomButton.jsx";
import LoginForm from "./LoginForm.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("textUpdater");

  const renderPage = () => {
    switch (currentPage) {
      case "textUpdater":
        return <TextUpdater />;
      case "simpleForm":
        return <SimpleForm />;
      case "userCard":
        return (
          <UserCard
            name="Ritvik Kumar"
            email="ritvikkumar2022@vitbhopal.ac.in"
          />
        );
      case "customButton":
        return <CustomButton />;
      case "loginForm":
        return <LoginForm />;
      default:
        return <TextUpdater />;
    }
  };

  return (
    <StrictMode>
      <div className="bg-[#f0f4f8] w-full h-screen absolute top-0 left-0">
        <button
          className="bg-[#008080] text-[#f8f8f8] p-2 rounded hover:bg-[#005f5f] m-5 transition-all"
          onClick={() => setCurrentPage("textUpdater")}
        >
          TextUpdater
        </button>
        <button
          className="bg-[#008080] text-[#f8f8f8] p-2 rounded hover:bg-[#005f5f] m-5 transition-all"
          onClick={() => setCurrentPage("simpleForm")}
        >
          SimpleForm
        </button>
        <button
          className="bg-[#008080] text-[#f8f8f8] p-2 rounded hover:bg-[#005f5f] m-5 transition-all"
          onClick={() => setCurrentPage("userCard")}
        >
          UserCard
        </button>
        <button
          className="bg-[#008080] text-[#f8f8f8] p-2 rounded hover:bg-[#005f5f] m-5 transition-all"
          onClick={() => setCurrentPage("customButton")}
        >
          CustomButton
        </button>
        <button
          className="bg-[#008080] text-[#f8f8f8] p-2 rounded hover:bg-[#005f5f] m-5 transition-all"
          onClick={() => setCurrentPage("loginForm")}
        >
          LoginForm
        </button>
        {renderPage()}
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
