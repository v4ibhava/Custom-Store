import React from "react";
import Headers from "./components/headers/Headers";
import Pages from "./components/mainpages/Pages";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import "./index.css";

function AppContent() {
  const location = useLocation();
  
  // Routes where header should not be shown
  const noHeaderRoutes = ['/login', '/signup', '/verify-otp', '/add-info'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowHeader && <Headers />}
      <Pages />
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  );
}

export default App;
