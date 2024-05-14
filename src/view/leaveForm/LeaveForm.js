import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
import { format } from "date-fns";
import { LEAVE_FORM_PK, UPDATE_STATUS } from "../../gql/leaveForm";

const LeaveForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: leaveForm } = useQuery(LEAVE_FORM_PK, {
    variables: { id: id },
  });

  const [updatedStatus] = useMutation(UPDATE_STATUS, {
    onError: (err) => {
      console.log("Update status error ", err);
    },
    onCompleted: (data) => {
      alert("Change Status");
      console.log("updated stataus", data);
    },
  });

  if (!leaveForm) {
    return;
  }

  return (
    <>
      <div className="my-5">
        <span>
          <a href="/appointment" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/leaveForm" className="hover:text-blue-600">
            {" "}
            / Leave Form Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        {/* <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={leaveForm?.leave_form_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div> */}
        <div className=" col-span-2 p-4 px-10 ">
          {/* staff Name */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Staff Name</p>
            <p className="px-3">-</p>
            <p>{leaveForm?.leave_form_by_pk?.leave_form_staff_info?.name}</p>
          </div>
          {/* start date */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Leave Start Date</p>
            <p className="px-3">-</p>
            <p>{leaveForm?.leave_form_by_pk?.start_date}</p>
          </div>
          {/* end date */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Leave End Date</p>
            <p className="px-3">-</p>
            <p>{leaveForm?.leave_form_by_pk?.end_date}</p>
          </div>
          {/* total number of leaves */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Total Number of Leaves</p>
            <p className="px-3">-</p>
            <p>
              {leaveForm?.leave_form_by_pk?.number_of_leaves} <span>days</span>
            </p>
          </div>
          {/* leave type*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Leave Type</p>
            <p className="px-3">-</p>
            <p>{leaveForm?.leave_form_by_pk?.form_type}</p>
          </div>
          {/* hourly start time*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Hourly Start Time</p>
            <p className="px-3">-</p>
            <p>
              {format(
                new Date(leaveForm?.leave_form_by_pk?.hourly_start_time),
                "yyyy-MM-dd hh:mm:ss a"
              )}
            </p>
          </div>
          {/* hourly end time*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Hourly End Time</p>
            <p className="px-3">-</p>
            <p>
              {" "}
              {format(
                new Date(leaveForm?.leave_form_by_pk?.hourly_end_time),
                "yyyy-MM-dd hh:mm:ss a"
              )}
            </p>
          </div>
          {/* reason*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Reason </p>
            <p className="px-3">-</p>
            <p>{leaveForm?.leave_form_by_pk?.reason}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-x-10 py-5">
        <div className="px-10">
          {leaveForm?.leave_form_by_pk?.status === "pending" &&
            leaveForm?.leave_form_by_pk?.status !== "approved" && (
              <button
                className="mr-3 font-medium text-md rounded text-white py-2 px-4  bg-green-500 hover:bg-green-600"
                onClick={() => {
                  updatedStatus({ variables: { id: id, status: "approved" } });
                  navigate(-1);
                }}
              >
                Verified
              </button>
            )}

          {!leaveForm?.leave_form_by_pk?.status?.includes("rejected") && (
            <button
              className=" font-medium text-md rounded text-white py-2 px-4  bg-red-500 hover:bg-red-600"
              onClick={() =>
                updatedStatus({ variables: { id: id, status: "rejected" } })
              }
            >
              Reject
            </button>
          )}
        </div>

        <button
          onClick={() =>
            navigate(`/deleteLeaveForm/${leaveForm.leave_form_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default LeaveForm;
