import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddDonation from "./pages/AddDonation";
import Pickup from "./pages/Pickup";
import Distribution from "./pages/Distribution";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddDonation />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;