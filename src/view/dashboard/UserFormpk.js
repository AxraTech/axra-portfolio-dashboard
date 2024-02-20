import { useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { USER_PK } from "../../gql/userform";

const UserFormPk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useQuery(USER_PK, {
    variables: { id: id },
  });
  console.log("servie", user);
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);

  const handleSpecification = () => {
    setSpeOpen(true);
    setDesOpen(false);
  };

  if (!user) {
    return;
  }
  console.log("user", user);
  return (
    <>
      <div className="grid grid-cols-3">
        <div className=" col-span-2 ">
          {/* company Name */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Company Name</p>
            <p className="px-3">-</p>
            <p>{user?.user_appointment_form[0]?.company_name}</p>
          </div>

          {/* email */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Email</p>
            <p className="px-3">-</p>
            <p>{user?.user_appointment_form[0]?.email}</p>
          </div>
          {/* Date */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Date</p>
            <p className="px-3">-</p>
            <p>{user?.user_appointment_form[0]?.date_time.slice(0, 10)}</p>
          </div>
          {/* Time */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Time</p>
            <p className="px-3">-</p>
            <p>
              {new Date(
                user?.user_appointment_form[0].date_time
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* phone*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Phone</p>
            <p className="px-3">-</p>
            <p>{user?.user_appointment_form[0]?.phone}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-x-10 mt-10">
        <button
          className={`${
            speOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleSpecification}
        >
          Description
        </button>
      </div>

      {
        <div
          className="py-5"
          // open={desOpen}
          dangerouslySetInnerHTML={{
            __html: user?.user_appointment_form[0]?.descripiton,
          }}
        ></div>
      }

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_service/${user.user_appointment_form.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_service/${user.user_appointment_form.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default UserFormPk;
