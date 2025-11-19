"use client";

import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaRegComments } from "react-icons/fa";

import { useRouter } from "next/navigation";

function Tweet({ tweet, onDelete, onLike, currentUser }) {
  const router = useRouter();
  const authorId = tweet.authorId ?? tweet.author;
  const isOwner = currentUser?.id === authorId;

  const handleTweetClick = (e) => {
    e.stopPropagation();
    router.push(`/tweet/${tweet.id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    router.push(`/users/${tweet.authorId}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(tweet.id);
  };

  const handleLikeTweet = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(tweet.id);
    }
  };

  const dateObj = new Date(tweet.createdAt);
  const isDateValid = !isNaN(dateObj.getTime());
  const formattedDate = isDateValid
    ? dateObj.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  return (
    <article
      onClick={handleTweetClick}
      className="border-b border-gray-200 px-4 py-3 cursor-pointer"
    >
      <header className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <Link href={`/users/${tweet.authorId}`} onClick={handleAuthorClick}>
            <img
              src={tweet.authorAvatarUrl || "https://i.goopics.net/g87bze.png"}
              alt={`${tweet.author}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <span
            onClick={handleAuthorClick}
            className="font-bold hover:text-blue-500 cursor-pointer "
          >
            @{tweet.author}
          </span>
          <span className="text-xs text-gray-500 ml-2">· {formattedDate}</span>
        </div>
        {isOwner && (
          <MdDelete
            onClick={handleDeleteClick}
            className="hover:text-blue-500 text-2xl"
          >
            Supprimer
          </MdDelete>
        )}
      </header>
      <p className="mt-2 whitespace-pre-wrap text-md text-white">
        {tweet.content}
      </p>
      <footer className="mt-2 text-xs text-white flex justify-between">
        <button
          onClick={handleLikeTweet}
          className="flex items-center space-x-1 hover:text-blue-500 transition duration-150 relative z-10 cursor-pointer"
        >
          <CiHeart className="text-4xl" />
          <span>{tweet.likes}</span>
        </button>
        <span className="flex items-center space-x-1">
          <FaRegComments className="text-4xl hover:text-blue-500 " />
          <span>{tweet.commentsCount || 0}</span>
        </span>
      </footer>
    </article>
  );
}

export default Tweet;
