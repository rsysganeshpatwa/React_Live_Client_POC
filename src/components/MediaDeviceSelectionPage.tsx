import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

const MediaDeviceSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { url, token } = location.state;

  const [isAudioEnabled, setAudioEnabled] = useState<boolean>(true);

  const [isVideoEnabled, setVideoEnabled] = useState<boolean>(true);

  const handleJoin = () => {
    navigate("/meeting-room", {
      state: {
        url,
        token,
        isAudioEnabled,
        isVideoEnabled,
      },
    });
  };

  return (
    <div>
                
      <div>
                    
        <span>Audio: {isAudioEnabled ? "Enabled" : "Disabled"}</span>
                    
        <button onClick={() => setAudioEnabled(!isAudioEnabled)}>
                        {isAudioEnabled ? "Disable Audio" : "Enable Audio"}
                      
        </button>
                  
      </div>
                
      <div>
                    
        <span>Video: {isVideoEnabled ? "Enabled" : "Disabled"}</span>
                    
        <button onClick={() => setVideoEnabled(!isVideoEnabled)}>
                        {isVideoEnabled ? "Disable Video" : "Enable Video"}
                      
        </button>
                  
      </div>
                <button onClick={handleJoin}>Join Meeting</button>
              
    </div>
  );
};

export default MediaDeviceSelectionPage;
