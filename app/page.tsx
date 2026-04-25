import Hero         from "./sections/Hero"
import About        from "./sections/About"
import Experience   from "./sections/Experience"
import Projects     from "./sections/Projects"
import Skills       from "./sections/Skills"
import Achievements from "./sections/Achievements"
import Contact      from "./sections/Contact"
import Footer       from "./sections/Footer"

/*
  Page section order (mirrors PRIMARY_LINKS + MORE_LINKS in Header.tsx):
  Hero → About → Experience → Projects → Skills → Achievements → Contact

  Coming soon (wired up when ready):
  - ChatBot  — fixed bottom-right corner
  - ScrollToTop — fixed bottom-right, above ChatBot
*/

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  )
}
