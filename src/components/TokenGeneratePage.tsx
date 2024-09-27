import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography } from "@material-ui/core";
const TokenGeneratePage: React.FC = () => {
  const [identity, setIdentity] = useState<string>("");

  const [roomName, setRoomName] = useState<string>("");
  const [role, setRole] = useState('');

  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();
  const handleGenerateToken = async () => {
    const response = await fetch("https://embedded-poc.rsystems.com/api/token", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ identity, roomName,role }),
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
    <Container maxWidth="sm">
    <Typography variant="h4" align="center" gutterBottom>
      Generate Token
    </Typography>
    <TextField
      label="Identity"
      variant="outlined"
      fullWidth
      value={identity}
      onChange={(e:any) => setIdentity(e.target.value)}
      margin="normal"
    />
    <TextField
      label="Room Name"
      variant="outlined"
      fullWidth
      value={roomName}
      onChange={(e:any) => setRoomName(e.target.value)}
      margin="normal"
    />
    <TextField
  label="Role"
  variant="outlined"
  fullWidth
  value={role}
  onChange={(e) => setRole(e.target.value)}
  margin="normal"
/>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={handleGenerateToken}
      style={{ marginTop: "1rem" }}
    >
      Generate Token
    </Button>
    <TextField
      label="Token"
      variant="outlined"
      fullWidth
      value={token}
      margin="normal"
      InputProps={{
        readOnly: true,
      }}
      style={{ marginTop: "1rem" }}>
      </TextField>

  </Container>
  );
};

export default TokenGeneratePage;
