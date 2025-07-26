import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DonghuaProvider } from "./contexts/DonghuaContext";
import routes from "./routes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AppLoader from "./components/common/AppLoader";
import EpisodeNotification from "./components/donghua/EpisodeNotification";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { isLoading } = useAuth();

  console.log("🔄 AppContent render:", { isLoading });

  if (isLoading) {
    console.log("⏳ Showing AppLoader");
    return <AppLoader />;
  }

  console.log("✅ Showing main app content");
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <EpisodeNotification />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  console.log("🚀 App component rendering");
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DonghuaProvider>
            <AppContent />
          </DonghuaProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
