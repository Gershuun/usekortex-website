import { useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppExplorer } from './components/AppExplorer';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import styles from './App.module.css';
import type { KortexApp } from './data/apps';

function App() {
  const [activeAppId, setActiveAppId] = useState<KortexApp['id']>('filters');

  return (
    <ToastProvider>
      <Layout>
        <Header />
        <main className={styles.main}>
          <Hero onSelectApp={setActiveAppId} />
          <AppExplorer activeId={activeAppId} onSelectApp={setActiveAppId} />
        </main>
        <Footer />
      </Layout>
    </ToastProvider>
  );
}

export default App;