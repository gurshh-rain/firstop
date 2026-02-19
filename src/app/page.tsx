import Navbar from "./components/Navbar";
import LoadingScreen from "./components/Loadingscreen";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Waitlist from "./components/Waitlist";
import Footer from "./components/Footer";
import Link from "next/link";


export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <LoadingScreen />
      <Navbar />
      <Hero />
      <Features />
      <Waitlist />
      <Footer />
    </main>
  );
}