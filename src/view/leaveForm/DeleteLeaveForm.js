import { useState } from "react";
// import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { ADD_HOME, DELETE_HOME, HOME_PK } from "../../gql/home";
import { DELETE_LEAVE_FORM, LEAVE_FORM_PK } from "../../gql/leaveForm";

const DeleteLeaveForm = () => {
  const [Modelopen, setModelOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { data: home } = useQuery(LEAVE_FORM_PK, {
    variables: { id: id },
  });
  const [delete_home] = useMutation(DELETE_LEAVE_FORM, {
    onError: (err) => {
      alert("Delete Error", err);
    },
    onCompleted: () => {
      setLoading(false);
      alert("Delete Successfull");
    },
  });

  const handleDelete = async () => {
    try {
      await delete_home({
        variables: { id: home?.leave_form_by_pk.id },
      });
    } catch (err) {
      console.log("Delete Error", err);
    }

    // setModelOpen(false);
    navigate("/leaveForm");
  };
  return (
    <>
      {Modelopen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-gray-300 rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={() => navigate(-1)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  className="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to Remove?
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleDelete}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                >
                  Yes, I'm sure
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DeleteLeaveForm;
