import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Room,
  Track,
  Participant,
  RemoteParticipant,
  LocalParticipant,
  VideoTrack,
  RemoteTrackPublication,
  AudioTrack,
} from "livekit-client";
import { Grid, Paper, Typography } from "@material-ui/core";
interface LocationState {
  url: string;
  token: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}
const MeetingRoomPage: React.FC = () => {
  const location = useLocation();
  const { url, token, isAudioEnabled, isVideoEnabled } = location.state;

  const [room, setRoom] = useState<Room>();

  const [participants, setParticipants] = useState<Participant[]>([]);

 // useEffect(() => {}, [participants]);

  useEffect(() => {
    const connectToRoom = async () => {
      const room = new Room();
      await room.connect('https://embedded-poc.rsystems.com/api/livekit', token);

      if (isAudioEnabled) {
        await room.localParticipant.setMicrophoneEnabled(true);
      }
      if (isVideoEnabled) {
        await room.localParticipant.setCameraEnabled(true);
      }
      setRoom(room);

      const handleTrackSubscribed = (
        track: Track,
        participant: Participant
      ) => {
        const videoElement = document.getElementById(
          `video-${participant.name}`
        ) as HTMLVideoElement;
        console.log(`handleTrackSubscribed videoElement ${videoElement}`);
        if (videoElement) {
          videoElement.srcObject = new MediaStream([track.mediaStreamTrack]);
        }
      };

      const handleParticipantConnected = (participant: Participant) => {
        setParticipants((prevParticipants) => {
          if (
            !prevParticipants.some(
              (prevParticipant) => prevParticipant.name === participant.name
            )
          ) {
            return [...prevParticipants, participant];
          } else {
            return prevParticipants;
          }
        });

        participant.trackPublications.forEach((publication) => {
          if (publication.track) {
            handleTrackSubscribed(publication.track, participant);
          }
        });
      
        participant.on('trackSubscribed', (track) => handleTrackSubscribed(track, participant));
      };

      // Handle existing participants
      // room.remoteParticipants.forEach(handleParticipantConnected);

      // Listen for new participants joining
      room.on("participantConnected", handleParticipantConnected);

      room.on(
        "trackSubscribed",
        (track: Track, publication, participant: Participant) => {
          if (track.kind === Track.Kind.Video) {
            console.log("room trackSubscribed", participant);
            setParticipants((prev) => [...prev]);
            if (publication.track) {
              handleTrackSubscribed(publication.track, participant);
            }
          }
        }
      );
      
        handleParticipantConnected(room.localParticipant);
      
        room.remoteParticipants.forEach(handleParticipantConnected);
  
     
    };

    connectToRoom(); // Cleanup on component unmount

    return () => {
      room?.disconnect();
    };
  }, [token, url]);

  const handleMuteUnmute = (trackType: "audio" | "video") => {
    if (room) {
      const localParticipant = room.localParticipant as LocalParticipant;
      if (trackType === "audio") {
        localParticipant.setMicrophoneEnabled(
          !localParticipant.isMicrophoneEnabled
        );
      } else if (trackType === "video") {
        localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
      }
    }
  };
  const handleDisconnect = () => {
    if (room) {
      room.disconnect();
    }
  };

  const renderParticipantVideo = (participant: Participant) => {
    const videoTracks = Array.from(participant.trackPublications.values())[1];
    const audioTracks = Array.from(participant.trackPublications.values())[0];
    console.log(`videoTracks ${videoTracks}`);
    console.log(
      `participant ${JSON.stringify(participant.videoTrackPublications)}`
    );
    if (!videoTracks) {
      return null;
    }
    return (
      <video
        key={videoTracks.trackSid}
        ref={(ref) => {
          if (ref) {
            (videoTracks.track as VideoTrack).attach(ref);
            (audioTracks.track as AudioTrack).attach(ref);
          }
        }}
        controls
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%" }}
      />
    );
  };
  return (
    <div>
      {/* <div style={{ display: "flex", flexWrap: "wrap" }}>
        {localParticipant && (
          <div
            style={{
              width: 400,
              height: 200,
              margin: 5,
              backgroundColor: "#000",
            }}
          >
            <span style={{ color: "#fff" }}>{localParticipant.identity}</span>
            {renderParticipantVideo(localParticipant)}
          </div>
        )}
        {participants.map((participant) => (
          <div
            key={participant.name}
            style={{
              width: 400,
              height: 200,
              margin: 5,
              backgroundColor: "#fff", // Change color to white
            }}
          >
            <span style={{ color: "#fff" }}>{participant.identity}</span>
            {renderParticipantVideo(participant)}
          </div>
        ))}
      </div> */}
       
      <Grid container spacing={2}>
             
        {participants.map((participant) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={participant.name}>
                     
            <Paper elevation={3} style={{ padding: 10 }}>
                         
              <Typography variant="h6" gutterBottom>
                             {participant.name}
                           
              </Typography>
                         
              <video
                id={`video-${participant.name}`}
                autoPlay
                muted={false}
                style={{ width: "100%", height: "auto" }}
              />
                       
            </Paper>
                   
          </Grid>
        ))}
           
      </Grid>
      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            borderRadius: "5px",
            marginRight: "10px",
          }}
          onClick={() => handleMuteUnmute("audio")}
        >
          Mute/Unmute Mic
        </button>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            borderRadius: "5px",
            marginRight: "10px",
          }}
          onClick={() => handleMuteUnmute("video")}
        >
          Hide/Show Video
        </button>
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            borderRadius: "5px",
          }}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};
export default MeetingRoomPage;
