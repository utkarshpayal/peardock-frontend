import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ logout, isAuthenticated }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { path: "/docs", name: "Docs" },
    { path: "/blog", name: "Blog" },
    { path: "/contact", name: "Contact" },
  ];

  return (
      <header className="sticky top-0 w-full text-gray-300 py-4 px-6 z-[1000] backdrop-blur-md bg-[#0A0B0F]">

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="ml-8 text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent hover:scale-105 transition-transform">
            AnonymousDock
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {mainMenuItems.map((item) => (
            <a
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-lg hover:text-white transition-colors cursor-pointer ${
                location.pathname === item.path ? "text-white" : ""
              }`}
            >
              {item.name}
            </a>
          ))}

          <button
            onClick={() => navigate("/buy-gpu")}
            className="px-4 py-2 bg-[#FF6B6B] text-white rounded-md hover:bg-[#ff5252] transition-colors"
          >
            Find GPU
          </button>

          {!isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors text-red-500 hover:text-red-400"
            >
              Logout
            </button>
          )}

          <button className="px-3 py-1 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors">
            EN
          </button>
        </nav>

        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-[#0A0B0F] w-full h-full p-4">
            <div className="flex flex-col space-y-4">
              {mainMenuItems.map((item) => (
                <a
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className="text-lg hover:text-white transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate("/buy-gpu");
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-[#FF6B6B] text-white rounded-md hover:bg-[#ff5252] transition-colors"
              >
                Find GPU
              </button>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
