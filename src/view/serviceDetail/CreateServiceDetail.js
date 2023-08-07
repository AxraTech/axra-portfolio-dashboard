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
import { ADD_SERVICE_DETAIL } from "../../gql/serviceDetail";
const imageType = ["image/jpeg", "image/png"];
const CreateServiceDetail = () => {
  const navigate = useNavigate();
  // const { data } = useQuery(PRODUCT_MODEL);

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [description, setDescription] = useState("");

  const [selectedBannerImage, setSelectedBannerImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  //RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({ ...values, service_description: value.toString("html") });
  };

  const [getBannerImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Imge upload error", err);
    },

    onCompleted: (data) => {
      setLoading(false);
    },
  });

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Imge upload error", err);
    },

    onCompleted: (data) => {
      setLoading(false);
    },
  });

  //create products
  const [add_service] = useMutation(ADD_SERVICE_DETAIL, {
    onError: (err) => {
      console.log("Service upload error", err);
      alert("Service Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Service has been added");
      console.log("result mmmmmmmmmmmm", data);
      setValues({});
      setLoading(false);
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleBannerImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];

      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          banner_image_url: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          banner_image_url: "Image size must be smaller than 10MB",
        });
        return;
      }
      setSelectedBannerImage(img);
      setValues({ ...values, banner_image_url: URL.createObjectURL(img) });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];

      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          image_url: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          image_url: "Image size must be smaller than 10MB",
        });
        return;
      }
      setSelectedImage(img);
      setValues({ ...values, image_url: URL.createObjectURL(img) });
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
  };

  const handleBannerImageDelete = () => {
    setSelectedBannerImage(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.banner_image_url) {
      tempErrors.banner_image_url = "Banner Image field is required.";
      errorExist = true;
    }
    // if (!values.image_url) {
    //   tempErrors.image_url = "Image field is required.";
    //   errorExist = true;
    // }
    if (!values.service_name) {
      tempErrors.service_name = "Service Name field is required.";
      errorExist = true;
    }
    if (!values.service_description) {
      tempErrors.service_description = "Service Description field is required.";
      errorExist = true;
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      const bannerImageUrl = await getBannerImageUrl({
        variables: { contentType: "image/*" },
      });
      console.log("banner iamge url", bannerImageUrl);
      const imageUrl = await getImageUrl({
        variables: { contentType: "image/*" },
      });
      console.log("image url", imageUrl);

      await imageService.uploadImage(
        bannerImageUrl.data.getImageUploadUrl.imageUploadUrl,
        selectedBannerImage
      );

      const image = await imageService.uploadImage(
        imageUrl.data.getImageUploadUrl.imageUploadUrl,
        selectedImage
      );

      await add_service({
        variables: {
          ...values,
          banner_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${bannerImageUrl.data.getImageUploadUrl.imageName}`,
          image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${imageUrl.data.getImageUploadUrl.imageName}`,
        },
      });
      navigate("/service_detail");
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <>
      <form>
        <div className="flex justify-center gap-x-10 mt-8">
          {/*banner image upload */}
          <div className="w-full  mx-auto ">
            <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
              {selectedBannerImage ? (
                <>
                  <img
                    src={values.banner_image_url}
                    alt="Uploaded preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleBannerImageDelete}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <AiOutlineDelete className="w-6 h-6 m-auto text-red-600" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <label htmlFor="upload" className="cursor-pointer">
                    <AiOutlineCloudUpload className="w-12 h-12 m-auto text-gray-500" />
                    <p className="text-gray-500 mt-2">
                      Click to Upload Banner Image
                    </p>
                  </label>
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                    className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                  />
                </div>
              )}
            </div>
            {errors.banner_image_url && (
              <p className="text-red-500 mt-2 flex justify-center text-sm">
                {errors.banner_image_url}
              </p>
            )}
          </div>

          {/* image upload */}
          <div className="w-full mx-auto">
            <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
              {selectedImage ? (
                <>
                  <img
                    src={values.image_url}
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
                    <AiOutlineCloudUpload className="w-12 h-12 m-auto text-gray-500" />
                    <p className="text-gray-500 mt-2">Click to Upload Image</p>
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
            {errors.image_url && (
              <p className="text-red-500 mt-2 flex justify-center text-sm">
                {errors.image_url}
              </p>
            )}
          </div>
        </div>
        <div className="w-full gap-x-10 gap-y-3 flex justify-between mt-10">
          {/* Service Name */}
          <div className="w-full">
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Service Name
            </label>
            <input
              type="text"
              id="default-input"
              value={values.service_name}
              onChange={handleChange("service_name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.service_name && (
              <p className="text-red-500 mt-2 text-sm">{errors.service_name}</p>
            )}
          </div>

          <div></div>

          {/* service description */}
          <div className="w-full">
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Service Description
            </label>
            <RichTextEditor value={description} onChange={descriptionChange} />
            {errors.service_description && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.service_description}
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
export default CreateServiceDetail;
