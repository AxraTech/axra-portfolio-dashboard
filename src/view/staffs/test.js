import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../../imageService/image";
import { EDIT_STAFF, STAFF_ID, STAFF_PK } from "../../gql/staffs";

const imageType = ["image/jpeg", "image/png"];
const UpdateStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [isUnique, setIsUnique] = useState(true);
  const [initialStaffId, setInitialStaffId] = useState(null);
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
      const staffData = resultStaff.data.staff_info_by_pk;
      setValues({
        fk_users_id: staffData.staff_info_user.id ?? "",
        id: staffData.id ?? "",
        name: staffData.name ?? "",
        position: staffData.position ?? "",
        image: staffData.image ?? "",
        staff_ID: staffData.staff_ID ?? "",
        start_join_date: staffData.start_join_date ?? "",
      });
      setInitialStaffId(staffData.staff_ID); // Store the initial staff ID
    }
  }, [resultStaff]);

  useEffect(() => {
    if (values.staff_ID && values.staff_ID !== initialStaffId) {
      const existingStaffIDs =
        staffIdData?.staff_info.map((staff) => staff.staff_ID) || [];
      setIsUnique(!existingStaffIDs.includes(values.staff_ID));
    } else {
      setIsUnique(true);
    }
  }, [values.staff_ID, staffIdData, initialStaffId]);

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);
      console.log("Image upload error", err);
    },
    onCompleted: (data) => {
      setLoading(false);
    },
  });

  const [edit_staff] = useMutation(EDIT_STAFF, {
    onError: (err) => {
      console.log("Staff update error", err);
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
      console.log("error exist ", tempErrors);
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

      await edit_staff({ variables: updatedValues });

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
          {/* User Name */}
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
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.fk_users_id && (
              <p className="text-red-500 mt-2 text-sm">{errors.fk_users_id}</p>
            )}
          </div>

          {/* Staff ID */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Staff ID
            </label>

            <input
              type="text"
              id="default-input"
              value={values.staff_ID}
              onChange={handleChange("staff_ID")}
              className={`bg-white_color border ${
                isUnique ? "border-gray-300" : "border-red-500"
              } text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            {errors.staff_ID && (
              <p className="text-red-500 mt-2 text-sm">{errors.staff_ID}</p>
            )}
          </div>

          {/* Other fields */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Name
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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateStaff;
