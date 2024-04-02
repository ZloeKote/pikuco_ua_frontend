import { Outlet } from "react-router-dom";

function SimpleLayout() {
  return (
    <div className="layout font-serif">
      <Outlet></Outlet>
    </div>
  );
}

export default SimpleLayout;