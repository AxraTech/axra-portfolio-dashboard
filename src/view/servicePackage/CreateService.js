import { useMutation, useQuery } from "@apollo/client";
import imageService from "../../imageService/image";
import {
  ADD_PRODUCUT,
  MAIN_PRODUCT,
  PRODUCT_BRAND,
  PRODUCT_CATEGORY,
  PRODUCT_MODEL,
  SUB_PRODUCT,
} from "../../gql/product";
import { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import { useNavigate } from "react-router-dom";
import {
  ADD_SERVICE,
  SERVICE_DETAIL_NAME,
  SERVICE_PACKAGE,
} from "../../gql/serivce";
import { ADD_SERVICE_PACKAGE } from "../../gql/servicePackage";
const imageType = ["image/jpeg", "image/png"];
const CreateService = () => {
  const navigate = useNavigate();
  // const { data } = useQuery(PRODUCT_MODEL);

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState();

  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  //RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({
      ...values,
      service_package_description: value.toString("html"),
    });
  };

  //   const specificationChange = (value) => {
  //     setSpecification(value);
  //     setValues({ ...values, product_specification: value.toString("html") });
  //   };

  //   const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
  //     onError: (err) => {
  //       setLoading(false);
  //       console.log("Imge upload error", err);
  //       // alert("Image Upload Error");
  //     },
  //     onCompleted: (data) => {
  //       console.log("data", data);
  //       setLoading(false);
  //     },
  //   });

  //create products
  const [add_service] = useMutation(ADD_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service Package upload error", err);
      alert("Service Package  Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Service Package has been added");
      console.log("result", data);
      setValues({});
      setLoading(false);
    },
  });

  //   const [deleteImage] = useMutation(DELETE_IMAGE, {
  //     onError: (error) => {
  //       console.log("error : ", error);
  //       setLoading(false);
  //     },
  //   });

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
      await add_service({
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
  console.log("values", values);

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
              Create
            </button>
          )}
        </div>
      </form>
    </>
  );
};
export default CreateService;
