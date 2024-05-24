import { useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";

// import DeleteProduct from "./DeleteProduct";

import { SERVICE_CATEGORY_BY_PK } from "../../gql/serviceCategory";
import ServiceDetails from "../serviceDetail/ServiceDetails";
import { useState } from "react";
import DeleteServiceCategory from "../../view/serviceCategory/DeleteServiceCategory";
const ServiceCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState();
  const { data: service } = useQuery(SERVICE_CATEGORY_BY_PK, {
    variables: { id: id },
  });

  const handleOpen = (data) => {
    setOpen(true);
    setCat(data);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (!service) {
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
          <a href="/service_cat" className="hover:text-blue-600">
            {" "}
            / Service Category Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_categories_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        {/* <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_detail_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div> */}
        <div className=" col-span-2 p-4 px-10 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Serivce Category Name</p>
            <p className="px-3">-</p>
            <p>{service?.service_categories_by_pk?.service_name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(
              `/update_service_cat/${service?.service_categories_by_pk?.id}`
            )
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          // onClick={() =>
          //   navigate(
          //     `/delete_service_cat/${service?.service_categories_by_pk?.id}`
          //   )
          // }
          onClick={() => handleOpen(service)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <ServiceDetails catId={id} />

      {open && <DeleteServiceCategory catId={cat} handleClose={handleClose} />}
    </>
  );
};
export default ServiceCategory;
