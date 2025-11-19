"use client";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { CiHeart } from "react-icons/ci";

function Comment({ comment, onDelete, onLike, currentUser }) {
  const isOwner = currentUser?.id === comment.userId;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(comment.id);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(comment.id);
  };
  return (
    <div className="border-b border-gray-200 p-4 ml-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Link href={`/users/${comment.userId}`}>
            {" "}
            <img
              src={comment.authorAvatarUrl || "URL_DE_VOTRE_AVATAR_PAR_DEFAUT"}
              alt={`${comment.author}'s avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>

          <Link
            href={`/users/${comment.userId}`}
            className="font-bold hover:text-blue-500 cursor-pointer"
          >
            @{comment.author}
          </Link>
        </div>
        <span className="text-gray-500 text-sm">
          · {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-2">{comment.content}</p>

      <div className="flex space-x-4 mt-2 justify-between">
        <button
          onClick={handleLikeClick}
          className="flex items-center gap-2 space-x-1 hover:text-blue-500 transition duration-150 relative z-10 cursor-pointer"
        >
          <CiHeart className="text-2xl" /> {comment.likes}
        </button>

        {isOwner && (
          <MdDelete
            onClick={handleDeleteClick}
            className="hover:text-blue-500 text-2xl"
          >
            Supprimer
          </MdDelete>
        )}
      </div>
    </div>
  );
}
export default Comment;
