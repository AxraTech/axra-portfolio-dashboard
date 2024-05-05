import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import RichTextEditor from "../../components/RichTextEditor";

import {
  EDIT_SERVICE_PACKAGE,
  SERVICE_PACKAGE_PK,
} from "../../gql/servicePackage";

const UpdateServicePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const { data: resService } = useQuery(SERVICE_PACKAGE_PK, {
    variables: { id: id },
  });
  // const [loadService, resService] = useLazyQuery(SERVICE_PACKAGE_PK, {
  //   variables: { id: id },
  // });

  // useEffect(() => {
  //   loadService();
  // }, [loadService]);

  useEffect(() => {
    if (resService) {
      setValues({
        id: resService?.service_package_by_pk?.id ?? "",
        one_time_package_price:
          resService?.service_package_by_pk?.one_time_package_price ?? "",
        recurrently_service_fee:
          resService?.service_package_by_pk?.recurrently_service_fee ?? "",
        service_package_type:
          resService?.service_package_by_pk?.service_package_type ?? "",
        service_package_description:
          resService?.service_package_by_pk?.service_package_description ?? "",
      });
      setDescription(
        resService?.service_package_by_pk?.service_package_description ?? ""
      );
    }
  }, []);

  // RTE
  const descriptionChange = (value) => {
    setValues({
      ...values,
      service_package_description:
        value?.data?.service_package_description?.toString("html"),
    });
    setDescription(value);
  };

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const [add_service] = useMutation(EDIT_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service upload error", err);
      alert("Service Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Service Package has been Updated");
      setValues({});
      setLoading(false);
    },
  });
  console.log("values =---mfsmf,sf", values);
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    // if (!values.service_name) {
    //   tempErrors.service_name = "Service Name field is required.";
    //   errorExist = true;
    // }
    // if (!values.service_package_description) {
    //   tempErrors.service_package_description = "Service Description field is required.";
    //   errorExist = true;
    // }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }
    console.log("values ============", values);
    try {
      await add_service({
        variables: {
          ...values,
          id: values?.id,
          one_time_package_price: values?.one_time_package_price,
          recurrently_service_fee: values?.recurrently_service_fee,
          service_package_description: description,
          service_package_type: values?.service_package_type,
        },
      });
      navigate("/service_package");
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form>
        {/* image upload */}
        {/* <div className="max-w-sm mx-auto mt-8">
          <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
            {selectedImage ? (
              <>
                <img
                  src={values.product_image_url}
                  alt="Uploaded preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={handleImageDelete}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <AiOutlineDelete className="w-6 h-6 text-red-600" />
                </button>
              </>
            ) : (
              <div className="text-center">
                <label htmlFor="upload" className="cursor-pointer">
                  <AiOutlineCloudUpload className="w-12 h-12 text-gray-500" />
                  <p className="text-gray-500 mt-2">Click to Upload</p>
                </label>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                />
              </div>
            )}
          </div>
          {errors.product_image_url && (
            <p className="text-red-500 mt-2 flex justify-center text-sm">
              {errors.product_image_url}
            </p>
          )}
        </div> */}
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 ">
          {/* package type */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Package Type
            </label>

            <input
              type="text"
              id="default-input"
              value={values?.service_package_type}
              onChange={handleChange("service_package_type")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.service_package_type && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.service_package_type}
              </p>
            )}
          </div>

          {/* package price */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Package Price
            </label>

            <input
              type="text"
              id="default-input"
              value={values?.one_time_package_price}
              onChange={handleChange("one_time_package_price")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.one_time_package_price && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.one_time_package_price}
              </p>
            )}

            {/* <select
              id="default"
              defaultValue=""
              value={values.fk_product_type}
              onChange={handleChange("fk_product_type")}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose Product</option>
              {data.product_model.length !== 0 &&
                data?.product_model?.map((row, index) => (
                  <option key={index} value={row.id}>
                    {row.model_name}
                  </option>
                ))}
            </select> */}
          </div>

          {/* Service Fee */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Service Fee
            </label>
            <input
              type="text"
              id="default-input"
              value={values?.recurrently_service_fee}
              onChange={handleChange("recurrently_service_fee")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.recurrently_service_fee && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.recurrently_service_fee}
              </p>
            )}
          </div>

          {/* Service description */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Service Package Description
            </label>
            <RichTextEditor value={description} onChange={descriptionChange} />
            {errors.service_package_description && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.service_package_description}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end my-5">
          {loading ? (
            <button
              type="button"
              className="flex items-center py-2 mt-5 px-4 bg-blue-700 text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-md px-4 py-2"
              disabled
            >
              Loading
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center py-2 mt-5 px-4 bg-blue-700 text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-md px-4 py-2"
              onClick={handleUpdate}
            >
              Update
            </button>
          )}
        </div>
      </form>
    </>
  );
};
export default UpdateServicePackage;
