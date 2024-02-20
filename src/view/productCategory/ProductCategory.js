import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";
// import DeleteProduct from "./DeleteProduct";
import { SERVICE_DETAIL_PK } from "../../gql/serviceDetail";
import { PRODUCT_BRAND_PK } from "../../gql/productBrand";
import { PRODUCT_CAT_PK } from "../../gql/productCategory";

const ProductCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useQuery(PRODUCT_CAT_PK, {
    variables: { id: id },
  });

  if (!product) {
    return;
  }
  console.log("product cat", product);

  return (
    <>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={product?.product_category_by_pk?.image_url}
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
            <p className="w-36">Product Category Name</p>
            <p className="px-3">-</p>
            <p>{product?.product_category_by_pk?.product_category_name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(
              `/update_product_cat/${product?.product_category_by_pk?.id}`
            )
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(
              `/delete_product_cat/${product?.product_category_by_pk?.id}`
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
export default ProductCategory;
