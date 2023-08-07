import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "../view/layout/Header";
import Sidebar from "../view/layout/Sidebar";
import Signup from "./login/Signup";
import Login from "./login/Login";

import Products from "./product/Products";
import Product from "./product/Product";
import CreateProduct from "./product/CreateProduct";

import { createContext, useEffect, useId, useState } from "react";
import UpdateProduct from "./product/UpdateProduct";
import DeleteProduct from "./product/DeleteProduct";

import ServiceDetails from "./serviceDetail/ServiceDetails";

import CreateService from "./servicePackage/CreateService";
import ServicePackages from "./servicePackage/ServicePackages";
import ServicePackage from "./servicePackage/ServicePackage";
import UpdateService from "./servicePackage/UpdateService";

import ServiceDetail from "./serviceDetail/ServiceDetail";
import CreateServiceDetail from "./serviceDetail/CreateServiceDetail";
import DeleteServiceDetail from "./serviceDetail/DeleteServiceDetail";
import UpdateServiceDetial from "./serviceDetail/UpdateServiceDetail";

import ProductBrands from "./productBrand/ProductBrands";
import ProductBrand from "./productBrand/ProductBrand";
import CreateProductBrand from "./productBrand/CreateProductBrand";
import UpdateProductBrand from "./productBrand/UpdateProductBrand";
import DeleteProductBrand from "./productBrand/DeleteProductBrand";

import ProductCategorys from "./productCategory/ProductCategorys";
import ProductCategory from "./productCategory/ProductCategory";
import CreateProductCategory from "./productCategory/CreateProductCategory";
import UpateProductCategory from "./productCategory/UpdateProductCategory";
import DeleProductCategory from "./productCategory/DeleteProductCategory";

import Articles from "./article/Articles";
import Article from "./article/Article";
import CreateArticle from "./article/CreateArticle";
import UpdateArticle from "./article/UpdateArticles";
import DeleteArticle from "./article/DeleteArticles";

import AppProjects from "./applicationProjects/AppProjects";
import AppProject from "./applicationProjects/AppProject";
import CreateAppProject from "./applicationProjects/CreateAppProject";
import UpdateAppProject from "./applicationProjects/UpdateAppProject";
import DeleteAppProject from "./applicationProjects/DeleteAppProject";

import WebsiteProjects from "./websiteProject/WebsiteProjects";
import WebsiteProject from "./websiteProject/WebsiteProject";
import CreateWebsiteProject from "./websiteProject/CreateWebsiteProject";
import UpdateWebsiteProject from "./websiteProject/UpdateWebsiteProject";
import DeleteWebsiteProject from "./websiteProject/DeleteWebsiteProject";

import Contacts from "./contactForm/Contacts";
import Contact from "./contactForm/Contact";
import CreateContact from "./contactForm/CreateContact";
import UpdateContact from "./contactForm/UpdateContact";
import DeleteContact from "./contactForm/DeleteContact";

import UserForm from "./dashboard/UserForm";

import { DELETE_CONTACT } from "../gql/contact";

const Home = () => {
  const AdminContext = createContext();
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();

  const [auth, setAuth] = useState(null);

  // const homeAlert = (message, isError = false) => {
  //   setShowAlert({ message: message, isError: isError });
  //   setTimeout(() => {
  //     setShowAlert({ message: "", isError: false });
  //   }, 3000);
  // };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const parsedLoggedUser = JSON.parse(loggedUser);
      setAuth(parsedLoggedUser);
    } else {
      navigate("*");
    }
  }, []);
  return (
    <div>
      <Header />
      <Sidebar />
      <main className="ml-64 h-full px-5 ">
        <AdminContext.Provider value={auth}>
          <Routes>
            <Route path="/dashboard" element={<UserForm />} />
            <Route path="/signup" element={<Signup />} />

            {/* product */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/create_product" element={<CreateProduct />} />
            <Route path="/update_product/:id" element={<UpdateProduct />} />
            <Route path="/delete_product/:id" element={<DeleteProduct />} />

            <Route path="/service_package" element={<ServicePackages />} />
            <Route path="/service_package/:id" element={<ServicePackage />} />
            <Route path="/create_service" element={<CreateService />} />
            <Route path="/update_service/:id" element={<UpdateService />} />

            <Route path="/service_detail" element={<ServiceDetails />} />
            <Route path="/service_detail/:id" element={<ServiceDetail />} />
            <Route
              path="/create_service_detail"
              element={<CreateServiceDetail />}
            />
            <Route
              path="/delete_service_detail/:id"
              element={<DeleteServiceDetail />}
            />
            <Route
              path="/update_service_detail/:id"
              element={<UpdateServiceDetial />}
            />

            {/* product brand */}
            <Route path="/product_brand" element={<ProductBrands />} />
            <Route path="/product_brand/:id" element={<ProductBrand />} />
            <Route
              path="/create_product_brand"
              element={<CreateProductBrand />}
            />
            <Route
              path="/delete_product_brand/:id"
              element={<DeleteProductBrand />}
            />
            <Route
              path="/update_product_brand/:id"
              element={<UpdateProductBrand />}
            />

            {/* product category */}
            <Route path="/product_category" element={<ProductCategorys />} />
            <Route path="/product_category/:id" element={<ProductCategory />} />
            <Route
              path="/create_product_cat"
              element={<CreateProductCategory />}
            />
            <Route
              path="/delete_product_cat/:id"
              element={<DeleProductCategory />}
            />
            <Route
              path="/update_product_cat/:id"
              element={<UpateProductCategory />}
            />

            {/* article */}
            <Route path="/article" element={<Articles />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/create_article" element={<CreateArticle />} />
            <Route path="/update_article/:id" element={<UpdateArticle />} />
            <Route path="/delete_article/:id" element={<DeleteArticle />} />

            {/* App Projects */}
            <Route path="/app_project" element={<AppProjects />} />
            <Route path="/app_project/:id" element={<AppProject />} />
            <Route path="/create_app_project" element={<CreateAppProject />} />
            <Route
              path="/update_app_project/:id"
              element={<UpdateAppProject />}
            />
            <Route
              path="/delete_app_project/:id"
              element={<DeleteAppProject />}
            />

            {/* Web Projects */}
            <Route path="/web_project" element={<WebsiteProjects />} />
            <Route path="/web_project/:id" element={<WebsiteProject />} />
            <Route
              path="/create_web_project"
              element={<CreateWebsiteProject />}
            />
            <Route
              path="/update_web_project/:id"
              element={<UpdateWebsiteProject />}
            />
            <Route
              path="/delete_web_project/:id"
              element={<DeleteWebsiteProject />}
            />

            {/* article */}
            <Route path="/contact" element={<Contacts />} />
            <Route path="/contact/:id" element={<Contact />} />
            <Route path="/create_contact" element={<CreateContact />} />
            <Route path="/update_contact/:id" element={<UpdateContact />} />
            <Route path="/delete_contact/:id" element={<DeleteContact />} />
          </Routes>
        </AdminContext.Provider>
      </main>
    </div>
  );
};
export default Home;
