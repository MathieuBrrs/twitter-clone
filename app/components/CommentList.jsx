"use client";
import Comment from "./Comment";

function CommentList({ comments, onDelete, onLike, currentUser }) {
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
          onLike={onLike}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

export default CommentList;
