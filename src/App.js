import logo from "./logo.svg";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./assets/css/style.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <>
      {/* <BrowserRouter> */}
        <HashRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          </Routes>
        </HashRouter>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
