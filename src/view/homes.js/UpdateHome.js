import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { IMAGE_UPLOAD, DELETE_IMAGE } from "../../gql/imageupload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";

import { UPDATE_HOME, HOME_PK } from "../../gql/home";
const imageType = ["image/jpeg", "image/png"];
const UpdateHome = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState();
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReplacementImage, setSelectedReplacementImage] =
    useState(null);

  const [loadProduct, resHome] = useLazyQuery(HOME_PK);

  useEffect(() => {
    loadProduct({ variables: { id: id } });
  }, [loadProduct]);

  useEffect(() => {
    if (resHome.data) {
      setValues({
        id: resHome.data.home_by_pk.id ?? "",
        title: resHome.data.home_by_pk.title ?? "",

        description: resHome.data.home_by_pk.description ?? "",

        image_url: resHome.data.home_by_pk.image_url ?? "",
      });
      setDescription(resHome.data.home_by_pk.description ?? "");
    }
  }, [resHome]);

  // RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({ ...values, product_description: value.toString("html") });
  };

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Image upload error", err);
      // alert("Image Upload Error");
    },
    onCompleted: (data) => {
      setLoading(false);
    },
  });

  // Create home data
  const [edit_article] = useMutation(UPDATE_HOME, {
    onError: (err) => {
      console.log("home data upload error", err);
      alert("Hone Data Update Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Home Data has been updated");
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

  const handleImageDelete = () => {
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

      await edit_article({ variables: updatedValues });

      navigate("/home");
    } catch (err) {
      console.log("Error", err);
      console.log("Error occurred during update");
    }
  };

  return (
    <>
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
          ) : values.image_url ? (
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
      <form>
        {/* Rest of the form fields */}
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 mt-10">
          {/* title */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Title
            </label>

            <input
              type="text"
              id="default-input"
              value={values.title}
              onChange={handleChange("title")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          {/* description */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Description
            </label>
            <RichTextEditor value={description} onChange={descriptionChange} />
          </div>
        </div>

        <div className="flex justify-end my-5">
          <button
            className="flex items-center py-2 mt-5 px-4 bg-blue-700 text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-md px-4 py-2"
            loading={loading}
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateHome;
