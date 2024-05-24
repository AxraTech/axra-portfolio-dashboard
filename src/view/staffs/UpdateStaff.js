import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { IMAGE_UPLOAD, DELETE_IMAGE } from "../../gql/imageupload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";
import {
  EDIT_PRODUCUT,
  PRODUCT_BRAND,
  PRODUCT_CATEGORY,
  PRODUCT_PK,
} from "../../gql/product";
import { EDIT_STAFF, STAFF_ID, STAFF_PK, USER_ID } from "../../gql/staffs";
const imageType = ["image/jpeg", "image/png"];
const UpdateStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [isUnique, setIsUnique] = useState(false);

  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReplacementImage, setSelectedReplacementImage] =
    useState(null);
  const { data: staffIdData } = useQuery(STAFF_ID);
  const [loadStaff, resultStaff] = useLazyQuery(STAFF_PK);

  useEffect(() => {
    loadStaff({ variables: { id: id } });
  }, [loadStaff]);

  useEffect(() => {
    if (resultStaff.data) {
      setValues({
        fk_users_id:
          resultStaff?.data?.staff_info_by_pk?.staff_info_user?.id ?? "",
        id: resultStaff?.data.staff_info_by_pk.id ?? "",
        name: resultStaff?.data.staff_info_by_pk.name ?? "",
        position: resultStaff?.data.staff_info_by_pk.position ?? "",
        image: resultStaff?.data?.staff_info_by_pk.image ?? "",
        staff_ID: resultStaff?.data?.staff_info_by_pk.staff_ID ?? "",
        start_join_date:
          resultStaff?.data?.staff_info_by_pk.start_join_date ?? "",
      });
    }
  }, [resultStaff]);
  useEffect(() => {
    if (values.staff_ID) {
      const existingStaffIDs =
        staffIdData?.staff_info.map((staff) => staff.staff_ID) || [];
      setIsUnique(!existingStaffIDs.includes(values.staff_ID));
    }
  }, [values.staff_ID, staffIdData]);

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
      //   image: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${data.getImageUploadUrl.imageName}`,
      // });
    },
  });

  // Create products
  const [edit_product] = useMutation(EDIT_STAFF, {
    onError: (err) => {
      console.log("Product upload error", err);
      alert("Staff Update Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("Staff has been updated");
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
        image: URL.createObjectURL(img),
      });

      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          image: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          image: "Image size must be smaller than 10MB",
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
    setValues({ ...values, image: "" });
  };

  // const handleImageDelete = async () => {
  //   // If there's an existing image, delete it
  //   if (values.image) {
  //     try {
  //       setLoading(true);
  //       // Extract the imageName from the image
  //       const imageName = values.image.split("/").pop();
  //       console.log("image name", imageName);
  //       await deleteImage({ variables: { image_name: imageName } });
  //       setValues({ ...values, image: "" });
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error deleting image:", error);
  //       setLoading(false);
  //     }

  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.staff_ID) {
      tempErrors.staff_ID = "Staff ID field is required.";
      errorExist = true;
    } else if (!isUnique) {
      tempErrors.staff_ID = "Staff ID must be unique.";
      errorExist = true;
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      console.log("error exit ", tempErrors);
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
        updatedValues.image = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      } else if (selectedImage) {
        const res = await getImageUrl({
          variables: { contentType: "image/*" },
        });
        await imageService.uploadImage(
          res.data.getImageUploadUrl.imageUploadUrl,
          selectedImage
        );
        updatedValues.image = `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`;
      }

      await edit_product({ variables: updatedValues });

      navigate("/staffs");
    } catch (err) {
      console.log("Error", err);
      console.log("Error occurred during update");
    }
  };

  return (
    <>
      <form>
        {/* image upload */}
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
            ) : values.image ? (
              <>
                <img
                  src={values.image}
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
          {errors.image && (
            <p className="text-red-500 mt-2 flex justify-center text-sm">
              {errors.image}
            </p>
          )}
        </div>
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 mt-10">
          {/* Category */}
          {/* <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
            >
              Staffs Category
            </label>

            <select
              id="default"
              value={values.fk_Staffs_category_id}
              onChange={handleChange("fk_Staffs_category_id")}
              className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose Category</option>
              {Array.isArray(category.Staffs_category) &&
                category?.Staffs_category.map((row, index) => (
                  <option key={index} value={row.id}>
                    {row.Staffs_category_name}
                  </option>
                ))}
            </select>
            {errors.fk_Staffs_category_id && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.fk_Staffs_category_id}
              </p>
            )}
          </div> */}
          {/* name */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              User Name
            </label>

            <input
              type="text"
              id="default-input"
              value={values.fk_users_id}
              // onChange={handleChange("userId?.users_by_pk?.name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.fk_users_id && (
              <p className="text-red-500 mt-2 text-sm">{errors.fk_users_id}</p>
            )}
          </div>

          {/* staff name */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Staff Name
            </label>

            <input
              type="text"
              id="default-input"
              value={values.name}
              onChange={handleChange("name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.name && (
              <p className="text-red-500 mt-2 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Position
            </label>

            <input
              type="text"
              id="default-input"
              value={values.position}
              onChange={handleChange("position")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.position && (
              <p className="text-red-500 mt-2 text-sm">{errors.position}</p>
            )}
          </div>

          {/* staff_ID */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Staff_ID
            </label>

            <input
              type="text"
              id="default-input"
              value={values.staff_ID}
              onChange={handleChange("staff_ID")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.staff_ID && (
              <p className="text-red-500 mt-2 text-sm">{errors.staff_ID}</p>
            )}
          </div>
          {/* start_join_date*/}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Start Join Date
            </label>

            <input
              type="date"
              id="default-input"
              value={values.start_join_date}
              onChange={handleChange("start_join_date")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.start_join_date && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.start_join_date}
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

export default UpdateStaff;
