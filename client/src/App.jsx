import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react'
import Login from "./components/Login";
import Register from "./components/Register";
import SymptomsEntry from "./components/SymptomsEntry";
import ProviderMap from "./components/ProviderMap";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/symptomsentry" element={<SymptomsEntry />} />
        <Route path="/providermap" element={<ProviderMap />} />
      </Routes>
    </Router>
  );
};

export default App
