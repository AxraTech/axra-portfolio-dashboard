import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PRODUCT, PRODUCT_PK } from "../../gql/product";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBox from "../../components/ModalBox";

import { ARTICLE_PK } from "../../gql/articles";
import { HOME_PK } from "../../gql/home";

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: home } = useQuery(HOME_PK, { variables: { id: id } });
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);

  const handleDescription = () => {
    setDesOpen(true);
    setSpeOpen(false);
  };

  if (!home) {
    return;
  }
  console.log("home", home);
  return (
    <>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={home?.home_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-2 p-4 px-10 ">
          {/* Title */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Title</p>
            <p className="px-3">-</p>
            <p>{home?.home_by_pk?.title}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-x-10 mt-10">
        <button
          className={`${
            desOpen ? "border-b border-blue-500" : "border-b border-black"
          }`}
          onClick={handleDescription}
        >
          Description
        </button>
      </div>

      {desOpen && (
        <div
          className="py-5"
          open={desOpen}
          dangerouslySetInnerHTML={{
            __html: home?.home_by_pk?.description,
          }}
        ></div>
      )}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() => navigate(`/update_home/${home?.home_by_pk.id}`)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => navigate(`/delete_home/${home.home_by_pk.id}`)}
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default Home;
