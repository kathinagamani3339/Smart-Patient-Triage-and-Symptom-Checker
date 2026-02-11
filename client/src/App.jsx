import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/DashboardLayout";
import SymptomsEntry from "./components/SymptomsEntry";
import TriageResult from "./components/TriageResult";
import ProviderMap from "./components/ProviderMap";

//public routes
const PublicRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/symptomsentry" replace /> : <Outlet />;
};

//protected routes
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/symptomsentry" element={<SymptomsEntry />} />
            <Route path="/triageresult" element={<TriageResult />} />
            <Route path="/providermap" element={<ProviderMap />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
