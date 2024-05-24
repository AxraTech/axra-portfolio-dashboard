import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";

import { CONTACT_PK } from "../../gql/contact";

const Contact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contact } = useQuery(CONTACT_PK, { variables: { id: id } });

  if (!contact) {
    return;
  }

  // Convert 24-hour format to 12-hour format with AM/PM indicators
  function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":");
    let period = "AM";

    let hoursIn12HourFormat = parseInt(hours, 10);
    if (hoursIn12HourFormat >= 12) {
      period = "PM";
      hoursIn12HourFormat =
        hoursIn12HourFormat === 12 ? 12 : hoursIn12HourFormat - 12;
    } else {
      hoursIn12HourFormat =
        hoursIn12HourFormat === 0 ? 12 : hoursIn12HourFormat;
    }

    return `${hoursIn12HourFormat}:${minutes} ${period}`;
  }

  const formattedStartTime = convertTo12HourFormat(
    contact?.contact_by_pk.start_time
  );
  const formattedEndTime = convertTo12HourFormat(
    contact?.contact_by_pk.end_time
  );

  return (
    <>
      <div className="my-5">
        <span>
          <a href="/appointment" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/contact" className="hover:text-blue-600">
            {" "}
            / Contact Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={contact?.contact_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-2 p-4 px-10 ">
          {/* phone */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Phone</p>
            <p className="px-3">-</p>
            <p>{contact?.contact_by_pk?.phone}</p>
          </div>
          {/* email */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Email</p>
            <p className="px-3">-</p>
            {console.log("email --------", contact?.contact_by_pk?.email)}
            <p>{contact?.contact_by_pk?.email}</p>
          </div>
          {/* start time */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Opening Time</p>
            <p className="px-3">-</p>
            <p>{formattedStartTime}</p>
          </div>
          {/* end time */}

          <div className="flex gap-3 my-8">
            <p className="w-36">Closing Time</p>
            <p className="px-3">-</p>
            <p>{formattedEndTime}</p>
          </div>
        </div>
      </div>
      {/* <div className="flex gap-x-10 mt-10">
        <button
          className={`${
            desOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleDescription}
        >
          Description
        </button>
        <button
          className={`${
            speOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleSpecification}
        >
          Specification
        </button>
      </div> */}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_contact/${contact?.contact_by_pk?.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_contact/${contact?.contact_by_pk?.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default Contact;
