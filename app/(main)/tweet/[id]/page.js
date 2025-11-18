"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Tweet from "@/app/components/Tweet";
import CommentList from "@/app/components/CommentList";
import CommentForm from "@/app/components/CommentForm";
import { useRouter } from "next/navigation";

export default function TweetDetailPage({ params }) {
  const { id: tweetId } = params;
  const router = useRouter();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (err) {
        console.error("Erreur de parsing de l'utilisateur:", err);
      }
    }
    setIsUserLoaded(true);
  }, []);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    if (!token) return;

    try {
      const tweetRes = await fetch(
        `http://localhost:5000/api/tweets/${tweetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      const tweetData = await tweetRes.json();
      
      setTweet(tweetData);

      const commentsRes = await fetch(
        `http://localhost:5000/api/comments/tweet/${tweetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      const commentsData = await commentsRes.json();
      setComments(commentsData);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tweetId && isUserLoaded) {
      fetchData();
    }
  }, [tweetId, isUserLoaded]);

  const handleNewComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);

    setTweet((prevTweet) => {
      if (prevTweet) {
        return {
          ...prevTweet,

          commentsCount: newComment.commentsCount,
        };
      }
      return prevTweet;
    });
  };
  const handleLikeTweet = async (tweetId) => {
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/tweets/${tweetId}/like`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const updatedTweet = await res.json();

        setTweet((prevTweet) => ({
          ...prevTweet,
          likes: updatedTweet.newLikesCount,
        }));
      } else {
        console.error("Erreur lors du like: La requête a échoué");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel API de like:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Suppression impossible.");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const updatedComment = await res.json();

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: updatedComment.newLikesCount }
              : comment
          )
        );
      }
    } catch (err) {
      console.error("Erreur lors du like:", err);
    }
  };
  const handleDeleteTweet = async (tweetId) => {
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(`http://localhost:5000/api/tweets/${tweetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Suppression impossible");
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Une erreur est survenue lors de la suppression du tweet."
      );
    }
  };

  if (loading || !isUserLoaded)
    return <p>Chargement du tweet et des commentaires...</p>;
  if (!tweet) return <p>Tweet non trouvé.</p>;

  return (
    <div>
      <Tweet
        tweet={tweet}
        onLike={handleLikeTweet}
        currentUser={currentUser}
        onDelete={handleDeleteTweet}
      />

      <CommentForm tweetId={tweetId} onNewComment={handleNewComment} />

      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        onLike={handleLikeComment}
        currentUser={currentUser}
      />
    </div>
  );
}
