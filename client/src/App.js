import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Landing from "./pages/landing";
import ForgotPassword from './pages/forgotPassword';


function App() {
  return (
<Router>
     <Routes> 
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
     </Routes>
</Router>
  );
}

export default App;
