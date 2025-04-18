import { useRouter } from "next/router";
import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import InteractiveBackground4 from "@/components/InteractiveBackground4";

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <InteractiveBackground4 />

      {/* Foreground Box */}
      <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome 👋</h1>
        <p className="text-gray-700 mb-6">
          Logged in as:{" "}
          <span className="font-medium">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
