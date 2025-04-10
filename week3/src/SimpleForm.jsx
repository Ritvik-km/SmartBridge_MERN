import React, { useState } from "react";

function SimpleForm() {
  const [a, setA] = useState("");

  const submit = (e) => {
    e.preventDefault();
    console.log("Submitted Value:", a);
  };

  return (
    <form onSubmit={submit} className="p-4">
      <input
        type="text"
        className="border p-2 rounded mr-2"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <button type="submit" className="bg-lime-500 text-white p-2 rounded-md hover:bg-lime-700 transition">
        Submit
      </button>
    </form>
  );
}

export default SimpleForm;
