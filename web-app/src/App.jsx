import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SubjectUpload from './pages/SubjectUpload';
import Correction from './pages/Correction';
import ChatBot from './pages/ChatBot';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SubjectUpload />} />
          <Route path="/correction" element={<Correction />} />
          <Route path="/chat" element={<ChatBot />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
