import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Specs } from "@/components/Specs";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Footer } from "@/components/Footer";
import { ChatbotLazy } from "@/components/ChatbotLazy";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Features />
        <Specs />
        <NewsletterForm />
      </main>
      <Footer />
      <ChatbotLazy />
      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
