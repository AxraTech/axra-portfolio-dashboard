import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
import { format } from "date-fns";

import { APPOINTMENT_BY_PK } from "../../gql/userAppointmentForm";

const Appointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appointmentForm } = useQuery(APPOINTMENT_BY_PK, {
    variables: { id: id },
  });

  if (!appointmentForm) {
    return;
  }
  const app = appointmentForm?.user_appointment_form[0];
  return (
    <>
      <div className="my-5">
        <span>
          <a href="/" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/Appointment" className="hover:text-blue-600">
            {" "}
            / User Appointment Form Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className=" col-span-2 p-4 px-10 ">
          {/* staff Name */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Company Name</p>
            <p className="px-3">-</p>
            <p>{app?.company_name}</p>
          </div>
          {/*  date time */}
          <div className="flex gap-3 my-8">
            <p className="w-36">DateTime</p>
            <p className="px-3">-</p>
            <p> {format(new Date(app?.date_time), "yyyy-MM-dd hh:mm:ss a")}</p>
          </div>
          {/* phone */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Phone</p>
            <p className="px-3">-</p>
            <p>{app?.phone}</p>
          </div>
          {/* email*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Email</p>
            <p className="px-3">-</p>
            <p>{app?.email}</p>
          </div>
          {/* description*/}
          <div className="flex gap-3 my-8">
            <p className="w-36">Descripiton</p>
            <p className="px-3">-</p>
            <p>{app?.descripiton}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-x-10 py-5">
        <button
          onClick={() => navigate(`/deleteAppointment/${app?.id}`)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default Appointment;
