import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
// import DeleteProduct from "./DeleteProduct";
import { SERVICE_DETAIL_PK } from "../../gql/serviceDetail";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service } = useQuery(SERVICE_DETAIL_PK, {
    variables: { id: id },
  });
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);
  const [Modelopen, setModelOpen] = useState(false);

  const handleDescription = () => {
    console.log("object");

    setDesOpen(true);
    setSpeOpen(false);
  };

  const handleSpecification = () => {
    setSpeOpen(true);
    setDesOpen(false);
  };

  if (!service) {
    return;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_detail_by_pk?.banner_image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_detail_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-1 p-4 px-10 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Service Name</p>
            <p className="px-3">-</p>
            <p>{service?.service_detail_by_pk?.service_name}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-x-10 mt-10">
        <button
          className={`${
            desOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleDescription}
        >
          Service Description
        </button>
      </div>

      {desOpen && (
        <div
          className="py-5"
          open={desOpen}
          dangerouslySetInnerHTML={{
            __html: service?.service_detail_by_pk?.service_description,
          }}
        ></div>
      )}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(
              `/update_service_detail/${service?.service_detail_by_pk?.id}`
            )
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(
              `/delete_service_detail/${service?.service_detail_by_pk?.id}`
            )
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default ServiceDetail;
