import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";

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
      <div className="grid grid-cols-3 gap-x-10">
        {/* <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={leaveForm?.leave_form_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div> */}
        <div className=" col-span-2 p-4 px-10 ">
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
