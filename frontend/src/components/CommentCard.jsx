import React, { useState, useContext } from "react";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import WriteComment from "./WriteCommentComponent";
import { useDeleteComment } from "../hooks/usecommenthook";
import { AuthContext } from "../auth/AuthProvider";
import DeleteModal from "./DeleteModal";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

export default function CommentCard({ comment, allComments, postId, postOwnerId, onReplyPosted }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useContext(AuthContext);
  const deleteComment = useDeleteComment();

  const replies = allComments.filter((c) => c.parentCommentId === comment._id);
  const userInfo = comment.userId || {};
  const username = userInfo.username || "Unknown User";
  const profilePhoto =
    userInfo.profilePhoto && userInfo.profilePhoto.trim() !== ""
      ? getBackendImageUrl(userInfo.profilePhoto)
      : DEFAULT_AVATAR;

  const currentUserId = user?._id || user?.id;
  const commentOwnerId = userInfo?._id;
  const isCommentAuthor = currentUserId === commentOwnerId;
  const isPostOwner = currentUserId === postOwnerId;
  const canDelete = isCommentAuthor || isPostOwner;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteComment.mutate(comment._id, {
      onSuccess: () => {
        onReplyPosted();
        setShowDeleteModal(false);
      },
      onError: () => {
        setShowDeleteModal(false);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-[#2c2a38] rounded-xl mb-2">
        <div className="flex gap-3">
          <img
            src={profilePhoto}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {username}
              </span>
              {canDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            <span className="text-gray-800 dark:text-gray-200 text-sm">
              {comment.content}
            </span>
            <div className="flex gap-4 items-center mt-1">
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowReplyBox((prev) => !prev)}
              >
                {showReplyBox ? "Cancel" : "Reply"}
              </button>

              {replies.length > 0 && (
                <button
                  className="text-xs text-gray-600 hover:underline"
                  onClick={() => setShowReplies((prev) => !prev)}
                >
                  {showReplies
                    ? "Hide Replies"
                    : `${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {showReplyBox && (
          <div className="ml-12 mt-1">
            <WriteComment
              postId={postId}
              parentCommentId={comment._id}
              onCommentPosted={() => {
                onReplyPosted();
                setShowReplyBox(false);
              }}
            />
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="ml-12 mt-3 border-l border-gray-300 dark:border-gray-700 pl-4">
            {replies.map((reply) => (
              <CommentCard
                key={reply._id}
                comment={reply}
                allComments={allComments}
                postId={postId}
                postOwnerId={postOwnerId} // ✅ Important
                onReplyPosted={onReplyPosted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  );
}
