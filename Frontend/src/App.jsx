import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import Navbar from "./Components/Navbar";
import Class10Page from "./Pages/Class-10/Class-10";
import Class12Page from "./Pages/Class-12/Class-12";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Result from "./Pages/Result/Result";
import Graph from "./Pages/Graph/Graph";
import { useEffect, useState } from "react";

function App() {
  const [loged, setloged] = useState(false);
  const [last, setLast] = useState({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      setloged(true);
    }
  }, []);

  const handleLogin = () => {
    setloged(true);
    localStorage.setItem("loggedIn", "true");
  };

  const handleLogout = () => {
    setloged(false);
    localStorage.removeItem("loggedIn");
  };

  return (
    <Router>
      <Navbar loged={loged} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home loged={loged} />} />
        <Route path="/signup" element={<Signup setloged={handleLogin} />} />
        <Route path="/login" element={<Login setloged={handleLogin} />} />

        {loged && (
          <>
            <Route path="/class-10" element={<Class10Page />} />
            <Route path="/class-12" element={<Class12Page />} />
            <Route
              path="/cetDashboard"
              element={<Dashboard setLast={setLast} />}
            />
            <Route path="/cetResult" element={<Result last={last} />} />
            <Route path="/cetGraph" element={<Graph last={last} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
