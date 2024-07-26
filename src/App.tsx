import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import ConnectPage from "./components/connect";

import MediaDeviceSelectionPage from "./components/MediaDeviceSelectionPage";

import MeetingRoomPage from "./components/MeetingRoomPage";

import TokenGeneratePage from "./components/TokenGeneratePage";

const App: React.FC = () => {
  return (
    <Router>
                
      <Routes>
                    
        <Route path="/token-generate" Component={TokenGeneratePage} />
                    
        <Route path="/connect" Component={ConnectPage} />
                    
        <Route
          path="/media-device-selection"
          Component={MediaDeviceSelectionPage}
        />
                    
        <Route path="/meeting-room" Component={MeetingRoomPage} />
                    
        <Route path="/" Component={TokenGeneratePage} />
                  
      </Routes>
              
    </Router>
  );
};

export default App;
