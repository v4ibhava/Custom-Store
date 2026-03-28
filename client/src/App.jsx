import React from "react";
import Headers from "./components/headers/Headers";
import Pages from "./components/mainpages/Pages";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import { Toaster } from "react-hot-toast";
import "./index.css";

function AppContent() {
  const location = useLocation();
  
  // Routes where header should not be shown
  const noHeaderRoutes = ['/login', '/signup', '/verify-otp', '/add-info'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="App pb-16 sm:pb-0">
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
              style: {
                background: '#065F46',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
              style: {
                background: '#991B1B',
                color: '#fff',
              },
            },
          }}
        />
      </Router>
    </DataProvider>
  );
}

export default App;
