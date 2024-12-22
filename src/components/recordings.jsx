"use client";

import { Flex, Select, Typography } from "antd";
import { useRef, useState } from "react";
import "../styles/recordings.css";
import axios from "../utils/axios";
import Button from "./button";

const { Title } = Typography;

const Recordings = () => {
  // State variables to manage recording status, chunks, and merged audio URL
  const [recordTime, setRecordTime] = useState(10000); // Default recording time is 10 seconds
  const [isRecording, setIsRecording] = useState(false); // To track if recording is ongoing
  const [chunks, setChunks] = useState([]); // Holds URLs of recorded chunks
  const [mergedAudioUrl, setMergedAudioUrl] = useState(null); // URL of the merged audio from the server
  const [isMerging, setIsMerging] = useState(false); // To track if merging is in progress
  const mediaRecorderRef = useRef(null); // Reference to MediaRecorder instance
  const audioChunksRef = useRef([]); // Stores raw audio chunks

  const startRecording = async () => {
    if (isRecording) return; // Prevent multiple recordings simultaneously
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    // Handle audio data availability
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    // Handle stopping of recording
    mediaRecorder.onstop = async () => {
      setIsRecording(false);
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const chunkUrl = URL.createObjectURL(audioBlob);
      setChunks((prevChunks) => [...prevChunks, chunkUrl]);

      // Send recorded chunk to the server
      const formData = new FormData();
      formData.append("audio", audioBlob, `chunk-${Date.now()}.webm`);
      try {
        await axios.post("/audio/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Chunk sent successfully");
      } catch (error) {
        console.error("Error sending chunk:", error);
      }

      // Clear stored audio chunks
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current = mediaRecorder;

    // Start recording
    mediaRecorder.start();

    // Automatically stop recording after the specified time
    setTimeout(() => {
      mediaRecorderRef.current.stop();
    }, recordTime);

    setIsRecording(true);
  };

  // Function to manually stop recording
  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Function to merge recorded chunks
  const mergeChunks = async () => {
    try {
      setIsMerging(true);
      const response = await axios.post("/audio/merge");
      console.log("Merge response:", response);
      alert("Audio chunks merged successfully!");
    } catch (error) {
      console.error("Error merging chunks:", error);
    } finally {
      setIsMerging(false);
    }
  };


  // Function to remove merged audio from the server
  const removeMergedAudio = async () => {
    try {
      setMergedAudioUrl(null);
      const response = await axios.delete("/audio/remove");
      console.log("Remove response:", response);
      alert("Audio removed successfully!");
    } catch (error) {
      console.error("Error removing audio:", error);
    }
  };
  
  // Function to retrieve the merged audio URL from the server
  const retrieveAudio = async () => {
    try {
      const response = await axios.get("/audio/retrieve");
      setMergedAudioUrl(response.data.url);
    } catch (error) {
      console.error("Error retrieving merged audio:", error);
    }
  };

  return (
    <div className="wrapper">
      <Title mark level={3}>
        Record Audio
      </Title>
      <div className="buttons">
        <Flex vertical gap="middle">
          <Flex gap="middle" wrap>
            <h3 style={{ color: "white" }}>Select Duration</h3>
            <Select
              defaultValue={recordTime}
              style={{ width: 120 }}
              onChange={(val) => setRecordTime(val)}
              options={[
                { value: 10000, label: "10 Sec" },
                { value: 20000, label: "20 Sec" },
                { value: 30000, label: "30 Sec" },
              ]}
            />
          </Flex>
          <Flex gap="middle" wrap>
            <Button
              backgroundColor="green"
              text="Start"
              callback={startRecording}
              disabled={isRecording}
            />
            <Button
              backgroundColor="red"
              text="Stop"
              callback={stopRecording}
            />
            <Button
              disabled={isRecording || isMerging}
              backgroundColor="blue"
              text="Merge"
              callback={mergeChunks}
            />
            <Button
              disabled={isRecording}
              backgroundColor="orange"
              text="Retrieve"
              callback={retrieveAudio}
            />
            <Button
              disabled={isRecording}
              backgroundColor="purple"
              text="Remove"
              callback={removeMergedAudio}
            />
          </Flex>
        </Flex>
      </div>
      {mergedAudioUrl && (
        <div>
          <h2 style={{ marginBottom: "24px" }}>Merged Audio</h2>
          <audio controls autoPlay>
            <source src={mergedAudioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {/* {chunks.length > 0 && (
        <div>
          <h2>Recorded Chunks</h2>
          <ol className="chunks-list">
            {chunks.map((chunk, index) => (
              <li key={index}>
                <audio controls>
                  <source src={chunk} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ol>
        </div>
      )} */}
    </div>
  );
};

export default Recordings;
