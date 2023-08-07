import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import imageService from "../../imageService/image";
import {
  ADD_PRODUCUT,
  MAIN_PRODUCT,
  PRODUCT_BRAND,
  PRODUCT_CATEGORY,
  PRODUCT_MODEL,
  SUB_PRODUCT,
} from "../../gql/product";
import { useEffect, useLayoutEffect, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADD_SERVICE,
  SERVICE_DETAIL_NAME,
  SERVICE_PACKAGE,
} from "../../gql/serivce";
import {
  ADD_SERVICE_PACKAGE,
  EDIT_SERVICE_PACKAGE,
  SERVICE_PACKAGE_PK,
} from "../../gql/servicePackage";
const imageType = ["image/jpeg", "image/png"];
const CreateService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { data } = useQuery(PRODUCT_MODEL);

  const [loadService, resService] = useLazyQuery(SERVICE_PACKAGE_PK, {
    variables: { id: id },
  });
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [description, setDescription] = useState("");

  useEffect(() => {
    loadService();
  }, [loadService]);

  useEffect(() => {
    if (resService.data) {
      setValues({
        id: resService?.data?.service_package_by_pk.id ?? "",
        one_time_package_price:
          resService.data.service_package_by_pk.one_time_package_price ?? "",
        recurrently_service_fee:
          resService.data.service_package_by_pk.recurrently_service_fee ?? "",
        service_package_description:
          resService.data.service_package_by_pk.service_package_description ??
          "",
        service_package_type:
          resService.data.service_package_by_pk.service_package_type ?? "",
      });
      setDescription(
        resService?.data.service_package_by_pk?.service_package_description ??
          ""
      );
    }
  }, [resService]);

  //RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({
      ...values,
      service_package_description: value.toString("html"),
    });
  };

  //create products
  const [edit_service] = useMutation(EDIT_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service Package error", err);
      alert("Service Package  Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Service Package has been updated");
      console.log("result", data);
      setValues({});
      setLoading(false);
    },
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.one_time_package_price) {
      tempErrors.one_time_package_price = "Package Price field is required.";
      errorExist = true;
    }
    if (!values.recurrently_service_fee) {
      tempErrors.recurrently_service_fee = "Service Fee field is required.";
      errorExist = true;
    }
    if (!values.service_package_description) {
      tempErrors.service_package_description =
        "Service Description field is required.";
      errorExist = true;
    }
    if (!values.service_package_type) {
      tempErrors.service_package_type = "Package Type field is required.";
      errorExist = true;
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      await edit_service({
        variables: {
          ...values,
        },
      });
      navigate("/service_package");
      console.log("after create");
    } catch (err) {
      console.log("Error", err);
      console.log("errrrrrrror");
    }
  };
  if (!resService) {
    return null;
  }

  return (
    <>
      <form>
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 ">
          {/* package type */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Package Type
            </label>

            <input
              type="text"
              id="default-input"
              value={values.service_package_type}
              onChange={handleChange("service_package_type")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          {/* package price */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Package Price
            </label>

            <input
              type="text"
              id="default-input"
              value={values.one_time_package_price}
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
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Service Fee
            </label>
            <input
              type="text"
              id="default-input"
              value={values.recurrently_service_fee}
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
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
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
              onClick={handleCreate}
            >
              Update
            </button>
          )}
        </div>
      </form>
    </>
  );
};
export default CreateService;
