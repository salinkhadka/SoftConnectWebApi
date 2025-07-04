import React, { useState } from "react";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import WriteComment from "./WriteCommentComponent";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

export default function CommentCard({ comment, allComments, postId, onReplyPosted }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  // Filter replies for this comment from allComments
  const replies = allComments.filter(
    (c) => c.parentCommentId === comment._id
  );

  const user = comment.userId || {};
  const username = user.username || "Unknown User";
  const profilePhoto =
    user.profilePhoto && user.profilePhoto.trim() !== ""
      ? getBackendImageUrl(user.profilePhoto)
      : DEFAULT_AVATAR;

  const toggleReplyBox = () => setShowReplyBox((prev) => !prev);

  const toggleReplies = () => setShowReplies((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-[#2c2a38] rounded-xl mb-2">
      <div className="flex gap-3">
        <img
          src={profilePhoto}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <div className="flex flex-col flex-grow">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {username}
          </span>
          <span className="text-gray-800 dark:text-gray-200 text-sm">
            {comment.content}
          </span>
          <div className="flex gap-4 items-center mt-1">
            <button
              className="text-xs text-blue-600 hover:underline self-start"
              onClick={toggleReplyBox}
            >
              {showReplyBox ? "Cancel" : "Reply"}
            </button>

            {/* Show reply count button only if replies exist */}
            {replies.length > 0 && (
              <button
                className="text-xs text-gray-600 hover:underline self-start"
                onClick={toggleReplies}
              >
                {showReplies ? "Hide Replies" : `${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply input box */}
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

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="ml-12 mt-3 border-l border-gray-300 dark:border-gray-700 pl-4">
          {replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              allComments={allComments}
              postId={postId}
              onReplyPosted={onReplyPosted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
