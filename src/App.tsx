import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import SleepPage from './pages/sleep/SleepPage';
import NotesPage from './pages/notes/NotesPage';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected App Routes */}
                    <Route path="/app" element={<ProtectedRoute />}>
                        <Route element={<Layout><Outlet /></Layout>}>
                            <Route index element={<Dashboard />} />
                            <Route path="sleep" element={<SleepPage />} />
                            <Route path="notes" element={<NotesPage />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
