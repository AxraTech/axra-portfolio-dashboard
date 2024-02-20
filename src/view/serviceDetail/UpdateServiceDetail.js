import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import imageService from "../../imageService/image";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import {
  EDIT_SERVICE_DETAIL,
  SERVICE_DETAIL_PK,
} from "../../gql/serviceDetail";

const imageType = ["image/jpeg", "image/png"];

const UpdateServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [description, setDescription] = useState("");
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [loadService, resService] = useLazyQuery(SERVICE_DETAIL_PK, {
    variables: { id: id },
  });

  useEffect(() => {
    loadService();
  }, [loadService]);

  useEffect(() => {
    if (resService.data) {
      setValues({
        id: resService.data.service_detail_by_pk.id ?? "",
        banner_image_url:
          resService.data.service_detail_by_pk.banner_image_url ?? "",
        image_url: resService.data.service_detail_by_pk.image_url ?? "",
        service_description:
          resService.data.service_detail_by_pk.service_description ?? "",
        service_name: resService.data.service_detail_by_pk.service_name ?? "",
      });
      setDescription(
        resService.data.service_detail_by_pk.service_description ?? ""
      );
    }
  }, [resService.data]);

  // RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({ ...values, service_description: value.toString("html") });
  };

  const [getBannerImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Image upload error", err);
    },

    onCompleted: (data) => {
      setLoading(false);
    },
  });

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Image upload error", err);
    },

    onCompleted: (data) => {
      setLoading(false);
    },
  });

  const [add_service] = useMutation(EDIT_SERVICE_DETAIL, {
    onError: (err) => {
      console.log("Service upload error", err);
      alert("Service Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Service has been Updated");
      console.log("result", data);
      setValues({});
      setLoading(false);
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("Error: ", error);
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
          banner_image_url: "Please select an image (png, jpeg).",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          banner_image_url: "Image size must be smaller than 10MB.",
        });
        return;
      }
      setNewBannerImage(img);
      setValues({ ...values, banner_image_url: URL.createObjectURL(img) });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];

      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          image_url: "Please select an image (png, jpeg).",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          image_url: "Image size must be smaller than 10MB.",
        });
        return;
      }
      setNewImage(img);
      setValues({ ...values, image_url: URL.createObjectURL(img) });
    }
  };

  const handleNewBannerImageDelete = () => {
    setNewBannerImage(null);
    setValues({ ...values, banner_image_url: "" });
  };

  const handleNewImageDelete = () => {
    setNewImage(null);
    setValues({ ...values, image_url: "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    // if (!values.service_name) {
    //   tempErrors.service_name = "Service Name field is required.";
    //   errorExist = true;
    // }
    // if (!values.service_description) {
    //   tempErrors.service_description = "Service Description field is required.";
    //   errorExist = true;
    // }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      // Upload new banner image if selected
      if (newBannerImage) {
        const bannerImageUrl = await getBannerImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          bannerImageUrl.data.getImageUploadUrl.imageUploadUrl,
          newBannerImage
        );
        setValues({
          ...values,
          banner_image_url: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${bannerImageUrl.data.getImageUploadUrl.imageName}`,
        });
      }

      // Upload new image if selected
      if (newImage) {
        const imageUrl = await getImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          imageUrl.data.getImageUploadUrl.imageUploadUrl,
          newImage
        );
        setValues({
          ...values,
          image_url: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${imageUrl.data.getImageUploadUrl.imageName}`,
        });
      }

      await add_service({
        variables: {
          ...values,
        },
      });
      navigate("/service_detail");
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form>
        <div className="flex justify-center gap-x-10 mt-8">
          {/* Existing banner image */}
          <div className="w-full  mx-auto ">
            <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
              {values.banner_image_url ? (
                <div>
                  <img
                    src={values.banner_image_url}
                    alt="Existing banner image"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleNewBannerImageDelete}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <AiOutlineDelete className="w-6 h-6 m-auto text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <label htmlFor="uploadBanner" className="cursor-pointer">
                    <AiOutlineCloudUpload className="m-auto text-gray-500" />
                    <p className="text-gray-500 mt-2">
                      Click to Upload Banner Image
                    </p>
                  </label>
                  <input
                    id="uploadBanner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                    className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Existing image */}

          <div className="w-full  mx-auto ">
            <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
              {values.image_url ? (
                <div>
                  <img
                    src={values.image_url}
                    alt="Existing image"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleNewImageDelete}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <AiOutlineDelete className="w-6 h-6 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <label htmlFor="uploadImage" className="cursor-pointer">
                    <AiOutlineCloudUpload className="w-12 h-12 m-auto text-gray-500" />
                    <p className="text-gray-500 mt-2">Click to Upload Image</p>
                  </label>
                  <input
                    id="uploadImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* service name */}
        <div className="w-full gap-x-10 gap-y-3 flex justify-between mt-10">
          {/* Service Name */}
          <div className="w-full">
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
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
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
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
              Update
            </button>
          )}
        </div>
      </form>
    </>
  );
};
export default UpdateServiceDetail;
