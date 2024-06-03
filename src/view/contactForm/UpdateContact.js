import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";

import { IMAGE_UPLOAD, DELETE_IMAGE } from "../../gql/imageupload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";

import { CONTACT_PK, EDIT_CONTACT } from "../../gql/contact";
const imageType = ["image/jpeg", "image/png"];
const UpdateContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState();
  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReplacementImage, setSelectedReplacementImage] =
    useState(null);

  const [loadProduct, resContact] = useLazyQuery(CONTACT_PK);

  useEffect(() => {
    loadProduct({ variables: { id: id } });
  }, [loadProduct]);

  useEffect(() => {
    if (resContact.data) {
      setValues({
        id: resContact.data.contact_by_pk.id ?? "",
        phone: resContact.data.contact_by_pk.phone ?? "",
        email: resContact.data.contact_by_pk.email ?? "",
        address: resContact.data.contact_by_pk.address ?? "",
        image_url: resContact.data.contact_by_pk.image_url ?? "",
        end_time: resContact.data.contact_by_pk.end_time ?? "",
        start_time: resContact.data.contact_by_pk.start_time ?? "",
      });
    }
  }, [resContact]);

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
  const [edit_contact] = useMutation(EDIT_CONTACT, {
    onError: (err) => {
      console.log("contact upload error", err);
      alert("Contact Update Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("Contact has been updated");
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

  // const handleImageDelete = async () => {
  //   // If there's an existing image, delete it
  //   if (values.image_url) {
  //     try {
  //       setLoading(true);
  //       // Extract the imageName from the image_url
  //       const imageName = values.image_url.split("/").pop();
  //       console.log("image name", imageName);
  //       await deleteImage({ variables: { image_name: imageName } });
  //       setValues({ ...values, image_url: "" });
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error deleting image:", error);
  //       setLoading(false);
  //     }

  //   }
  // };

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

      await edit_contact({ variables: updatedValues });

      navigate("/contact");
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
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 mt-10">
          {/* phone */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Phone
            </label>

            <input
              type="text"
              id="default-input"
              value={values.phone}
              onChange={handleChange("phone")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.phone && (
              <p className="text-red-500 mt-2 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* email */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Email
            </label>

            <input
              type="text"
              id="default-input"
              value={values.email}
              onChange={handleChange("email")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.email && (
              <p className="text-red-500 mt-2 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Address
            </label>

            <input
              type="text"
              id="default-input"
              value={values.address}
              onChange={handleChange("address")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.address && (
              <p className="text-red-500 mt-2 text-sm">{errors.address}</p>
            )}
          </div>

          {/* start_time */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Opening Time
            </label>

            <input
              type="time"
              id="default-input"
              value={values.start_time}
              onChange={handleChange("start_time")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.start_time && (
              <p className="text-red-500 mt-2 text-sm">{errors.start_time}</p>
            )}
          </div>

          {/* end_time */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Closing Time
            </label>

            <input
              type="time"
              id="default-input"
              value={values.end_time}
              onChange={handleChange("end_time")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.end_time && (
              <p className="text-red-500 mt-2 text-sm">{errors.end_time}</p>
            )}
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

export default UpdateContact;
