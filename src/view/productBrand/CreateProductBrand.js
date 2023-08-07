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
import { ADD_PRODUCT_BRAND } from "../../gql/productBrand";
const imageType = ["image/jpeg", "image/png"];
const CreateProduct = () => {
  const navigate = useNavigate();

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
  const [add_product] = useMutation(ADD_PRODUCT_BRAND, {
    onError: (err) => {
      console.log("product upload error", err);
      alert("Product Upload Error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("New Product has been added");
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
    // If there's an existing image, delete it
    if (values.product_image_url) {
      try {
        setLoading(true);
        // Extract the imageName from the product_image_url
        const imageName = values.image_url.split("/").pop();
        console.log("image name", imageName);
        await deleteImage({ variables: { image_name: imageName } });
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
    // if (!values.image_url) {
    //   tempErrors.image_url = "Product Image field is required.";
    //   errorExist = true;
    // }

    if (!values.brand_name) {
      tempErrors.brand_name = "Product Brand field is required.";
      errorExist = true;
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      const res = await getImageUrl({ variables: { contentType: "image/*" } });
      console.log("response ", res);
      await imageService.uploadImage(
        res.data.getImageUploadUrl.imageUploadUrl,
        selectedImage
      );

      await add_product({
        variables: {
          ...values,
          image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${res.data.getImageUploadUrl.imageName}`,
        },
      });
      navigate("/product_brand");
    } catch (err) {
      console.log("Error", err);
      console.log("errrrrrrror");
    }
  };
  console.log("values", values);

  return (
    <>
      <form>
        {/* image upload */}

        <div className="grid grid-cols-4 gap-x-10">
          <div className=" col-span-2">
            <div className=" flex  items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
              {selectedImage ? (
                <div>
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
                </div>
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

          {/* product model */}
          <div className="col-span-2">
            <label
              for="base-input"
              className="block  mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Brand Name
            </label>

            <input
              type="text"
              id="default-input"
              value={values.brand_name}
              onChange={handleChange("brand_name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.brand_name && (
              <p className="text-red-500 mt-2 text-sm">{errors.brand_name}</p>
            )}
          </div>
        </div>

        {/* <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 mt-10"></div> */}
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
export default CreateProduct;
