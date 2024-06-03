import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import {
  ADD_SERVICE_PACKAGE,
  SERVICE_PACKAGE_DETAILS,
} from "../../gql/servicePackage";
import RichTextEditor from "../../components/RichTextEditor";
import {
  SERVICE_CAT,
  SERVICE_CAT_BY_NAME,
} from "../../gql/mixedServiceCategory";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
const imageType = ["image/jpeg", "image/png"];
const CreateService = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const { data: serviceCatByName } = useQuery(SERVICE_CAT_BY_NAME, {
    variables: { service_name: selectedCategory },
  });
  const { data: serviceCat } = useQuery(SERVICE_CAT);

  const descriptionChange = (value) => {
    setDescription(value);
    setValues({
      ...values,
      service_package_description: value.toString("html"),
    });
  };

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Imge upload error", err);
      // alert("Image Upload Error");
    },
    onCompleted: (data) => {
      setLoading(false);
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setSelectedImage(img);
      setValues({ ...values, package_name_icon: URL.createObjectURL(img) });
      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          package_name_icon: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          package_name_icon: "Image size must be smaller than 10MB",
        });
        return;
      }
    }
  };

  const handleImageDelete = async () => {
    if (values.package_name_icon) {
      try {
        // setLoading(true);

        const imageName = values?.package_name_icon.split("/").pop();
        await deleteImage({ variables: { image_name: imageName } });
        setSelectedImage(null);
        setValues({ ...values, package_name_icon: "" });
        setLoading(false);
      } catch (error) {
        console.log("Error deleting image:", error);
        setLoading(false);
      }
    }
  };
  const [add_service_package_details] = useMutation(SERVICE_PACKAGE_DETAILS, {
    onError: (err) => {
      alert("Service Package Details Error");
    },
    onCompleted: (data) => {
      console.log("Service Package Details upload done");
    },
  });
  console.log("caegor y", serviceCatByName?.service_details);
  const [add_service] = useMutation(ADD_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service Package upload error", err);
      alert("Service Package Error");
      setLoading(false);
    },
    onCompleted: async (data) => {
      await add_service_package_details({
        variables: {
          fk_service_details_id: serviceCatByName?.service_details[0]?.id,
          fk_service_packages_id: data?.insert_service_packages_one?.id,
        },
      });
      alert("New Service Package has been added");
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
    if (!values.package_name_icon) {
      tempErrors.package_name_icon = "Package Icon field is required.";
      errorExist = true;
    }
    if (!selectedCategory) {
      setCategoryError("Please select a service category.");
      setLoading(false);
      return;
    } else {
      setCategoryError("");
    }
    if (selectedCategory === "Web Design & Development") {
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
    } else {
      if (!values.service_package_description) {
        tempErrors.service_package_description =
          "Service Description field is required.";
        errorExist = true;
      }

      if (!values.service_package_name) {
        tempErrors.service_package_name = "Package Name field is required.";
        errorExist = true;
      }
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      const res = await getImageUrl({ variables: { contentType: "image/*" } });

      await imageService.uploadImage(
        res.data.getImageUploadUrl.imageUploadUrl,
        selectedImage
      );
      if (selectedCategory === "Web Design & Development") {
        await add_service({
          variables: {
            ...values,
            service_package_name: null,
            package_name_icon: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`,
          },
        });
      } else {
        await add_service({
          variables: {
            ...values,
            one_time_package_price: null,
            service_package_type: null,
            recurrently_service_fee: null,
            package_name_icon: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`,
          },
        });
      }

      navigate("/service_package");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {/* image upload */}
      <div className="max-w-sm mx-auto my-4 mt-0">
        <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
          {selectedImage ? (
            <>
              <img
                src={values?.package_name_icon}
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

        {errors.package_name_icon && (
          <p className="text-red-500 mt-2 flex justify-center text-sm">
            {errors.package_name_icon}
          </p>
        )}
      </div>
      <div className="flex items-center mb-8">
        {serviceCat?.service_categories.map((cat, index) => (
          <div key={index} className="mx-3">
            <input
              id={`radio-${index}`}
              type="radio"
              name="service-category"
              value={cat?.service_name}
              onChange={() => handleCategoryChange(cat?.service_name)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`radio-${index}`}
              className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500"
            >
              {cat?.service_name}
            </label>
          </div>
        ))}
        {categoryError && (
          <p className="text-red-500 mt-2 text-sm">{categoryError}</p>
        )}
      </div>

      <form>
        {selectedCategory === "Web Design & Development" ? (
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

            {/*one time package price */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                One Time Package Price
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
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Package Description
              </label>
              <RichTextEditor
                value={description}
                onChange={descriptionChange}
              />
              {errors.service_package_description && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 ">
            {/* package type */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Package Name
              </label>

              <input
                type="text"
                id="default-input"
                value={values.service_package_name}
                onChange={handleChange("service_package_name")}
                className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.service_package_name && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_name}
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
              <RichTextEditor
                value={description}
                onChange={descriptionChange}
              />
              {errors.service_package_description && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_description}
                </p>
              )}
            </div>
          </div>
        )}

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
