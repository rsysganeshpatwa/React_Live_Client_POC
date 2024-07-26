import React, { useEffect, useState } from "react";

import {useLocation, useNavigate}  from "react-router-dom";

const ConnectPage: React.FC = () => {
  const [url, setUrl] = useState<string>("wss://poc-test-7otdfht1.livekit.cloud");

  
  const navigate = useNavigate();
  const location = useLocation();

 // const { paramToken } = location.state;
  //console.log(location.state)
  const [token, setToken] = useState<string>(location.state.token);
  console.log("token",token)

  useEffect(() => {
    if (location.state && location.state.token) {
      setToken(location.state.token);
    }
  }, [location.state]);

  const handleConnect = () => {
     navigate("/media-device-selection", { state: { url, token } });
  };

  return (
    <div>
                
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
                
      <input
        type="text"
        placeholder="Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
                <button onClick={handleConnect}>Connect</button>
              
    </div>
  );
};

export default ConnectPage;
