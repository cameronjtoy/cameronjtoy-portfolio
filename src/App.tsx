import { lazy, Suspense } from 'react'
import { resume } from './content/resume'
import { NavRail } from './engine/NavRail'
import { ScrollSection } from './engine/ScrollSection'
import { useEnhanced } from './engine/useEnhanced'
import { BnsfSection } from './sections/bnsf/Section'
import { Education } from './sections/Education'
import { ExperienceEntry } from './sections/ExperienceEntry'
import { Header } from './sections/Header'
import { ProjectEntry } from './sections/ProjectEntry'
import { Skills } from './sections/Skills'

// three.js only downloads for visitors who get the 3D experience.
const Stage = lazy(() => import('./engine/Stage'))

const [bnsf, stonyBrook, ...earlier] = resume.experience

function App() {
  const enhanced = useEnhanced()

  return (
    <div className={enhanced ? 'app app--enhanced' : 'app'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {enhanced && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}
      <NavRail />
      <ScrollSection id="hero">
        <Header resume={resume} />
      </ScrollSection>
      <main id="main">
        <ScrollSection id="bnsf" layout="stage">
          <h2>Experience</h2>
          <BnsfSection entry={bnsf} />
        </ScrollSection>
        <ScrollSection id="stony-brook">
          <ExperienceEntry entry={stonyBrook} />
        </ScrollSection>
        <ScrollSection id="earlier">
          {earlier.map((entry) => (
            <ExperienceEntry key={entry.id} entry={entry} />
          ))}
        </ScrollSection>
        <ScrollSection id="personal">
          <h2>Projects</h2>
          {resume.projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </ScrollSection>
        <ScrollSection id="closing">
          <h2>Skills</h2>
          <Skills groups={resume.skills} />
          <h2>Education</h2>
          <Education entries={resume.education} />
        </ScrollSection>
      </main>
    </div>
  )
}

export default App
