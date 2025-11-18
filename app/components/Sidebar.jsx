"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaEarlybirds } from "react-icons/fa";

import Link from "next/link";

function Sidebar() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id); //
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("authToken", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-54 h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6 mt-5">
        <FaEarlybirds className="text-4xl text-blue-500" />
        <h1 className="text-2xl font-bold">Twitter Clone</h1>
      </div>
      <nav className="flex flex-col h-screen gap-4">
        <Link href="/" className=" hover:text-blue-500 flex items-center gap-4">
          <FaHome className="text-4xl" />
          <span>Accueil</span>
        </Link>

        {userId && (
          <Link
            href={`/users/${userId}`}
            className=" hover:text-blue-500 flex gap-4 items-center"
          >
            <CgProfile className="text-4xl" />
            <span>Mon Profil</span>
          </Link>
        )}

        {/*  
        {userId && (
          <Link href="/settings/profile" className="hover:underline">
            Paramètres
          </Link>
        )} */}
        <div className="mt-24">
          <button
            onClick={handleLogout}
            className="mt-auto bg-blue-500 flex items-center justify-center px-2 text-white gap-2 py-2 rounded hover:bg-red-600"
          >
            <CiLogout className="flex items-center justify-center" />
            <span className="px-7">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
