import Footer from "./Footer";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

function Layout({ logout, isAuthenticated }: any) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col">
      <Header isAuthenticated={isAuthenticated} logout={logout} />
      <main className="h-[calc(100vh-72px)] flex justify-center">
        <Outlet />
      </main>
      {location.pathname !== '/buy-gpu' && <Footer />}
    </div>
  );
}

export default Layout;
