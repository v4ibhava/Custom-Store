import React from "react";
import Headers from "./components/headers/Headers";
import Pages from "./components/mainpages/Pages";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import "./index.css";

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Headers />
          <Pages />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
