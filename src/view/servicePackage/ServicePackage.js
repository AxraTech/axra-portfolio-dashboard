import { useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { SERVICE_PACKAGE_PK } from "../../gql/servicePackage";

const ServicePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service } = useQuery(SERVICE_PACKAGE_PK, {
    variables: { id: id },
  });
  console.log("servie", service);
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);

  const handleSpecification = () => {
    setSpeOpen(true);
    setDesOpen(false);
  };

  if (!service) {
    return;
  }

  return (
    <>
      <div className="grid grid-cols-3">
        <div className=" col-span-2 ">
          {/* Package Type */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Package Type</p>
            <p className="px-3">-</p>
            <p>{service?.service_package_by_pk?.service_package_type}</p>
          </div>

          {/* package price */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Service Package Price</p>
            <p className="px-3">-</p>
            <p>{service?.service_package_by_pk?.one_time_package_price}</p>
          </div>

          {/* service fee */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Service Package Fee</p>
            <p className="px-3">-</p>
            <p>{service?.service_package_by_pk?.recurrently_service_fee}</p>
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
          Service Package Description
        </button>
      </div>

      {
        <div
          className="py-5"
          // open={desOpen}
          dangerouslySetInnerHTML={{
            __html: service?.service_package_by_pk?.service_package_description,
          }}
        ></div>
      }

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_service/${service.service_package_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_service/${service.service_package_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default ServicePackage;
