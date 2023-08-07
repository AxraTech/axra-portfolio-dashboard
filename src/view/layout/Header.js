import { useState } from "react";
import images from "../../images";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="pt-10 pb-5 px-5 shadow-inner ">
        <div className="  flex justify-end mr-8 items-center ml-64">
          {/* <img src={images.logo} className="w-auto h-14" /> */}
          <div className="flex">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>

            <span className="relative">
              <button onClick={toggleDropdown} className="px-2 text-gray-800">
                Admin Options
              </button>
              {isOpen && (
                <div className="absolute top-10 right-0 w-40 py-2 bg-white shadow-md rounded-md">
                  {/* Replace '#' with the actual URL for each option */}
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Login
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </a>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
