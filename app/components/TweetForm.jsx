"use client";
import { useState } from "react";
import Cookies from "js-cookie";

function TweetForm({ onNewTweet, currentUser }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    const token = Cookies.get("authToken");
    if (!token) {
      alert("Ta session a expiré. Merci de te reconnecter.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tweets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du tweet");
      }
      setContent("");
      onNewTweet?.({
        ...data,
        username: currentUser?.username ?? data.username ?? "Moi",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-4 border-b border-gray-400"
    >
      <textarea
        placeholder="Quoi de neuf ?"
        value={content}
        maxLength="280"
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
        <span>{content.length}/280</span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "Envoi..." : "Tweeter"}
        </button>
      </div>
    </form>
  );
}

export default TweetForm;
