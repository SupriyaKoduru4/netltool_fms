import { useParams, useNavigate } from "react-router-dom";
import { useGetBlogByIdQuery } from "../services/api/blogSlice";

import Backbutton from "../assets/Backbutton.svg";
import shareIcon from "../assets/Share.svg";
import commentIcon from "../assets/Chat.svg";
import likeIcon from "../assets/Like.svg";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } =
    useGetBlogByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const blog = data?.blog;

  return (
    <div className="min-h-screen bg-[#F4F4F4] p-6">

      {/* Back */}
      <button
        onClick={() => navigate("/blogs")}
        className="mb-6 flex items-center gap-2"
      >
        <img
          src={Backbutton}
          alt="back"
          className="h-4 w-4"
        />

        <span className="font-medium">
          Back to Blogs
        </span>
      </button>

      {/* Main Card */}
      <div className="rounded-md border bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h1 className="text-3xl font-bold">
              {blog?.title}
            </h1>

            <p className="mt-2 text-gray-500">
              Last Updated :
              {" "}
              {blog?.updatedAt}
            </p>
          </div>

          <div className="flex gap-4">
            <img
              src={shareIcon}
              alt="share"
              className="h-6 w-6 cursor-pointer"
            />
          </div>

        </div>

        {/* Content */}
        <div className="p-6">

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: blog?.content,
            }}
          />

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-4">

          <button className="flex items-center gap-2 rounded border px-6 py-3">
            <img
              src={commentIcon}
              alt="comment"
              className="h-5 w-5"
            />
            Comment
          </button>

          <div className="flex items-center gap-4 rounded border px-6 py-3">

            <span>
              {blog?.author_name}
            </span>

            <span>
              {blog?.likes || 0}
            </span>

            <img
              src={likeIcon}
              alt="like"
              className="h-5 w-5"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default BlogDetails;