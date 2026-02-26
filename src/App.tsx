import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import AdDetailsPage from './pages/AdDetails';
import PostAdPage from './pages/PostAd';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import CategoryPage from './pages/Category';
import SearchPage from './pages/Search';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ad/:id" element={<AdDetailsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post-ad" element={<PostAdPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}
