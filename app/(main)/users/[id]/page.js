"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TweetList from "@/app/components/TweetList";
import Link from "next/link";


export default function UserProfilePage({ params }) {
  const { id } = params; 

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    const fetchProfile = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        setError("Non authentifié");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Impossible de charger le profil");
        }

        const data = await res.json();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
   
  }, [id, params]);
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
        `http://localhost:5000/api/tweets/${tweetId}/like`,
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
  console.log("Objet utilisateur reçu :", user);

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
