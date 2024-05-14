import { useState, useEffect, useContext } from "react";
import Pagination from "../pagination/Pagination";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ALL_PRODUCTS, UPDATE_POSITION } from "../../gql/product";

import { useNavigate, useParams } from "react-router-dom";
import SideBarContext from "../../context/SideBarContext";
const Products = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { nav, setNav } = useContext(SideBarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [products, setProducts] = useState();
  const [loadProduct, resultProduct] = useLazyQuery(ALL_PRODUCTS);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    loadProduct({
      variables: { search: `%${searchValue}%` },
      fetchPolicy: "network-only",
    });
    setNav("products");
  }, [loadProduct, searchValue, nav]);

  useEffect(() => {
    if (resultProduct.data) {
      setProducts(resultProduct?.data.product_model);
    }
  }, [resultProduct]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(searchValue);

    if (searchValue === "") {
      loadProduct(
        {
          variables: {
            search: `%${searchValue}%`,
          },
          fetchPolicy: "network-only",
        },
        [loadProduct, searchValue]
      );
    }
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(
    resultProduct?.data?.product_model_aggregate?.aggregate.count / itemsPerPage
  );
  const totals = resultProduct?.data?.product_model_aggregate?.aggregate.count;
  // Get the current page's data
  const currentData = products?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle next page click
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handle previous page click
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleRemove = (row) => {
    navigate(`/delete_product/${row.id}`);
  };

  //update position
  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onError: (error) => {
      console.log("error: ", error);
    },
    onCompleted: (res) => {
      // homeAlert(`Products have been put to the top.`);
    },
    refetchQueries: [ALL_PRODUCTS],
  });

  if (!products) {
    return;
  }

  return (
    <div>
      <div className="flex justify-between mb-3 ">
        {/* Search */}
        <div className="w-full md:w-1/3 my-5">
          <form className="flex items-center" onSubmit={handleSearch}>
            <label for="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full pl-10 p-2 "
                placeholder="Search by Product Model"
                required=""
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center py-2 px-4 bg-blue-700 text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-md"
            onClick={() => navigate("/create_product")}
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewbox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Add product
          </button>
        </div>
      </div>
      <div className="relative bg-white_color overflow-y-scroll max-h-fit overflow-x-auto  border-2 ">
        <table className="w-full text-md text-left  text-gray-500">
          <thead className="text-md sticky top-0  text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                ID
              </th>
              <th scope="col" className="py-4">
                Image
              </th>
              <th scope="col" className="py-4">
                Product Category
              </th>

              <th scope="col" className="py-4">
                Product Brand
              </th>
              <th scope="col" className="py-4">
                Product Model
              </th>

              <th scope="col" className="py-4">
                Action
              </th>
            </tr>
          </thead>
          {currentData.length === 0 ? (
            <tbody>
              <tr>
                <td className="py-4 text-center" colSpan="6">
                  <p className="text-red-500 text-2xl">No Datas</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {Array.isArray(currentData) &&
                currentData.map((row, index) => (
                  <tr
                    key={index}
                    // className={`${
                    //   index % 2 !== 0 ? "bg-slate-50 " : "border-y-2"
                    // } hover:bg-slate-100 hover:shadow-md`}
                    className="hover:bg-slate-100 border-y-2 hover:shadow-md"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="py-4">
                      <img
                        src={row.product_image_url}
                        className="rounded-full w-12 h-12"
                      ></img>
                    </td>
                    <td className="py-4">
                      {row.product_model_category?.product_category_name}
                    </td>
                    <td className="py-4">
                      {row.product_model_brand?.brand_name}
                    </td>
                    <td className="py-4">{row.model_name}</td>

                    <td className="py-4">
                      <button
                        className="font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          updatePosition({
                            variables: {
                              id: row.id,
                              updateAt: new Date().toISOString(),
                            },
                          })
                        }
                      >
                        Top
                      </button>
                      <button
                        onClick={() => navigate(`${row.id}`)}
                        className="font-medium text-md rounded text-white py-2 px-4 ml-5 bg-green-600 hover:bg-green-700"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleRemove(row)}
                        className="font-medium text-md rounded text-white py-2 px-4 ml-5  bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        totals={totals}
      />
    </div>
  );
};
export default Products;
