import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PlantList from "./pages/PlantList";
import CalendarPage from "./pages/CalendarPage";
import Wishlist from "./pages/Wishlist";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Fertilizers from "./pages/Fertilizers";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center mt-5">Lade...</div>;

  return (
    <Router>
      <Routes>
        {/* Öffentliche Seiten */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />

        {/* Geschützte Seiten */}
        {user ? (
          <Route
            path="*"
            element={
              <Layout user={user} onLogout={() => supabase.auth.signOut()}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/kalender" element={<CalendarPage />} />
                  <Route path="/pflanzen" element={<PlantList />} />
                  <Route path="/duengemittel" element={<Fertilizers />} />
                  <Route path="/wunschliste" element={<Wishlist />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            }
          />
        ) : (
          // Nicht eingeloggt → immer zur Landing Page
          <Route path="*" element={<Navigate to="/landing" />} />
        )}
      </Routes>
    </Router>
  );
}
