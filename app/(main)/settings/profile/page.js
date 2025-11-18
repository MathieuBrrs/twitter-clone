"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";

export default function EditProfilePage() {

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setBio(userData.bio || "");
      setAvatarUrl(userData.avatar_url || "");
      setCoverUrl(userData.cover_url || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = Cookies.get("authToken");

    
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        
        bio: bio,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
      }),
    });

    if (res.ok) {
      const responseData = await res.json();

      if (responseData && responseData.user) {
        
        localStorage.setItem("user", JSON.stringify(responseData.user));
        setMessage("Profil mis à jour avec succès !");

        
        router.push(`/users/${responseData.user.id}`);
      } else {
        setMessage(
          "Mise à jour réussie, mais données manquantes pour la redirection."
        );
      }
    } else {
      const errorData = await res.json();
      setMessage(errorData.error || "Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier le Profil</h1>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("succès") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
          />
        </div>

        
        <div>
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL Avatar
          </label>
          <input
            type="text"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
          />
        </div>

        
        <div>
          <label
            htmlFor="coverUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL Couverture
          </label>
          <input
            type="text"
            id="coverUrl"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sauvegarder les modifications
        </button>
      </form>
    </div>
  );
}
