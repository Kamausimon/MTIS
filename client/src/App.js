import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Landing from "./pages/landing";
import ForgotPassword from './pages/forgotPassword';
import Products from './pages/products';
import CreateProduct from './pages/createProduct';
import EditProduct from './pages/editProduct';
import Supplies from './pages/supplies';
import Categories from './pages/categories';
import Settings from './pages/settings';
import Analytics from './pages/analytics';
import Orders from './pages/orders';
import Logout from './pages/logout';
import CreateCategory from './pages/createCategory';
import CreateSupply from './pages/createSupply';
import Suppliers from './pages/suppliers';
import CreateSupplier from './pages/createSupplier';
import CreateOrder from './pages/createOrder';
import ViewOrder from './pages/viewOrder';
import EditOrder from './pages/editOrder';

function App() {
  return (
<Router>
     <Routes> 
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/create" element={<CreateProduct />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/supplies" element={<Supplies />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/createCategory" element={<CreateCategory />} />
      <Route path="/createSupply" element={<CreateSupply />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/createSupplier" element={<CreateSupplier />} />
      <Route path='/createOrder' element={<CreateOrder />} />
      <Route path='/viewOrder/:id' element={<ViewOrder />} />
      <Route path='/editOrder/:id' element={<EditOrder />} />
   
            <Route path="*" element={<h1>Not Found</h1>} />
     </Routes>
</Router>
  );
}

export default App;
