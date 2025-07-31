import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContest.jsx";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blogId, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        commentId: _id,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!confirm) return;
      const { data } = await axios.post("/api/admin/delete-comment", {
        commentId: _id,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blogId.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>

      <td className="px-6 py-4 mx-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              alt=""
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            alt=""
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
