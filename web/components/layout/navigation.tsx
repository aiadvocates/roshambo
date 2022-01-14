export const Navigation = () => {
  return (
    <header className="relative px-6 pt-6 pb-6 text-gray-800 bg-cover bg-gray-50 lg:px-12">
    <div className="relative z-10">
      <div className="relative flex items-center justify-between max-w-screen-xl mx-auto">
        <a href="#">
          <img
            className="h-8"
            src="/images/logo.png"
            alt="logo placeholder"
          />
        </a>
        <nav className="absolute left-0 flex-col items-center justify-center hidden w-full p-8 space-y-4 font-semibold bg-gray-200 md:flex md:p-0 md:space-y-0 md:flex-row md:space-x-4 lg:space-x-8 top-16 md:top-0 md:w-auto md:relative md:bg-transparent">
          <a href="#" className="hover:opacity-70">
            Home
          </a>
          <a href="#" className="hover:opacity-70">
            About
          </a>
        </nav>
        <button className="relative z-30 block p-1 mt-1 text-green-600 rounded-md w-9 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="absolute inset-x-0 z-50 w-full py-2 origin-top-right transform top-10 ransition md:hidden">
          <nav className="p-3 transform bg-white rounded-lg shadow-lg">
            <a
              href="#"
              className="block px-6 py-3 font-semibold border-b hover:opacity-70 border-blue-50"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-6 py-3 font-semibold border-b hover:opacity-70 border-blue-50"
            >
              Services
            </a>
            <a
              href="#"
              className="block px-6 py-3 font-semibold border-b hover:opacity-70 border-blue-50"
            >
              Pricing
            </a>
            <a
              href="#"
              className="block px-6 py-3 font-semibold border-b hover:opacity-70 border-blue-50"
            >
              Blog
            </a>
            <a
              href="#"
              className="block px-6 py-3 font-semibold border-b hover:opacity-70 border-blue-50"
            >
              Contact
            </a>
            <a
              href="#"
              className="block px-6 py-3 font-bold border-b hover:opacity-70 border-blue-50"
            >
              Sign in
            </a>
          </nav>
        </div>
      </div>
    </div>
  </header>
  );
};

export default Navigation;
