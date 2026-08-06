import { useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppExplorer } from './components/AppExplorer';
import { WebTools } from './components/WebTools';
import { KortexOffers } from './components/KortexOffers';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import styles from './App.module.css';
import type { KortexAppId } from './data/apps';

function App() {
  const [activeAppId, setActiveAppId] = useState<KortexAppId>('bowl');

  return (
    <ToastProvider>
      <Layout>
        <Header />
        <main className={styles.main}>
          <Hero onSelectApp={setActiveAppId} />
          <AppExplorer activeId={activeAppId} onSelectApp={setActiveAppId} />
          <WebTools />
          <KortexOffers />
        </main>
        <Footer />
      </Layout>
    </ToastProvider>
  );
}

export default App;