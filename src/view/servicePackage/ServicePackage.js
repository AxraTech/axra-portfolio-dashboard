import { useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { SERVICE_PACKAGE_PK } from "../../gql/servicePackage";
import DeleteServicePackageDetail from "./DeleteServicePackageDetail";

const ServicePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [packages, setPackages] = useState();
  const { data: service } = useQuery(SERVICE_PACKAGE_PK, {
    variables: { id: id },
  });

  const handleRemoveOpen = (data) => {
    setOpen(true);
    setPackages(data);
  };
  const handleRemoveClose = () => {
    setOpen(false);
  };
  if (!service) {
    return;
  }
  const serviceDetail = service?.service_packages_by_pk;
  return (
    <>
      <div className="my-5 font-bold">
        <span>
          <a href="/appointment" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/service_package" className="hover:text-blue-600">
            {" "}
            / Service Package Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div>
        <div className=" col-span-2 ">
          {/* category */}
          <div className="flex gap-x-3 mb-3 ">
            <p className="w-36 font-medium">Category</p>
            <p className="px-3">-</p>
            <p>
              {
                serviceDetail?.service_details_packages[0]
                  ?.service_details_packages?.service_category?.service_name
              }
            </p>
          </div>
          {/* Package Type */}
          <div className="flex gap-x-3">
            <p className="w-36  font-medium">Package Type</p>
            <p className="px-3">-</p>
            <p>{serviceDetail?.service_package_type}</p>
          </div>

          {/* package price */}
          <div className="flex gap-3 my-8">
            <p className="w-36  font-medium">Service Package Price</p>
            <p className="px-3">-</p>
            <p>{serviceDetail?.one_time_package_price}</p>
          </div>

          {/* service fee */}
          <div className="flex gap-3 my-8">
            <p className="w-36  font-medium">Service Package Fee</p>
            <p className="px-3">-</p>
            <p>{serviceDetail?.recurrently_service_fee}</p>
          </div>

          {/* service package Name */}
          <div className="flex gap-3 my-8">
            <p className="w-36  font-medium">Service Package Name</p>
            <p className="px-3">-</p>
            <p>{serviceDetail?.service_package_name}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-x-10 mt-10">
        <button
          // className={` font-medium  border-b border-black ${
          //   speOpen ? "border-b border-blue-500" : "border-b border-black"
          // }`}
          className={` font-medium  border-b border-black`}
        >
          Service Package Description
        </button>
      </div>

      {
        <div
          className="py-5"
          // open={desOpen}
          dangerouslySetInnerHTML={{
            __html: serviceDetail?.service_package_description,
          }}
        ></div>
      }

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() => navigate(`/update_service/${serviceDetail?.id}`)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemoveOpen(service)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      {open && (
        <DeleteServicePackageDetail
          packageId={packages}
          handleDelClose={handleRemoveClose}
        />
      )}
    </>
  );
};
export default ServicePackage;
