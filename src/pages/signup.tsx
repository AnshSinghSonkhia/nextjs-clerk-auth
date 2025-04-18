import { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";
import InteractiveBackground4 from "@/components/InteractiveBackground4";

export default function Signup() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
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

      {/* Signup Form */}
      <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">Sign Up</h2>

        {!pendingVerification ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 text-gray-900"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-black transition cursor-pointer"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-gray-600">A verification code was sent to your email.</p>
            <input
              type="text"
              placeholder="Enter verification code"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300 text-gray-700"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
