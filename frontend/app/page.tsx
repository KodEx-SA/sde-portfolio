import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import GitHub from "./sections/GitHub";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ChatBot from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <GitHub />
      <Achievements />
      <Contact />
      <Footer />

      {/* ======================== toggle buttons for scroll-to-top and chatbot ======================== */}
      <ScrollToTop />
      <ChatBot />
    </main>
  );
}
