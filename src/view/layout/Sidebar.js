import { useContext } from "react";
import images from "../../images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {
  faCoffee,
  faLaptop,
  faMapMarker,
  faHome,
  faDesktopAlt,
  faMobileAndroidAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import SideBarContext from "../../context/SideBarContext";
const Sidebar = () => {
  const { nav, setNav } = useContext(SideBarContext);
  const handleSidebar = (bar) => {
    setNav(bar);
  };
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full w-full flex justify-center bg-white overflow-y-scroll  ">
          <div className="pt-10">
            {/* <p classNameName="text-2xl font-weight-900 my-10">AXRA TECH</p> */}
            <img
              src={images.textLogo}
              width="160"
              height="22"
              className="pb-5"
            />

            <ul className="space-y-2 font-medium  ">
              {/* dashboard */}
              {/* <li>
                <a
                  href="/dashboard"
                  onClick={handleSidebar("dashboard")}
                  className={`${
                    nav == "dashboard"
                      ? "flex items-center p-2 rounded-lg bg-gray-100"
                      : "flex items-center p-2 rounded-lg"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>

                  <span
                    className={`${
                      nav == "dashboard" ? "ml-3 text-text_color" : "ml-3"
                    }`}
                  >
                    Dashboard
                  </span>
                </a>
              </li> */}

              <li>
                <a
                  href="/dashboard"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>

                  <span className="flex-1 ml-3 whitespace-nowrap text-sidebar_text_color hover:text-sidebar_hover_color">
                    Dashboard
                  </span>
                </a>
              </li>

              {/* home */}
              {/* <li>
                <a
                  href="/home"
                  onClick={handleSidebar("home")}
                  className={`${
                    nav == "home"
                      ? "flex items-center p-2 rounded-lg bg-gray-100 "
                      : "flex items-center p-2 rounded-lg"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className={`${
                      nav == "home"
                        ? "w-5 h-5 text-text_color "
                        : "w-5 h-5 text-gray-500"
                    }`}
                  />
                  <span
                    className={`${
                      nav == "home" ? "ml-3 text-text_color" : "ml-3"
                    }`}
                  >
                    Home
                  </span>
                </a>
              </li> */}
              <li>
                <a
                  href="/home"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />

                  <span className="flex-1 ml-3 whitespace-nowrap text-sidebar_text_color hover:text-sidebar_hover_color">
                    Home
                  </span>
                </a>
              </li>

              {/* Article */}
              <li>
                <a
                  href="/article"
                  onClick={handleSidebar("article")}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                    // className={`${
                    //   nav === "article"
                    //     ? "w-5 h-5 text-text_color "
                    //     : "w-5 h-5 text-gray-500"
                    // }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap text-sidebar_text_color hover:text-sidebar_hover_color">
                    Article
                  </span>
                </a>
              </li>

              {/* service */}
              <li>
                <a
                  href="/service_package"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faLaptop}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />

                  <span className="flex-1 ml-3 whitespace-nowrap text-sidebar_text_color hover:text-sidebar_hover_color">
                    Service Package
                  </span>
                </a>
              </li>
              {/* service detail*/}
              <li>
                <a
                  href="/service_detail"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faLaptop}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />
                  <span className="flex-1 ml-3 text-sidebar_text_color whitespace-nowrap hover:text-sidebar_hover_color">
                    Service Detail
                  </span>
                </a>
              </li>
              {/* product */}
              <li>
                <a
                  href="/products"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ml-3 text-sidebar_text_color whitespace-nowrap hover:text-sidebar_hover_color">
                    Product
                  </span>
                </a>
              </li>
              {/* product brand */}
              <li>
                <a
                  href="/product_brand"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 text-sidebar_text_color ml-3 whitespace-nowrap ">
                    Product Brand
                  </span>
                </a>
              </li>
              {/* product category */}
              <li>
                <a
                  href="/product_category"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ml-3 text-sidebar_text_color whitespace-nowrap hover:text-sidebar_hover_color">
                    Product Category
                  </span>
                </a>
              </li>
              {/*Application project */}
              <li>
                <a
                  href="/app_project"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faMobileAndroidAlt}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />
                  <span className="flex-1 ml-3 text-sidebar_text_color whitespace-nowrap hover:text-sidebar_hover_color">
                    Application Projects
                  </span>
                </a>
              </li>
              {/*Website project */}
              <li>
                <a
                  href="/web_project"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faDesktopAlt}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />
                  <span className="flex-1 text-sidebar_text_color ml-3 whitespace-nowrap hover:text-sidebar_hover_color">
                    Website Projects
                  </span>
                </a>
              </li>
              {/* contact */}
              <li>
                <a
                  href="/contact"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faMapMarker}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />
                  <span className=" hover:text-sidebar_hover_color flex-1 text-sidebar_text_color ml-3 whitespace-nowrap">
                    Contact Form
                  </span>
                </a>
              </li>

              {/* Sign up */}
              <li>
                <a
                  href="/signup"
                  // className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:hove:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-sidebar_hover_color dark:group-hover:text-white "
                  />
                  <span className="flex-1 text-sidebar_text_color ml-3 whitespace-nowrap hover:text-sidebar_hover_color ">
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
