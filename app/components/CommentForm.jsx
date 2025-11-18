"use client";
import { useState } from "react";
import Cookies from "js-cookie";

function CommentForm({ tweetId, onNewComment }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const token = Cookies.get("authToken");
    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, tweet_id: tweetId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      onNewComment(newComment);
      setContent("");
    } else {
      console.log("Erreur");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b">
      <textarea
        placeholder="Postez votre réponse..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Répondre
      </button>
    </form>
  );
}

export default CommentForm;
