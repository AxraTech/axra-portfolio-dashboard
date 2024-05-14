import { useState, useEffect, useContext } from "react";
import Pagination from "../pagination/Pagination";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { ALL_LeaveForms, ARTICLE_PK, DELETE_ARTICLE } from "../../gql/home";
import { GET_ALL_LEAVE_FORM } from "../../gql/leaveForm";
import SideBarContext from "../../context/SideBarContext";

const LeaveForms = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const { nav, setNav } = useContext(SideBarContext);
  const [home, setHome] = useState();
  const [loadForm, resForm] = useLazyQuery(GET_ALL_LEAVE_FORM);

  useEffect(() => {
    loadForm({
      fetchPolicy: "network-only",
    });
    setNav("leaveForm");
  }, [loadForm, nav]);
  useEffect(() => {
    if (resForm.data) {
      setHome(resForm?.data.leave_form);
    }
  }, [resForm]);

  //   const handleSearch = (e) => {
  //     e.preventDefault();
  //     setSearchValue(searchValue);
  //     if (searchValue === "") {
  //       loadForm(
  //         {
  //           variables: {
  //             search: `%${searchValue}%`,
  //           },
  //           fetchPolicy: "network-only",
  //         },
  //         [loadForm, searchValue]
  //       );
  //     }
  //   };

  // Calculate total number of pages
  const totalPages = Math.ceil(
    resForm?.data?.leave_form_aggregate?.aggregate.count / itemsPerPage
  );
  const totals = resForm?.data?.leave_form_aggregate?.aggregate.count;
  // Get the current page's data
  const currentData = home?.slice(
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
    navigate(`/deleteLeaveForm/${row.id}`);
  };

  return (
    <div>
      <div className="flex justify-between mb-3 ">
        {/* Search
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
                placeholder="Search by Title"
                required=""
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div> */}
      </div>
      <div className="relative bg-white_color overflow-y-scroll max-h-96 overflow-x-auto  border-2 ">
        <table className="w-full text-md text-left  text-gray-500">
          <thead className="text-md sticky top-0  text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                ID
              </th>
              <th scope="col" className="py-4">
                Staff Name
              </th>
              <th scope="col" className="py-4">
                Form Type
              </th>
              <th scope="col" className="py-4">
                Reason
              </th>
              <th scope="col" className="py-4">
                NoOfDays
              </th>

              <th scope="col" className="py-4">
                Start Date
              </th>
              <th scope="col" className="py-4">
                End Date
              </th>
              <th scope="col" className="py-4">
                Status
              </th>

              <th scope="col" className="py-4">
                Action
              </th>
            </tr>
          </thead>
          {currentData?.length === 0 ? (
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
                    <td className="py-4">{row?.leave_form_staff_info?.name}</td>
                    <td className="py-4">{row?.form_type}</td>
                    <td className="py-4">{row?.reason}</td>
                    <td className="py-4">{row.number_of_leaves}</td>
                    <td className="py-4">{row?.start_date}</td>
                    <td className="py-4">{row?.end_date}</td>
                    <td className="py-4">
                      {row?.status === "pending" ? (
                        <p
                          style={{
                            color: "blue",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          Pending
                        </p>
                      ) : row.status === "approved" ? (
                        <p
                          style={{
                            color: "green",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          Approved
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "red",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          Rejected
                        </p>
                      )}
                    </td>

                    <td className="py-4">
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
export default LeaveForms;
