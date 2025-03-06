import React, { useState, useEffect } from "react";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Winner from "./pages/Winner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { contractAbi, contractAddress } from "./utils/constants";
import { EthersProvider } from "./context/EthersProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { ConfirmProvider } from "material-ui-confirm";

function App() {
  return (
    <EthersProvider>
      <ConfirmProvider>
        <div>
          <Routes>
            <Route index element={<Welcome />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  <Dashboard />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/winner"
              element={
                <ProtectedRoute>
                  {" "}
                  <Winner />{" "}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ConfirmProvider>
    </EthersProvider>
  );
}

export default App;
