import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import LandingWelcomePage from './pages/LandingWelcomePage/LandingWelcomePage';
import SourceSelectionPage from './pages/SourceSelectionPage/SourceSelectionPage';
import DestinationSelectionPage from './pages/DestinationSelectionPage/DestinationSelectionPage';
import RoutePreviewPage from './pages/RoutePreviewPage/RoutePreviewPage';
import LiveNavigationPage from './pages/LiveNavigationPage/LiveNavigationPage';
import DestinationReachedPage from './pages/DestinationReachedPage/DestinationReachedPage';
import NodeEditorPage from './pages/NodeEditorPage/NodeEditorPage';
import CampusMap from './components/CampusMap/CampusMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWelcomePage />} />
        <Route path="/source" element={<SourceSelectionPage />} />
        <Route path="/destination" element={<DestinationSelectionPage />} />
        <Route path="/preview" element={<RoutePreviewPage />} />
        <Route path="/navigate" element={<LiveNavigationPage />} />
        <Route path="/reached" element={<DestinationReachedPage />} />
        <Route path="/editor" element={<NodeEditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
