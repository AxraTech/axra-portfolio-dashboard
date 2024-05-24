import { useState, useEffect, useContext } from "react";
import Pagination from "../pagination/Pagination";
import { useLazyQuery, useQuery } from "@apollo/client";

import { useNavigate } from "react-router-dom";

import { ALL_SERVICE_PACKAGE } from "../../gql/servicePackage";
import SideBarContext from "../../context/SideBarContext";
import DeleteServicePackage from "./DeleteServicePackage";
const ServicePackage = () => {
  const navigate = useNavigate();
  const { nav, setNav } = useContext(SideBarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [open, setOpen] = useState(false);
  const [packages, setPackages] = useState();
  const [serivces, setServices] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [loadService, resultService] = useLazyQuery(ALL_SERVICE_PACKAGE);

  useEffect(() => {
    loadService({
      variables: {
        packageQuery: {
          _or: [
            {
              service_package_name: { _ilike: `%${searchValue}%` },
            },
            { service_package_type: { _ilike: `%${searchValue}%` } },
          ],
        },
      },
      fetchPolicy: "network-only",
    });
    setNav("service_package");
  }, [loadService, searchValue, nav]);
  useEffect(() => {
    if (resultService.data) {
      setServices(resultService?.data.service_packages);
    }
  }, [resultService]);

  const handleRemove = (row) => {
    setOpen(true);
    setPackages(row);
  };

  const handleRemoveClose = () => {
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(searchValue);

    if (searchValue === "") {
      loadService(
        {
          variables: {
            search: `%${searchValue}%`,
          },
          fetchPolicy: "network-only",
        },
        [loadService, searchValue]
      );
    }
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(
    resultService?.data?.service_packages_aggregate?.aggregate.count /
      itemsPerPage
  );
  const totals =
    resultService?.data?.service_packages_aggregate?.aggregate.count;
  // Get the current page's data
  const currentData = serivces?.slice(
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
  if (!serivces) {
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
                placeholder="Search by service package name or package type"
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
            onClick={() => navigate("/create_service")}
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Add Service Package
          </button>
        </div>
      </div>
      <div className="relative bg-white_color overflow-y-scroll max-h-96 overflow-x-auto  border-2 ">
        <table className="w-full text-md text-left  text-gray-500">
          <thead className="text-md sticky top-0  text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                ID
              </th>
              <th scope="col" className="py-4">
                Category
              </th>
              <th scope="col" className="py-4">
                Package Type
              </th>
              <th scope="col" className="py-4">
                Package Name
              </th>
              <th scope="col" className="py-4">
                Package Price
              </th>
              <th scope="col" className="py-4">
                Service Fee
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
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="pr-2">
                    {row?.service_details_packages[0]?.service_details_packages?.service_category?.service_name?.substring(
                      0,
                      10
                    )}
                  </td>
                  <td className="pr-2">
                    {row?.service_package_type?.substring(0, 10)}
                  </td>
                  <td className="pr-2">
                    {row?.service_package_name?.substring(0, 10)}
                  </td>
                  <td className="pr-2">{row?.one_time_package_price}</td>
                  <td className="pr-2">
                    {row?.recurrently_service_fee?.substring(0, 10)}
                  </td>

                  <td className="pr-2 ">
                    <button
                      onClick={() => navigate(`${row.id}`)}
                      className="font-medium text-md rounded text-white py-2 px-4  bg-green-600 hover:bg-green-700"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleRemove(row)}
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

      {open && (
        <DeleteServicePackage
          packages={packages}
          handleDelClose={handleRemoveClose}
        />
      )}
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
export default ServicePackage;
