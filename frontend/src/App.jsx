import React from "react";
import { Routes, Route } from "react-router-dom";
import CreatePaste from "./pages/CreatePaste";
import ViewPaste from "./pages/ViewPaste";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePaste />} />
      <Route path="/view/:id" element={<ViewPaste />} />
    </Routes>
  );
}

export default App;
