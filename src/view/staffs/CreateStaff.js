import { useMutation, useQuery } from "@apollo/client";
import imageService from "../../imageService/image";

import { useEffect, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import RichTextEditor from "../../components/RichTextEditor";
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/imageupload";
import { useNavigate, useParams } from "react-router-dom";
import { CREATE_STAFFS, STAFF_ID, USER_ID } from "../../gql/staffs";
const imageType = ["image/jpeg", "image/png"];
const CreateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [isUnique, setIsUnique] = useState(false);
  const { data: userId, error } = useQuery(USER_ID, { variables: { id: id } });
  const { data: staffIdData } = useQuery(STAFF_ID);

  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (err) => {
      setLoading(false);

      // alert("Image Upload Error");
    },
    onCompleted: (data) => {
      setLoading(false);
    },
  });

  //create Staffss
  const [add_Staffs] = useMutation(CREATE_STAFFS, {
    onError: (err) => {
      console.log("Staffs upload error", err);
      alert("Staffs Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Staffs has been added");

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
      setValues({ ...values, image: URL.createObjectURL(img) });
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

  // const handleImageDelete = () => {
  //   setSelectedImage(null);
  // };

  const handleImageDelete = async () => {
    if (values.image) {
      try {
        setLoading(true);
        const imageName = values.image.split("/").pop();
        await deleteImage({ variables: { image_name: imageName } });
        setValues({ ...values, image: "" });
        setLoading(false);
      } catch (error) {
        console.log("Error deleting image:", error);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (values.staff_ID) {
      const existingStaffIDs =
        staffIdData?.staff_info.map((staff) => staff.staff_ID) || [];
      setIsUnique(!existingStaffIDs.includes(values.staff_ID));
    }
  }, [values.staff_ID, staffIdData]);

  const handleCreate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};

    if (!values.name) {
      tempErrors.name = "Staffs Name field is required.";
      errorExist = true;
    }

    if (!values.phone) {
      tempErrors.phone = "Phone field is required.";
      errorExist = true;
    }

    if (!values.position) {
      tempErrors.position = "Staffs Position field is required.";
      errorExist = true;
    }
    if (!values.start_join_date) {
      tempErrors.start_join_date = "start_join_date field is required.";
      errorExist = true;
    }

    if (!values.image) {
      tempErrors.image = "Staffs Image field is required.";
      errorExist = true;
    }
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
      const res = await getImageUrl({ variables: { contentType: "image/*" } });

      await imageService.uploadImage(
        res.data.getImageUploadUrl.imageUploadUrl,
        selectedImage
      );

      await add_Staffs({
        variables: {
          ...values,
          fk_users_id: userId?.users_by_pk?.id,
          image: `https://axra.sgp1.digitaloceanspaces.com/AxraPortFo/${res.data.getImageUploadUrl.imageName}`,
        },
      });
      navigate("/staffs");
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <>
      <form>
        {/* image upload */}
        <div className="max-w-sm mx-auto mt-8">
          <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
            {selectedImage ? (
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
              value={userId?.users_by_pk?.id}
              // onChange={handleChange("userId?.users_by_pk?.name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.name && (
              <p className="text-red-500 mt-2 text-sm">{errors.name}</p>
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

          {/* Phone */}
          <div>
            <label
              htmlFor="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700 "
            >
              Phone
            </label>

            <input
              type="text"
              id="default-input"
              value={values.phone}
              onChange={handleChange("phone")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />

            {errors.phone && (
              <p className="text-red-500 mt-2 text-sm">{errors.phone}</p>
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
              htmlFor="default-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
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

          {/* start_join_date */}
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
export default CreateStaff;
