import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { CanvasCentral } from './components/canvas/CanvasCentral';
import { TopBar } from './components/layout/TopBar';
import { ChallengeModal } from './components/challenges/ChallengeModal';
import { ChallengeBar } from './components/challenges/ChallengeBar';
import { Trophy } from 'lucide-react';

function App() {
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(true); // Open by default

  return (
    <div className="app-container">
      {isChallengeModalOpen && <ChallengeModal onClose={() => setIsChallengeModalOpen(false)} />}
      
      <TopBar onOpenScenarios={() => setIsChallengeModalOpen(true)} />
      <main className="main-content">
        <Sidebar />
        <CanvasCentral />
        <ChallengeBar />
        <PropertiesPanel />
      </main>
    </div>
  );
}

export default App;
