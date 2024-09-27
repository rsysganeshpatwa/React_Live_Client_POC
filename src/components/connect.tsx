import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button, Container, TextField, Typography } from "@material-ui/core";

const ConnectPage: React.FC = () => {
  const [url, setUrl] = useState<string>(
    "https://embedded-poc.rsystems.com/api/livekit"
  );

  const navigate = useNavigate();
  const location = useLocation();

  // const { paramToken } = location.state;
  //console.log(location.state)
  const [token, setToken] = useState<string>(location.state.token);
  console.log("token", token);

  useEffect(() => {
    if (location.state && location.state.token) {
      setToken(location.state.token);
    }
  }, [location.state]);

  const handleConnect = () => {
    navigate("/media-device-selection", { state: { url, token } });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Connect to Room
      </Typography>
      <TextField
        label="URL"
        variant="outlined"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Token"
        variant="outlined"
        fullWidth
        value={token}
        margin="normal"
        onChange={(e) => setToken(e.target.value)}
      />
      <Typography variant="body1" align="center" gutterBottom>
        Click the button below to connect to the room.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConnect}
        style={{ marginTop: "1rem" }}
      >
        Connect
      </Button>
    </Container>
  );
};

export default ConnectPage;
