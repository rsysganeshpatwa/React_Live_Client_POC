import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Typography, Switch, FormControlLabel } from "@material-ui/core";

const MediaDeviceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { url, token } = location.state;

  const [isAudioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setVideoEnabled] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Use Effect to handle media stream
  useEffect(() => {
    if (isVideoEnabled) {
      // Request access to the user's media devices (camera)
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: isAudioEnabled })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });

      // Cleanup function to stop the video stream when the component unmounts
      return () => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      };
    }
  }, [isVideoEnabled, isAudioEnabled]);

  const handleJoin = () => {
    // Stop media stream before navigating
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());

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
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Media Device Selection
      </Typography>
      
      {/* Local Video Preview */}
      {isVideoEnabled && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          />
        </div>
      )}

      <FormControlLabel
        control={<Switch checked={isAudioEnabled} onChange={() => setAudioEnabled(!isAudioEnabled)} />}
        label={isAudioEnabled ? "Audio Enabled" : "Audio Disabled"}
      />
      <FormControlLabel
        control={<Switch checked={isVideoEnabled} onChange={() => setVideoEnabled(!isVideoEnabled)} />}
        label={isVideoEnabled ? "Video Enabled" : "Video Disabled"}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleJoin}
        style={{ marginTop: "1rem" }}
      >
        Join Meeting
      </Button>
    </Container>
  );
};

export default MediaDeviceSelectionPage;
