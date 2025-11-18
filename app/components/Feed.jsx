"use client";

import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TweetForm from "./TweetForm";
import TweetList from "./TweetList";

const API_BASE_URL = "http://localhost:5000/api";

function Feed() {
  const router = useRouter();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Impossible de lire l'utilisateur stocké", err);
      }
    }
  }, []);

  const fetchTweets = useCallback(async () => {
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/tweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors du chargement des tweets");
      }
      setTweets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      if (
        err.message === "Token invalide" ||
        err.message === "Acces refusé, token manquant"
      ) {
        Cookies.remove("authToken", { path: "/" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      setError("Impossible de récupérer les tweets pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const handleTweetCreated = (tweet) => {
    setTweets((prev) => [
      {
        ...tweet,
        username: tweet.username ?? currentUser?.username ?? "Vous",
      },
      ...prev,
    ]);
  };

  const handleDeleteTweet = async (tweetId) => {
    const token = Cookies.get("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/tweets/${tweetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Suppression impossible");
      }
      setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Une erreur est survenue lors de la suppression du tweet."
      );
    }
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
        setTweets((prevTweets) =>
          prevTweets.map((tweet) =>
            tweet.id === tweetId
              ? { ...tweet, likes: updatedTweet.newLikesCount }
              : tweet
          )
        );
      } else {
        console.error("Erreur lors du like: La requete a échoué");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel API de like:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 border-l border-r border-gray-400 p-6 text-center text-gray-500">
        Chargement du fil...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 border-l border-r border-gray-400">
      <TweetForm onNewTweet={handleTweetCreated} currentUser={currentUser} />
      {error && (
        <div className="px-4 text-sm text-red-500">
          {error} Recharge la page pour réessayer.
        </div>
      )}
      <TweetList
        tweets={tweets}
        onDelete={handleDeleteTweet}
        currentUser={currentUser}
        onLike={handleLikeTweet}
      />
    </div>
  );
}

export default Feed;
