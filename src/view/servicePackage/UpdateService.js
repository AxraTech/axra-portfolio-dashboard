import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADD_SERVICE_PACKAGE,
  ALL_SERVICE_PACKAGE,
  DELETE_SERVICE_DETIAILS_PACKAGE,
  EDIT_SERVICE_PACKAGE,
  SERVICE_PACKAGE_DETAILS,
  SERVICE_PACKAGE_PK,
} from "../../gql/servicePackage";
import RichTextEditor from "../../components/RichTextEditor";
import {
  SERVICE_CAT,
  SERVICE_CAT_BY_NAME,
} from "../../gql/mixedServiceCategory";

const UpdateService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: serviceCat } = useQuery(SERVICE_CAT);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: serviceCatByName } = useQuery(SERVICE_CAT_BY_NAME, {
    variables: { service_name: selectedCategory },
  });
  const { data: servicePackage } = useQuery(SERVICE_PACKAGE_PK, {
    variables: { id: id },
  });

  useEffect(() => {
    if (servicePackage) {
      const packages = servicePackage?.service_packages_by_pk;
      setValues({
        id: packages?.id,
        one_time_package_price: packages?.one_time_package_price,
        recurrently_service_fee: packages?.recurrently_service_fee,
        service_package_description: packages?.service_package_description,
        service_package_name: packages?.service_package_name,
        service_package_type: packages?.service_package_type,
      });
      setDescription(packages?.service_package_description);
      setSelectedCategory(
        packages?.service_details_packages[0]?.service_details_packages
          ?.service_category?.service_name
      );
    }
  }, [
    servicePackage?.service_packages_by_pk?.id,
    servicePackage?.service_packages_by_pk?.one_time_package_price,
    servicePackage?.service_packages_by_pk?.recurrently_service_fee,
    servicePackage?.service_packages_by_pk?.service_package_description,
    servicePackage?.service_packages_by_pk?.service_package_name,
    servicePackage?.service_packages_by_pk?.service_package_type,
  ]);

  const descriptionChange = (value) => {
    setDescription(value);
    setValues({
      ...values,
      service_package_description: value.toString("html"),
    });
  };
  const [add_service_package_details] = useMutation(SERVICE_PACKAGE_DETAILS, {
    onError: (err) => {
      alert("Service Package Details Error");
    },
    refetchQueries: [ADD_SERVICE_PACKAGE],
  });
  const [delete_service_details_package] = useMutation(
    DELETE_SERVICE_DETIAILS_PACKAGE,
    {
      onError: (err) => {
        console.log("delete error ", err);
      },
    }
  );

  const [edit_service] = useMutation(EDIT_SERVICE_PACKAGE, {
    onError: (err) => {
      console.log("Service Package upload error", err);
      alert("Service Package Error");
      setLoading(false);
    },
    onCompleted: async (data) => {
      await delete_service_details_package({
        variables: {
          fk_service_packages_id: data?.update_service_packages_by_pk?.id,
        },
      });
      await add_service_package_details({
        variables: {
          fk_service_details_id: serviceCatByName?.service_details[0]?.id,
          fk_service_packages_id: data?.update_service_packages_by_pk?.id,
        },
      });

      alert("Update done");
      setValues({});
      setLoading(false);
    },
    refetchQueries: [ALL_SERVICE_PACKAGE],
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};

    if (selectedCategory === "Web Design & Development") {
      if (!values.one_time_package_price) {
        tempErrors.one_time_package_price = "Package Price field is required.";
        errorExist = true;
      }
      if (!values.recurrently_service_fee) {
        tempErrors.recurrently_service_fee = "Service Fee field is required.";
        errorExist = true;
      }
      if (!values.service_package_description) {
        tempErrors.service_package_description =
          "Service Description field is required.";
        errorExist = true;
      }
      if (!values.service_package_type) {
        tempErrors.service_package_type = "Package Type field is required.";
        errorExist = true;
      }
    } else {
      if (!values.service_package_description) {
        tempErrors.service_package_description =
          "Service Description field is required.";
        errorExist = true;
      }

      if (!values.service_package_name) {
        tempErrors.service_package_name = "Package Name field is required.";
        errorExist = true;
      }
    }

    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      if (selectedCategory === "Web Design & Development") {
        await edit_service({
          variables: {
            ...values,
            fk_service_packages_id:
              servicePackage?.service_details_packages_by_pk?.id,
            service_package_name: null,
            service_package_type: values?.service_package_type,
          },
        });
      } else {
        await edit_service({
          variables: {
            ...values,

            fk_service_packages_id:
              servicePackage?.service_details_packages_by_pk?.id,
            one_time_package_price: null,
            service_package_type: null,
            recurrently_service_fee: null,
          },
        });
      }

      navigate("/service_package");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="flex items-center mb-8">
        {serviceCat?.service_categories.map((cat, index) => (
          <div key={index} className="mx-3">
            <input
              id={`radio-${index}`}
              type="radio"
              name="service-category"
              value={cat?.service_name}
              checked={selectedCategory === cat?.service_name}
              onChange={() => handleCategoryChange(cat?.service_name)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`radio-${index}`}
              className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500"
            >
              {cat?.service_name}
            </label>
          </div>
        ))}
      </div>

      <form>
        {selectedCategory === "Web Design & Development" ? (
          <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 ">
            {/* package type */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Package Type
              </label>

              <input
                type="text"
                id="default-input"
                value={values?.service_package_type}
                onChange={handleChange("service_package_type")}
                className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.service_package_type && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_type}
                </p>
              )}
            </div>

            {/*one time package price */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                One Time Package Price
              </label>

              <input
                type="text"
                id="default-input"
                value={values.one_time_package_price}
                onChange={handleChange("one_time_package_price")}
                className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              {errors.one_time_package_price && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.one_time_package_price}
                </p>
              )}
            </div>

            {/* Service Fee */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Fee
              </label>
              <input
                type="text"
                id="default-input"
                value={values.recurrently_service_fee}
                onChange={handleChange("recurrently_service_fee")}
                className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              {errors.recurrently_service_fee && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.recurrently_service_fee}
                </p>
              )}
            </div>

            {/* Service description */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Package Description
              </label>
              <RichTextEditor
                value={description}
                onChange={descriptionChange}
              />
              {errors.service_package_description && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full gap-x-20 gap-y-3 grid grid-cols-2 ">
            {/* package name */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Package Name
              </label>

              <input
                type="text"
                id="default-input"
                value={values?.service_package_name}
                onChange={handleChange("service_package_name")}
                className="bg-white_color border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              {errors.service_package_name && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_name}
                </p>
              )}
            </div>

            {/* Service description */}
            <div>
              <label
                for="base-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-700"
              >
                Service Package Description
              </label>
              <RichTextEditor
                value={description}
                onChange={descriptionChange}
              />
              {errors.service_package_description && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.service_package_description}
                </p>
              )}
            </div>
          </div>
        )}

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

export default UpdateService;
