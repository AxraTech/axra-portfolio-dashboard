import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./view/Home";
import Login from "./view/login/Login";
import Signup from "./view/login/Logout";
import { SideBarContextProvider } from "./context/SideBarContext";

function App() {
  return (
    <div>
      <SideBarContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </SideBarContextProvider>
    </div>
  );
}

export default App;
