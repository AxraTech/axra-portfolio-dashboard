import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { format } from "date-fns";
import { ARTICLE_PK } from "../../gql/articles";

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article } = useQuery(ARTICLE_PK, { variables: { id: id } });
  const [desOpen, setDesOpen] = useState(true);
  const [speOpen, setSpeOpen] = useState(false);
  const [Modelopen, setModelOpen] = useState(false);

  const handleDescription = () => {
    console.log("object");

    setDesOpen(true);
    setSpeOpen(false);
  };

  const handleSpecification = () => {
    setSpeOpen(true);
    setDesOpen(false);
  };

  if (!article) {
    return;
  }

  return (
    <>
      <div className="my-5">
        <span>
          <a href="/appointment" className="hover:text-blue-800">
            Dashboard
          </a>
        </span>
        <span>
          <a href="/article" className="hover:text-blue-600">
            {" "}
            / Article Details
          </a>
        </span>
        <span> / {id}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-10">
        <div className="col-span-1 bg-gray-200 p-4 shadow-sm w-auto h-auto">
          <img
            src={article?.article_by_pk?.image_url}
            className="w-auto h-auto"
          ></img>
        </div>
        <div className=" col-span-2 p-4 px-10 ">
          {/* category */}
          <div className="flex gap-x-3 ">
            <p className="w-36">Category</p>
            <p className="px-3">-</p>
            <p>{article?.article_by_pk?.category}</p>
          </div>
          {/* Title */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Title</p>
            <p className="px-3">-</p>
            <p>{article?.article_by_pk?.title}</p>
          </div>
          {/* created at */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Created At</p>
            <p className="px-3">-</p>

            <p>
              {" "}
              {format(
                new Date(article?.article_by_pk?.created_at),
                "yyyy-MM-dd hh:mm:ss a"
              )}
            </p>
          </div>
          {/* updated at */}
          <div className="flex gap-3 my-8">
            <p className="w-36">Updated At</p>
            <p className="px-3">-</p>
            <p>
              {" "}
              {format(
                new Date(article?.article_by_pk?.updated_at),
                "yyyy-MM-dd hh:mm:ss a"
              )}
            </p>
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
            __html: article?.article_by_pk?.description,
          }}
        ></div>
      )}

      <div className="flex justify-end gap-x-10 py-5">
        <button
          onClick={() =>
            navigate(`/update_article/${article?.article_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate(`/delete_article/${article.article_by_pk.id}`)
          }
          className=" font-medium text-md rounded text-white py-2 px-4  bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default Article;
