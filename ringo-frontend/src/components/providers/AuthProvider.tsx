"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/userSlice";
import { setLoading } from "@/redux/loadingSlice";
import { fetchUserChats } from "@/redux/chatsSlice";
import socket from "@/utils/Socket";
import LoadingBar from "../loading-bar/LoadingBar";
import type { RootState, AppDispatch } from "@/redux/store";

const BACKEND_URL = "http://localhost:5000";
const AuthContext = createContext<{ logout: () => void } | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      dispatch(setLoading(true));
      const token = localStorage.getItem("ringoToken");

      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/verify`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data.user));

            // ✅ Using thunk safely
            await dispatch(fetchUserChats(token)).unwrap();
          } else {
            handleInvalidToken();
          }
        } catch {
          handleInvalidToken();
        }
      } else {
        handleInvalidToken();
      }

      setTokenChecked(true);
      dispatch(setLoading(false));
    };

    const handleInvalidToken = () => {
      localStorage.removeItem("ringoToken");
      dispatch(setUser(null));
    };

    validateToken();
  }, [dispatch]);

  useEffect(() => {
    if (tokenChecked && user?.isLoggedIn) {
      if (!socket.connected) socket.connect();

      socket.on("connect", () => {
        user.chats.forEach((chat: any) => {
          socket.emit("joinRoom", chat._id);
        });
      });
    }
  }, [tokenChecked, user]);

  const logout = () => {
    localStorage.removeItem("ringoToken");
    dispatch(setUser(null));
    if (socket.connected) socket.disconnect();
    router.push("/login");
  };

  if (!tokenChecked || isLoading) {
    return (
      <div className="App">
        <LoadingBar loading={isLoading} />
      </div>
    );
  }

  return <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext)!;