import React, { useState } from "react";

function TextUpdater() {
  const [text, setText] = useState("");

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 rounded bg-[#dc2626] text-[#f8f8f8] placeholder-gray-300 focus:bg-[#b91c1c] transition-colors"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here"
      />
      <p className="text-black mt-2">You typed: {text}</p>
    </div>
  );
}

export default TextUpdater;
