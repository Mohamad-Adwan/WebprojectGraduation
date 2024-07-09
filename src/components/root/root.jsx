import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { Outlet } from "react-router-dom";
import "./Root.Module.css";

export default function root(userData) {
  return (
    <div className="rootpage">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
