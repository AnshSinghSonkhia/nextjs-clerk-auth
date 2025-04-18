import { useState } from "react";
import { useRouter } from "next/router";
import { useSignIn } from "@clerk/nextjs";
import InteractiveBackground4 from "@/components/InteractiveBackground4";

export default function Login() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.log(result);
      }
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors: unknown[] }).errors)
      ) {
        const firstError = (err as { errors: { message?: string }[] }).errors[0];
        setError(firstError?.message || "An error occurred");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <InteractiveBackground4 />

      {/* Foreground Login Box */}
      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl backdrop-blur-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 border-gray-300"
              placeholder="your@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 border-gray-300"
              placeholder="your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
          >
            Sign In
          </button>
            <p className="text-center text-sm text-black mt-4">
                Don&apos;t have an account?{" "}
                <span
                    onClick={() => router.push("/signup")}
                    className="text-blue-600 hover:underline cursor-pointer"
                >
                    Sign up
                </span>
            </p>    
        </form>
      </div>
    </div>
  );
}
