import { useMutation, useQuery } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";

import { APP_PROJECT_PK } from "../../gql/appProject";
import { WEB_PROJECT_PK } from "../../gql/webProject";

const WebProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: web } = useQuery(WEB_PROJECT_PK, {
    variables: { id: id },
  });
  //   const [desOpen, setDesOpen] = useState(true);
  //   const [speOpen, setSpeOpen] = useState(false);
  //   const [Modelopen, setModelOpen] = useState(false);

  //   const handleDescription = () => {
  //     console.log("object");

  //     setDesOpen(true);
  //     setSpeOpen(false);
  //   };

  //   const handleSpecification = () => {
  //     setSpeOpen(true);
  //     setDesOpen(false);
  //   };

  if (!web) {
    return;
  }

  return (
    <>
      <div className="my-5">
        <span>
          <a href="/" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/web_project" className="hover:text-blue-600">
            {" "}
            / Website Project Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={web?.website_project_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>

        <div className=" col-span-2 p-4 px-10 ">
          {/* website url */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Android App Link</p>
            <p className="px-3">-</p>
            <p>{web?.website_project_by_pk?.website_url}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_web_project/${web?.website_project_by_pk?.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_web_project/${web?.website_project_by_pk?.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default WebProject;
