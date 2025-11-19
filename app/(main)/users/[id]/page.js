"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import TweetList from "@/app/components/TweetList";
import Link from "next/link";

export default function UserProfilePage({ params }) {
  const { id } = params;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // --- HOOK 1 : Charger l'utilisateur actuel (depuis localStorage) ---
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // --- HOOK 2 : Fonction de récupération des données avec useCallback ---
  const fetchProfile = useCallback(async () => {
    console.log("-> Début de fetchProfile pour l'ID:", id);
    const token = Cookies.get("authToken");
    if (!token) {
      console.log("-> Token manquant, arrêt.");
      setError("Non authentifié");
      setLoading(false);
      return;
    }

    try {
      // Utilisez l'ID directement dans l'URL
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        console.log("-> Réponse réseau non OK:", res.status);
        throw new Error("Impossible de charger le profil");
      }

      const data = await res.json();
      setProfileData(data);
      setLoading(false);
    } catch (err) {
      console.error("-> Erreur dans le try/catch de fetchProfile:", err);
      // Gestion d'erreur améliorée
      if (err.message.includes("400")) setError("ID utilisateur invalide.");
      else setError(err.message);
      setLoading(false);
    }
  }, [id]); // Dépend de l'ID

  // --- HOOK 3 : Appeler fetchProfile quand l'ID est valide ---
  useEffect(() => {
    if (id && id !== "undefined") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId) && numericId > 0) {
        fetchProfile();
      } else {
        setError("ID utilisateur invalide.");
        setLoading(false);
      }
    }
  }, [id, fetchProfile]);
  const handleDeleteTweet = async (tweetId) => {
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tweets/${tweetId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Suppression impossible");
      }

      setProfileData((prevData) => ({
        ...prevData,
        tweets: prevData.tweets.filter((tweet) => tweet.id !== tweetId),
      }));
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tweets/${tweetId}/like`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const updatedTweet = await res.json();

        setProfileData((prevData) => ({
          ...prevData,
          tweets: prevData.tweets.map((tweet) =>
            tweet.id === tweetId
              ? { ...tweet, likes: updatedTweet.newLikesCount }
              : tweet
          ),
        }));
      } else {
        console.error("Erreur lors du like: La requête a échoué");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel API de like:", err);
    }
  };

  if (loading) return <p>Chargement du profil...</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  const { user, tweets } = profileData;
  const isOwner = currentUser && currentUser.id.toString() === id;
  //console.log("Objet utilisateur reçu :", user);

  return (
    <div className="min-h-screen">
      <div className="border-b border-gray-200">
        <div className="bg-gray-300 h-40">
          {user.cover_url && (
            <img
              src={user.cover_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-end relative z-10">
            {isOwner && (
              <Link
                href="/settings/profile"
                className="border border-gray-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-500"
              >
                Éditer le profil
              </Link>
            )}
          </div>

          <div className="relative -mt-20">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 overflow-hidden">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-4xl">
                  👤
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          <div className="mt-4 text-gray-700">
            {user.bio || "Aucune biographie pour le moment."}
          </div>

          <div className="flex space-x-4 mt-4 text-sm text-gray-500">
            <span>**{tweets.length}** Tweets</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
        Tweets
      </h2>
      <TweetList
        tweets={tweets}
        currentUser={currentUser}
        onDelete={handleDeleteTweet}
        onLike={handleLikeTweet}
      />
    </div>
  );
}
