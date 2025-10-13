"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import MainContainer from "../components/main-container/MainContainer";

export default function HomePage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (!user?.isLoggedIn) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user?.isLoggedIn) return null;

  return (
    <div className="App">
      <MainContainer viewMode={0} />
    </div>
  );
}
