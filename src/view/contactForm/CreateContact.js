import { useMutation, useQuery } from "@apollo/client";
import imageService from "../../imageService/image";

import { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";

import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import { useNavigate } from "react-router-dom";
import { ADD_CONTACT } from "../../gql/contact";
const imageType = ["image/jpeg", "image/png"];
const CreateContact = () => {
  const navigate = useNavigate();
  // const { data } = useQuery(PRODUCT_MODEL);

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState();

  const [selectedImage, setSelectedImage] = useState(null);

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Imge upload error", err);
      // alert("Image Upload Error");
    },
    onCompleted: (data) => {
      console.log("data", data);
      setLoading(false);
    },
  });

  //create products
  const [add_contact] = useMutation(ADD_CONTACT, {
    onError: (err) => {
      console.log("contact upload error", err);
      alert("contact Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Contact has been added");
      console.log("result", data);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setSelectedImage(img);
      setValues({ ...values, image_url: URL.createObjectURL(img) });
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

  // const handleImageDelete = () => {
  //   setSelectedImage(null);
  // };

  const handleImageDelete = async () => {
    if (values.image_url) {
      try {
        // setLoading(true);

        const imageName = values.image_url.split("/").pop();

        await deleteImage({ variables: { image_name: imageName } });
        setSelectedImage(null);
        setValues({ ...values, image_url: "" });
        setLoading(false);
      } catch (error) {
        console.log("Error deleting image:", error);
        setLoading(false);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.phone) {
      tempErrors.phone = "Phone field is required.";
      errorExist = true;
    }
    if (!values.email) {
      tempErrors.email = "Email field is required.";
      errorExist = true;
    }
    if (!values.address) {
      tempErrors.address = "Address field is required.";
      errorExist = true;
    }
    if (!values.image_url) {
      tempErrors.image_url = "Image Url field is required.";
      errorExist = true;
    }
    if (!values.start_time) {
      tempErrors.start_time = "Opening Time field is required.";
      errorExist = true;
    }
    if (!values.end_time) {
      tempErrors.end_time = "Closing Time field is required.";
      errorExist = true;
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

      await add_contact({
        variables: {
          ...values,
          image_url: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`,
        },
      });
      navigate("/contact");
      console.log("after create");
    } catch (err) {
      console.log("Error", err);
      console.log("errrrrrrror");
    }
  };

  return (
    <>
      {/* image upload */}
      <div className="max-w-sm mx-auto mt-8">
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
        {errors.image_url && (
          <p className="text-red-500 mt-2 flex justify-center text-sm">
            {errors.image_url}
          </p>
        )}
      </div>
      <form onSubmit={handleCreate}>
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
export default CreateContact;
