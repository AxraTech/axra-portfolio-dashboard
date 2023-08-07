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
const imageType = ["image/jpeg", "image/png"];
const CreateProduct = () => {
  const navigate = useNavigate();
  // const { data } = useQuery(PRODUCT_MODEL);
  const { data: category } = useQuery(PRODUCT_CATEGORY);
  const { data: brand } = useQuery(PRODUCT_BRAND);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState();

  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  //RTE
  const descriptionChange = (value) => {
    setDescription(value);
    setValues({ ...values, product_description: value.toString("html") });
  };

  const specificationChange = (value) => {
    setSpecification(value);
    setValues({ ...values, product_specification: value.toString("html") });
  };

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
  const [add_product] = useMutation(ADD_PRODUCUT, {
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
      setValues({ ...values, product_image_url: URL.createObjectURL(img) });
      if (!imageType.includes(img.type)) {
        setErrors({
          ...errors,
          product_image_url: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          product_image_url: "Image size must be smaller than 10MB",
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
        const imageName = values.product_image_url.split("/").pop();
        console.log("image name", imageName);
        await deleteImage({ variables: { image_name: imageName } });
        setValues({ ...values, product_image_url: "" });
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
    if (!values.fk_product_category_id) {
      tempErrors.fk_product_category_id = "Product Category field is required.";
      errorExist = true;
    }
    if (!values.fk_product_brand_id) {
      tempErrors.fk_product_brand_id = "Product Brand field is required.";
      errorExist = true;
    }
    if (!values.model_name) {
      tempErrors.model_name = "Product Model field is required.";
      errorExist = true;
    }
    // if (!values.product_description) {
    //   tempErrors.product_description = "Product Description field is required.";
    //   errorExist = true;
    // }
    if (!values.product_specification) {
      tempErrors.product_specification =
        "Product Specification field is required.";
      errorExist = true;
    }

    if (!values.product_image_url) {
      tempErrors.product_image_url = "Product Image field is required.";
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
          product_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${res.data.getImageUploadUrl.imageName}`,
        },
      });
      navigate("/products");
      console.log("after create");
    } catch (err) {
      console.log("Error", err);
      console.log("errrrrrrror");
    }
  };
  console.log("values", values);

  if (!category || !brand) {
    return;
  }

  return (
    <>
      <form>
        {/* image upload */}
        <div className="max-w-sm mx-auto mt-8">
          <div className="flex items-center justify-center h-48 w-full bg-white border-2 border-dashed border-gray-500 rounded-lg overflow-hidden relative">
            {selectedImage ? (
              <>
                <img
                  src={values.product_image_url}
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
          {errors.product_image_url && (
            <p className="text-red-500 mt-2 flex justify-center text-sm">
              {errors.product_image_url}
            </p>
          )}
        </div>
        <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 mt-10">
          {/* Category */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Product Category
            </label>

            <select
              id="default"
              value={values.fk_product_category_id}
              onChange={handleChange("fk_product_category_id")}
              className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose Category</option>
              {Array.isArray(category.product_category) &&
                category?.product_category.map((row, index) => (
                  <option key={index} value={row.id}>
                    {row.product_category_name}
                  </option>
                ))}
            </select>
            {errors.fk_product_category_id && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.fk_product_category_id}
              </p>
            )}
          </div>

          {/* product model */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Product Model
            </label>

            <input
              type="text"
              id="default-input"
              value={values.model_name}
              onChange={handleChange("model_name")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            {errors.model_name && (
              <p className="text-red-500 mt-2 text-sm">{errors.model_name}</p>
            )}

            {/* <select
              id="default"
              defaultValue=""
              value={values.fk_product_type}
              onChange={handleChange("fk_product_type")}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose Product</option>
              {data.product_model.length !== 0 &&
                data?.product_model?.map((row, index) => (
                  <option key={index} value={row.id}>
                    {row.model_name}
                  </option>
                ))}
            </select> */}
          </div>

          {/* product brand */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Product Brand
            </label>

            <select
              id="default"
              defaultValue=""
              value={values.fk_product_brand_id}
              onChange={handleChange("fk_product_brand_id")}
              className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose Product</option>
              {brand.product_brand.length !== 0 &&
                brand?.product_brand?.map((row, index) => (
                  <option key={index} value={row.id}>
                    {row.brand_name}
                  </option>
                ))}
            </select>

            {errors.fk_product_brand_id && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.fk_product_brand_id}
              </p>
            )}
          </div>
          <div></div>

          {/* product description */}
          <div>
            <label
              for="base-input"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Product Description
            </label>
            <RichTextEditor value={description} onChange={descriptionChange} />
            {errors.product_description && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.product_description}
              </p>
            )}
          </div>

          {/* product Specification */}
          <div>
            <label
              for="base-input"
              className="block  mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Product Specification
            </label>
            <RichTextEditor
              className="bg-red-100"
              value={specification}
              onChange={specificationChange}
            />
            {errors.product_specification && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.product_specification}
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
export default CreateProduct;
