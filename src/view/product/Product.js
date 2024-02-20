import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useQuery(PRODUCT_PK, { variables: { id: id } });
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);
  const [Modelopen, setModelOpen] = useState(false);

  const handleDescription = () => {
    setDesOpen(true);
    setSpeOpen(false);
  };

  const handleSpecification = () => {
    setSpeOpen(true);
    setDesOpen(false);
  };

  if (!product) {
    return;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={product?.product_model_by_pk?.product_image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-2 p-4 px-10 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Product Category</p>
            <p className="px-3">-</p>
            <p>
              {
                product?.product_model_by_pk?.product_model_category
                  ?.product_category_name
              }
            </p>
          </div>
          {/* brand */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Product Brand</p>
            <p className="px-3">-</p>
            <p>
              {product?.product_model_by_pk?.product_model_brand?.brand_name}
            </p>
          </div>
          {/* model */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Product Model</p>
            <p className="px-3">-</p>
            <p>{product?.product_model_by_pk?.model_name}</p>
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
      </div>

      {desOpen && (
        <div
          className="py-5"
          open={desOpen}
          dangerouslySetInnerHTML={{
            __html: product?.product_model_by_pk?.product_description,
          }}
        ></div>
      )}
      {speOpen && (
        <div
          className="py-5"
          open={speOpen}
          dangerouslySetInnerHTML={{
            __html: product?.product_model_by_pk?.product_specification,
          }}
        ></div>
      )}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_product/${product.product_model_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_product/${product.product_model_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default Product;
