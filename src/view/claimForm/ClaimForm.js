import { useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";

import { CLAIM_FORM_PK, UPDATE_STATUS } from "../../gql/claimForm";

const LeaveForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: claimForm } = useQuery(CLAIM_FORM_PK, {
    variables: { id: id },
  });

  const [updatedStatus] = useMutation(UPDATE_STATUS, {
    onError: (err) => {
      console.log("Update status error ", err);
    },
    onCompleted: (data) => {
      alert("Change Status ----");
      console.log("updated stataus", data);
    },
  });

  if (!claimForm) {
    return;
  }

  return (
    <>
      <div className="my-5">
        <span>
          <a href="/" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/claim" className="hover:text-blue-600">
            {" "}
            / Claim Form Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={claimForm?.claim_form_by_pk?.image}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-2 p-4 px-10 ">
          {/* reason */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Staff Name </p>
            <p className="px-3">-</p>
            <p>{claimForm?.claim_form_by_pk?.staff_info?.name}</p>
          </div>
          {/* start date */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Claimant Date</p>
            <p className="px-3">-</p>
            <p>{claimForm?.claim_form_by_pk?.claimant_date}</p>
          </div>
          {/*claim_amount */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Claim Amount</p>
            <p className="px-3">-</p>
            <p>{claimForm?.claim_form_by_pk?.claim_amount}</p>
          </div>
          {/*expense type */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Expense Type</p>
            <p className="px-3">-</p>
            <p>{claimForm?.claim_form_by_pk?.expense_type}</p>
          </div>

          {/* description_of_expense */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Description Of Expense</p>
            <p className="px-3">-</p>
            <p>{claimForm?.claim_form_by_pk?.description_of_expense} </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-x-10 py-5">
        <div className="px-10">
          {claimForm?.claim_form_by_pk?.status === "pending" &&
            claimForm?.claim_form_by_pk?.status !== "approved" && (
              <button
                className="mr-3 font-medium text-md rounded text-white py-2 px-4  bg-green-500 hover:bg-green-600"
                onClick={() => {
                  updatedStatus({ variables: { id: id, status: "approved" } });
                  navigate(-1);
                }}
              >
                Approved
              </button>
            )}

          {!claimForm?.claim_form_by_pk?.status?.includes("rejected") && (
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
        {/* <button
          onClick={() =>
            navigate(`/update_leaveForm/${leaveForm?.leave_form_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button> */}
        <button
          onClick={() =>
            navigate(`/deleteClaimForm/${claimForm.claim_form_by_pk.id}`)
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
