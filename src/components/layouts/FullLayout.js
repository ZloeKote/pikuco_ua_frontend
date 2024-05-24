import { Outlet } from "react-router-dom";
import NavigationPanel from "../NavigationPanel";
import Footer from "../Footer";

function FullLayout() {
  return (
    <div className="full-layout font-serif">
      <NavigationPanel />
      <Outlet />
      <Footer />
    </div>
  );
}

export default FullLayout;
