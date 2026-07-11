import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContactsCard } from './components/ContactsCard';
import { CaptionsCard } from './components/CaptionsCard';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import styles from './App.module.css';
import appCardStyles from './components/AppCard.module.css';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Header />
        <main className={styles.main}>
          <Hero />
          <div className={appCardStyles.grid}>
            <ContactsCard />
            <CaptionsCard />
          </div>
        </main>
        <Footer />
      </Layout>
    </ToastProvider>
  );
}

export default App;
