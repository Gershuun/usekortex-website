import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppExplorer } from './components/AppExplorer';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import styles from './App.module.css';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Header />
        <main className={styles.main}>
          <Hero />
          <AppExplorer />
        </main>
        <Footer />
      </Layout>
    </ToastProvider>
  );
}

export default App;