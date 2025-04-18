import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import InteractiveBackground from "@/components/InteractiveBackground";
import InteractiveBackground2 from "@/components/InteractiveBackground2";
import InteractiveBackground3 from "@/components/InteractiveBackground3";
import InteractiveBackground4 from "@/components/InteractiveBackground4";
import InteractiveBackground5 from "@/components/InteractiveBackground5";
import InteractiveBackground7 from "@/components/InteractiveBackground7";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
    return (
        <main className="relative min-h-screen flex items-center justify-center text-white">
            <Navbar />
          {/* <InteractiveBackground /> */}
          {/* <InteractiveBackground2 /> */}
          {/* <InteractiveBackground3 /> */}
          <InteractiveBackground4 />
          {/* <InteractiveBackground5 /> */}
          {/* <InteractiveBackground7 /> */}
          <div className="z-10 text-center font-sora">
            <p className="text-xl text-gray-100">Ansh Singh Sonkhia welcomes</p>
            <h1 className="text-6xl font-bold mt-2">creative teams</h1>
          </div>
        </main>
    );
}
