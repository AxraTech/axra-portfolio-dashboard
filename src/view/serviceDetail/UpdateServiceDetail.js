import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { IMAGE_UPLOAD, DELETE_IMAGE } from "../../gql/imageupload";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";

import {
  EDIT_SERVICE_DETAIL,
  SERVICE_DETAIL_PK,
} from "../../gql/serviceDetail";

const imageType = ["image/jpeg", "image/png"];
const UpdateServiceDetail = ({ handleClose, serviceDetails }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [descriptionOne, setDescriptionOne] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReplacementImage, setSelectedReplacementImage] =
    useState(null);

  useEffect(() => {
    if (serviceDetails) {
      const details = serviceDetails?.service_details_by_pk;

      setDescription(
        serviceDetails?.service_details_by_pk?.service_description ?? ""
      );
      setDescriptionOne(
        serviceDetails?.service_details_by_pk?.service_description_one ?? ""
      );
      setValues({
        id: details?.id ?? "",
        fk_service_category_id: details?.fk_service_category_id ?? "",
        service_description: details?.service_description ?? "",
        service_description_one: details?.service_description_one ?? "",
        image_url: details?.image_url ?? "",
      });
    }
  }, [
    serviceDetails?.service_details_by_pk?.id,
    serviceDetails?.service_details_by_pk?.fk_service_category_id,
    serviceDetails?.service_details_by_pk?.service_description,
    serviceDetails?.service_details_by_pk?.service_description_one,
    serviceDetails?.service_details_by_pk?.image_url,
  ]);
  console.log("values ", values);
  // RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({ ...values, service_description: value.toString("html") });
  };
  const descriptionOneChange = (value) => {
    setDescriptionOne(value);
    setValues({ ...values, service_description_one: value.toString("html") });
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
      //   image_url: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${data.getImageUploadUrl.imageName}`,
      // });
    },
  });

  // Create products
  const [edit_service] = useMutation(EDIT_SERVICE_DETAIL, {
    onError: (err) => {
      console.log("Service Detail upload error", err);
      alert("Service Detail Update Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("Service Detail has been updated");
      setValues({});
      setLoading(false);
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
    onCompleted: () => {
      alert("Image Deleted");
    },
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setSelectedImage(img);
      setValues({
        ...values,
        image_url: URL.createObjectURL(img),
      });

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
    }
  };

  const handleReplacementImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let replacementImg = e.target.files[0];
      setSelectedReplacementImage(replacementImg);
    }
  };

  const handleImageDelete = (e) => {
    e.preventDefault();
    setValues({ ...values, image_url: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
        updatedValues.image_url = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      } else if (selectedImage) {
        const res = await getImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          res.data.getImageUploadUrl.imageUploadUrl,
          selectedImage
        );
        updatedValues.image_url = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      }

      await edit_service({ variables: updatedValues });

      navigate(-1);
    } catch (err) {
      console.log("Error", err);
      console.log("Error occurred during update");
    }
  };

  return (
    <>
      <div className="  dark:bg-gray-400  overflow-y-auto  fixed top-0 right-0 mx-auto left-0 z-50 justify-center items-center w-2/3 md:inset-0 h-[calc(100%-1.5rem)] max-h-full m-3 p-5 shadow-xl ">
        <div>
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 pt-0 border-b rounded-t dark:border-white-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Service Details
            </h3>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={handleClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>
        <form className=" h-full w-full  justify-around flex flex-col pb-6 ">
          {/* image upload */}
          <div>
            <div className="max-w-sm mx-auto mt-8">
              <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
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
                ) : values?.image_url ? (
                  <>
                    <img
                      src={values?.image_url}
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
            </div>
            {/*  service_description */}
            <div>
              <div className="w-full">
                <label
                  for="base-input"
                  className=" mb-2 text-md font-medium text-white"
                >
                  Service Description
                </label>
                <RichTextEditor
                  value={description}
                  onChange={descriptionChange}
                />
                {errors.service_description && (
                  <p className="text-red-500 mt-2 text-sm">
                    {errors.service_description}
                  </p>
                )}
              </div>
            </div>
            {/*  service_description_one */}
            <div>
              <div className="w-full">
                <label
                  for="base-input"
                  className=" mb-2 text-md font-medium text-white"
                >
                  Service Description one
                </label>
                <RichTextEditor
                  value={descriptionOne}
                  onChange={descriptionOneChange}
                />
                {errors.service_description_one && (
                  <p className="text-red-500 mt-2 text-sm">
                    {errors.service_description_one}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end py-4">
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
      </div>
    </>
  );
};

export default UpdateServiceDetail;
