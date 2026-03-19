import { Outlet } from "react-router-dom";
import Header from "./components/header";

function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;