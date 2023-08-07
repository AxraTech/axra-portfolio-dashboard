import { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ALL_PRODUCTS, PRODUCT_PK } from "../../gql/product";
import Search from "../../components/Search";
import { MAIN_PRODUCT } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_USERFORM } from "../../gql/userform";
const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const [user, serUser] = useState();
  const [loadProduct, resUser] = useLazyQuery(ALL_USERFORM);

  useEffect(() => {
    loadProduct({ fetchPolicy: "network-only" });
  }, [loadProduct]);
  useEffect(() => {
    if (resUser.data) {
      serUser(resUser?.data.user_appointment_form);
    }
  }, [resUser]);

  // Calculate total number of pages
  const totalPages = Math.ceil(
    resUser?.data?.user_appointment_form_aggregate?.aggregate.count /
      itemsPerPage
  );

  // Get the current page's data
  let currentData = user?.slice(
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

  if (!user) {
    return;
  }

  return (
    <div>
      <div className="flex justify-between mb-3 ">
        <Search />
        {/* <div className="flex items-center">
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
        </div> */}
      </div>
      <div className="relative bg-white_color overflow-y-scroll max-h-96 overflow-x-auto  border-2 ">
        <table className="w-full text-md text-left  text-gray-500">
          <thead className="text-md sticky top-0  text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                ID
              </th>
              <th scope="col" className="py-4 px-3">
                Phone
              </th>
              <th scope="col" className="py-4 px-3">
                Email
              </th>

              <th scope="col" className="py-4 px-3">
                Date
              </th>
              <th scope="col" className="py-4 px-3">
                Time
              </th>
              <th scope="col" className="py-4 px-3">
                Company Name
              </th>

              <th scope="col" className="py-4">
                Action
              </th>
            </tr>
          </thead>
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
                  <td className="px-6 py-4">{index}</td>

                  <td className="py-4 px-3">{row.phone}</td>
                  <td className="py-4 px-3">{row.email}</td>
                  <td className="py-4 px-3">{row.date_time.slice(0, 10)}</td>
                  <td className="py-4 px-3">
                    {new Date(row.date_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="py-4 px-3">{row.company_name}</td>

                  <td className="py-4 px-3">
                    <button
                      onClick={() => navigate(`${row.id}`)}
                      className="font-medium text-md rounded text-white py-2 px-4  bg-green-600 hover:bg-green-700"
                    >
                      Detail
                    </button>
                    <button
                      // onClick={navigate(
                      //   `/delete_product/${product.product_model_by_pk.id}`
                      // )}
                      className="font-medium text-md rounded text-white py-2 px-4 ml-8  bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
};
export default UserForm;
