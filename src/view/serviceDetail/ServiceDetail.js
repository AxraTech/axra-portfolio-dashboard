import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
// import DeleteProduct from "./DeleteProduct";
import { SERVICE_DETAIL_PK } from "../../gql/serviceDetail";

import UpdateServiceDetails from "../../view/serviceDetail/UpdateServiceDetail";

import DeleteServiceDetail from "./DeleteServiceDetail";
import ServiceDetailPackages from "../../view/serviceDetailPackage/ServiceDetailPackages";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service } = useQuery(SERVICE_DETAIL_PK, {
    variables: { id: id },
  });

  const [desOpen, setDesOpen] = useState(true);
  const [desOneOpen, setDesOneOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [details, setDetails] = useState();
  const [serviceDetails, setServiceDetails] = useState();
  const handleDescription = () => {
    setDesOpen(true);
    setDesOneOpen(false);
  };
  const handleSpecification = () => {
    setDesOneOpen(true);
    setDesOpen(false);
  };
  const handleOpen = (data) => {
    setServiceDetails(data);
    setOpen(true);
  };
  const handleDelOpen = (data) => {
    setDelOpen(true);
    setDetails(data);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };
  const handleClose = (data) => {
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
          <a href="/service_detail" className="hover:text-blue-600">
            {" "}
            / Service Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_details_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-1 p-4 px-3 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p>Service Name</p>
            <p className="px-3">-</p>
            <p>
              {service?.service_details_by_pk?.service_category?.service_name}
            </p>
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

        <button
          className={`${
            desOneOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleSpecification}
        >
          Service Description One
        </button>
      </div>

      {desOpen && (
        <div
          className="py-5"
          open={desOpen}
          dangerouslySetInnerHTML={{
            __html: service?.service_details_by_pk?.service_description,
          }}
        ></div>
      )}

      {desOneOpen && (
        <div
          className="py-5"
          open={desOneOpen}
          dangerouslySetInnerHTML={{
            __html: service?.service_details_by_pk?.service_description_one,
          }}
        ></div>
      )}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          // onClick={() =>
          //   navigate(
          //     `/service_cat/${serviceCat?.service_categories[0]?.id}/${service?.service_details_by_pk?.id}/update_service_detail`
          //   )
          // }
          onClick={() => handleOpen(service)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelOpen(service)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <ServiceDetailPackages serviceId={service?.service_details_by_pk?.id} />
      {open && (
        <UpdateServiceDetails
          handleClose={handleClose}
          serviceDetails={serviceDetails}
        />
      )}
      {delOpen && (
        <DeleteServiceDetail
          detailId={details}
          handleDelClose={handleDelClose}
        />
      )}
    </>
  );
};
export default ServiceDetail;
