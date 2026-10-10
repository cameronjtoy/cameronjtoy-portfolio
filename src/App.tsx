import { resume } from './content/resume'
import { Education } from './sections/Education'
import { ExperienceEntry } from './sections/ExperienceEntry'
import { Header } from './sections/Header'
import { ProjectEntry } from './sections/ProjectEntry'
import { Skills } from './sections/Skills'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header resume={resume} />
      <main id="main">
        <section aria-labelledby="experience-heading">
          <h2 id="experience-heading">Experience</h2>
          {resume.experience.map((entry) => (
            <ExperienceEntry key={entry.id} entry={entry} />
          ))}
        </section>
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          {resume.projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </section>
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading">Skills</h2>
          <Skills groups={resume.skills} />
        </section>
        <section aria-labelledby="education-heading">
          <h2 id="education-heading">Education</h2>
          <Education entries={resume.education} />
        </section>
      </main>
    </>
  )
}

export default App
