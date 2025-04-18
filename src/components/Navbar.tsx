'use client';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo or Brand */}
        <Link href="/" className="text-white text-4xl font-semibold tracking-tight">
          SONKHIA
        </Link>

        {/* Right Side Buttons */}
        <div className="space-x-4 text-lg">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition duration-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
