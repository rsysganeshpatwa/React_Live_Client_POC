import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TokenGeneratePage: React.FC = () => {
  const [identity, setIdentity] = useState<string>("");

  const [roomName, setRoomName] = useState<string>("");

  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();
  const handleGenerateToken = async () => {
    const response = await fetch("http://localhost:3000/token", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ identity, roomName }),
    });

    const data = await response.json();

    handleConnect(data.token);
    setToken(data.token);
  };
  const handleConnect = (tok: any) => {
    navigate("/connect", {
      state: {
        token: tok,
      },
    });
  };

  return (
    <div>
                
      <input
        type="text"
        placeholder="Identity"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      />
                
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
                <button onClick={handleGenerateToken}>Generate Token</button>
                {token ? <div>Token: {token}</div> : null}
              
    </div>
  );
};

export default TokenGeneratePage;
