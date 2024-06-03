import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import {
  ADD_SERVICE_PACKAGE,
  ALL_SERVICE_PACKAGE,
  DELETE_SERVICE_DETIAILS_PACKAGE,
  EDIT_SERVICE_PACKAGE,
  SERVICE_PACKAGE_DETAILS,
  SERVICE_PACKAGE_PK,
} from "../../gql/servicePackage";
import RichTextEditor from "../../components/RichTextEditor";
import {
  SERVICE_CAT,
  SERVICE_CAT_BY_NAME,
} from "../../gql/mixedServiceCategory";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import imageService from "../../imageService/image";
const imageType = ["image/jpeg", "image/png"];

const UpdateService = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReplacementImage, setSelectedReplacementImage] =
    useState(null);
  const { data: serviceCat, refetch: refetchServiceCat } =
    useQuery(SERVICE_CAT);
  console.log("selected category ", selectedCategory);
  const { data: serviceCatByName, refetch: refetchServiceCatByName } = useQuery(
    SERVICE_CAT_BY_NAME,
    {
      variables: {
        service_name: selectedCategory ? selectedCategory : "",
      },
    }
  );
  const { data: servicePackage, refetch: refetchServicePackage } = useQuery(
    SERVICE_PACKAGE_PK,
    {
      variables: { id: id },
    }
  );

  useEffect(() => {
    if (servicePackage) {
      const packages = servicePackage?.service_packages_by_pk;
      setValues({
        id: packages?.id,
        one_time_package_price: packages?.one_time_package_price,
        recurrently_service_fee: packages?.recurrently_service_fee,
        service_package_description: packages?.service_package_description,
        service_package_name: packages?.service_package_name,
        service_package_type: packages?.service_package_type,
        package_name_icon: packages?.package_name_icon,
      });
      setDescription(packages?.service_package_description);
      setSelectedCategory(
        packages?.service_details_packages[0]?.service_details_packages
          ?.service_category?.service_name
      );
    }
  }, [
    servicePackage?.service_packages_by_pk?.id,
    servicePackage?.service_packages_by_pk?.one_time_package_price,
    servicePackage?.service_packages_by_pk?.recurrently_service_fee,
    servicePackage?.service_packages_by_pk?.service_package_description,
    servicePackage?.service_packages_by_pk?.service_package_name,
    servicePackage?.service_packages_by_pk?.service_package_type,
    servicePackage?.service_packages_by_pk?.package_name_icon,
  ]);

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
      console.log("Image upload error", err);
      // alert("Image Upload Error");
    },
    onCompleted: (data) => {
      setLoading(false);
      // setImageFileUrl(data.getImageUploadUrl.imageUploadUrl);
      // setValues({
      //   ...values,
      //   package_name_icon: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${data.getImageUploadUrl.imageName}`,
      // });
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
    // onCompleted: () => {
    //   alert("Image Deleted");
    // },
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setSelectedImage(img);
      setValues({
        ...values,
        package_name_icon: URL.createObjectURL(img),
      });

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
    // If there's an existing image, delete it
    if (values.package_name_icon) {
      try {
        setLoading(true);
        // Extract the imageName from the package_name_icon
        const imageName = values.package_name_icon.split("/").pop();

        await deleteImage({ variables: { image_name: imageName } });
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
    refetchQueries: [ADD_SERVICE_PACKAGE],
  });
  const [delete_service_details_package] = useMutation(
    DELETE_SERVICE_DETIAILS_PACKAGE,
    {
      onError: (err) => {
        console.log("delete error ", err);
      },
    }
  );
  console.log("service cat by name ", serviceCatByName);
  console.log("service details id ", serviceCatByName?.service_details[0]?.id);
  const [edit_service] = useMutation(EDIT_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service Package upload error", err);
      alert("Service Package Error");
      setLoading(false);
    },
    onCompleted: async (data) => {
      const updatedPackageId = data?.update_service_packages_by_pk?.id;
      await delete_service_details_package({
        variables: {
          fk_service_packages_id: data?.update_service_packages_by_pk?.id,
        },
      });
      await add_service_package_details({
        variables: {
          fk_service_details_id:
            serviceCatByName && serviceCatByName?.service_details[0]?.id,
          fk_service_packages_id: updatedPackageId,
        },
      });
      // Refetch necessary queries
      await refetchServiceCat();
      await refetchServicePackage();
      await refetchServiceCatByName();
      alert("Update done");
      setValues({});
      setLoading(false);
    },
    refetchQueries: [ALL_SERVICE_PACKAGE],
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};

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
      const updatedValues = { ...values };

      if (selectedReplacementImage) {
        const res = await getImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          res.data.getImageUploadUrl.imageUploadUrl,
          selectedReplacementImage
        );
        updatedValues.package_name_icon = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      } else if (selectedImage) {
        const res = await getImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          res.data.getImageUploadUrl.imageUploadUrl,
          selectedImage
        );
        updatedValues.package_name_icon = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      }

      if (selectedCategory === "Web Design & Development") {
        await edit_service({
          variables: {
            ...updatedValues,
            fk_service_packages_id:
              servicePackage?.service_details_packages_by_pk?.id,
            service_package_name: null,
            service_package_type: values?.service_package_type,
          },
        });
      } else {
        await edit_service({
          variables: {
            ...updatedValues,
            fk_service_packages_id:
              servicePackage?.service_details_packages_by_pk?.id,
            one_time_package_price: null,
            service_package_type: null,
            recurrently_service_fee: null,
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

  if (!serviceCatByName || !serviceCat) {
    return "";
  }
  {
    console.log("service cat ", serviceCat);
  }
  return (
    <>
      <div className="flex items-center justify-center h-60 w-2/4 mx-auto bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative my-4">
        {selectedReplacementImage ? (
          <>
            <img
              src={URL.createObjectURL(selectedReplacementImage)}
              alt="Replacement preview"
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => setSelectedReplacementImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <AiOutlineDelete className="w-6 h-6 text-red-600" />
            </button>
          </>
        ) : values.package_name_icon ? (
          <>
            <img
              src={values.package_name_icon}
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

      <div className="flex items-center mb-8">
        {serviceCat &&
          serviceCat?.service_categories.map((cat, index) => (
            <div key={index} className="mx-3">
              <input
                id={`radio-${index}`}
                type="radio"
                name="service-category"
                value={cat?.service_name}
                checked={selectedCategory === cat?.service_name}
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
            {/* package name */}
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
                value={values?.service_package_name}
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

export default UpdateService;
