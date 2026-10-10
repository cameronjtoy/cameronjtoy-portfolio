import { lazy, Suspense, useState } from 'react'
import { resume } from './content/resume'
import { NavRail } from './engine/NavRail'
import { ScrollSection } from './engine/ScrollSection'
import { StageBoundary } from './engine/StageBoundary'
import { useEnhanced } from './engine/useEnhanced'
import { BnsfSection } from './sections/bnsf/Section'
import { ClosingSection } from './sections/closing/Section'
import { EarlierSection } from './sections/earlier/Section'
import { Header } from './sections/Header'
import { PersonalSection } from './sections/personal/Section'
import { StonyBrookSection } from './sections/stony-brook/Section'

// three.js only downloads for visitors who get the 3D experience.
const Stage = lazy(() => import('./engine/Stage'))

const [bnsf, stonyBrook, ...earlier] = resume.experience

function App() {
  const capable = useEnhanced()
  const [stageFailed, setStageFailed] = useState(false)
  const enhanced = capable && !stageFailed

  return (
    <div className={enhanced ? 'app app--enhanced' : 'app'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {enhanced && (
        <StageBoundary onError={() => setStageFailed(true)}>
          <Suspense fallback={null}>
            <Stage />
          </Suspense>
        </StageBoundary>
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
        <ScrollSection id="stony-brook" layout="split">
          <StonyBrookSection entry={stonyBrook} />
        </ScrollSection>
        <ScrollSection id="earlier" layout="split">
          <EarlierSection entries={earlier} />
        </ScrollSection>
        <ScrollSection id="personal" layout="split">
          <h2>Projects</h2>
          <PersonalSection projects={resume.projects} />
        </ScrollSection>
        <ScrollSection id="closing">
          <ClosingSection resume={resume} />
        </ScrollSection>
      </main>
    </div>
  )
}

export default App
