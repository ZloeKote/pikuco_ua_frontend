import { Outlet } from "react-router-dom";
import NavigationPanel from "../NavigationPanel";

function LayoutWithNavigation() {
  return (
    <div className="nav-layout font-serif">
      <NavigationPanel />
      <Outlet />
    </div>
  );
}

export default LayoutWithNavigation;
