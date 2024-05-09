import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
// import DeleteProduct from "./DeleteProduct";
import { SERVICE_DETAIL_PK } from "../../gql/serviceDetail";
import { PRODUCT_BRAND_PK } from "../../gql/productBrand";

const ProductBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useQuery(PRODUCT_BRAND_PK, {
    variables: { id: id },
  });
  //   const [desOpen, setDesOpen] = useState(true);
  //   const [speOpen, setSpeOpen] = useState(false);
  //   const [Modelopen, setModelOpen] = useState(false);

  //   const handleDescription = () => {
  //     console.log("object");

  //     setDesOpen(true);
  //     setSpeOpen(false);
  //   };

  //   const handleSpecification = () => {
  //     setSpeOpen(true);
  //     setDesOpen(false);
  //   };

  if (!product) {
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
          <a href="/product_brand" className="hover:text-blue-600">
            {" "}
            / Product Brand Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        {/* <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={product?.product_brand_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div> */}
        {/* <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={service?.service_detail_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div> */}
        <div className=" col-span-2 p-4 px-10 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Service Name</p>
            <p className="px-3">-</p>
            <p>{product?.product_brand_by_pk?.brand_name}</p>
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
          Service Description
        </button>
      </div> */}

      {/* {desOpen && (
        <div
          className="py-5"
          open={desOpen}
          dangerouslySetInnerHTML={{
            __html: service?.service_detail_by_pk?.service_description,
          }}
        ></div>
      )} */}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(
              `/update_product_brand/${product?.product_brand_by_pk?.id}`
            )
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(
              `/delete_product_brand/${product?.product_brand_by_pk?.id}`
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
export default ProductBrand;
