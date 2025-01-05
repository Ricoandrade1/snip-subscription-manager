import { Routes, Route } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Index } from "@/pages/Index";
import { Members } from "@/pages/Members";
import { Products } from "@/pages/Products";
import { Barbers } from "@/pages/Barbers";
import { Revenue } from "@/pages/Revenue";
import { Categories } from "@/pages/Categories";
import { Brands } from "@/pages/Brands";
import { CashFlow } from "@/pages/CashFlow";
import { Schedule } from "@/pages/Schedule";
import { Feed } from "@/pages/Feed";
import { Story } from "@/pages/Story";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Index />} />
      <Route path="/members" element={<Members />} />
      <Route path="/products" element={<Products />} />
      <Route path="/barbers" element={<Barbers />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/cash-flow" element={<CashFlow />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/story" element={<Story />} />
    </Routes>
  );
}

export default App;