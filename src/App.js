import NavigationPanel from "./components/NavigationPanel";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="layout font-serif">
      <NavigationPanel />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
}

export default App;
