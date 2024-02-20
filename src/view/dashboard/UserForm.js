import { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ALL_PRODUCTS, PRODUCT_PK } from "../../gql/product";
import Search from "../../components/Search";
import { MAIN_PRODUCT } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_USERFORM } from "../../gql/userform";
// import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
// import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [searchValue, setSearchValue] = useState("");

  const [user, serUser] = useState();
  const [loadProduct, resUser] = useLazyQuery(ALL_USERFORM);

  const [dateTime, setDateTime] = useState();

  useEffect(() => {
    loadProduct({
      variables: { search: `%${searchValue}%` },
      fetchPolicy: "network-only",
    });
  }, [loadProduct, searchValue]);
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
  const handleRemove = (row) => {
    navigate(`/delete_userForm/${row.id}`);
  };
  if (!user) {
    return;
  }

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
  const handleDateTime = (users) => {
    console.log("user", users);
    return users;
  };

  return (
    <>
      <div className="flex justify-between gap-x-10">
        <MonthlyCalendar />
        <WeeklyCalendar
          date_time={handleDateTime(user.map((u) => u.date_time))}
        />
      </div>

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
                  placeholder="Search by Phone Number"
                  required=""
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </form>
          </div>
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
                      <td className="px-6 py-4">{index}</td>

                      <td className="py-4 px-3">{row.phone}</td>
                      <td className="py-4 px-3">{row.email}</td>
                      <td className="py-4 px-3">
                        {row.date_time.slice(0, 10)}
                      </td>
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
        />
      </div>
    </>
  );
};
export default UserForm;
