import "@/styles/globals.css";
// import '../components/interactiveBackground7.scss'
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Sora } from "next/font/google";

// Load Sora font
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider {...pageProps}>
            <main className={sora.className}>
                <Component {...pageProps} />
            </main>
        </ClerkProvider>
    );    
}
