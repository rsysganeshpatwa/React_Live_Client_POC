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
interface LocationState {
  url: string;
  token: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}
const MeetingRoomPage: React.FC = () => {
  const location = useLocation();
  const { url, token, isAudioEnabled, isVideoEnabled } = location.state;
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<Participant>();
  const [rerenderRemoteParticipants, setRerenderRemoteParticipants] = useState<boolean>(false); // Add state for rerendering remote participants

  useEffect(() => {
    try {
      const connectToRoom = async () => {
        const room = new Room();
        setRoom(room);
        room.on("participantConnected", (participant: RemoteParticipant) => {
          console.log("participantConnected", participant);
          setRerenderRemoteParticipants(prev => !prev); // Trigger rerender of remote participants
        });
        room.on("participantDisconnected", (participant: RemoteParticipant) => {
          console.log("participantDisconnected", participant);
          setParticipants((prev) =>
            prev.filter((p) => p.sid !== participant.sid)
          );
        });
        room.on(
          "trackSubscribed",
          (track: Track, publication, participant: Participant) => {
            if (track.kind === Track.Kind.Video) {
              console.log("room trackSubscribed", participant);
              setParticipants((prev) => {
                // Check if the participant is already in the list
                if (!prev.find((p) => p.sid === participant.sid)) {
                  // If not, add the participant to the list
                  return [...prev, participant];
                } else {
                  // If yes, simply return the previous state
                  return [...prev];
                }
              });
            }
          }
        );
        room.on("localTrackPublished", () => {
          console.log(
            "connected",
            room.localParticipant.videoTrackPublications
          );
          if (
            Array.from(room.localParticipant.videoTrackPublications.values())
              .length > 0
          ) {
            setLocalParticipant(room.localParticipant);
          } 
        });
      
        await room.connect(url, token);
        if (isAudioEnabled) {
          await room.localParticipant.setMicrophoneEnabled(true);
        }
        if (isVideoEnabled) {
          await room.localParticipant.setCameraEnabled(true);
        }
      };
      connectToRoom();
    } catch (error) {
      console.error("Error connecting to room:", error);
    }
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [url, token, isAudioEnabled, isVideoEnabled]);
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

  useEffect(() => { // Add useEffect to rerender remote participants
    if (room && rerenderRemoteParticipants) {
      console.log(rerenderRemoteParticipants)
      setParticipants((prev) => [...prev]);
      setRerenderRemoteParticipants(false);
    }

  },[rerenderRemoteParticipants]);
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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
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
          key={participant.sid}
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
      </div>

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
        <button
          style={{
            backgroundColor: "lightblue",
            padding: "10px",
            borderRadius: "5px",
            marginLeft: "10px",
          }}
          onClick={() => setRerenderRemoteParticipants(prev => !prev)} // Add button to trigger rerender of remote participants
        >
          Rerender Remote Participants
        </button>
      </div>
    </div>
  );
};
export default MeetingRoomPage;

