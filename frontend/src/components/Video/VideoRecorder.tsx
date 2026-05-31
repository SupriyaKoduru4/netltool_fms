import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import Button from '../UI/Button';
import IconButton from '../UI/IconButton';
import CustomInput from '../Login/CustomInput';

type Phase = 'idle' | 'camera' | 'countdown' | 'recording' | 'playback';

function VideoRecorder() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countKey, setCountKey] = useState(0);
  const [videoTitle, setVideoTitle] = useState('Robotic version 1');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPhase('camera');
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const startCountdown = () => {
    setPhase('countdown');
    setCountdown(3);
    setCountKey((k) => k + 1);
  };

  useEffect(() => {
    if (phase !== 'countdown' || countdown === null) return;
    if (countdown === 0) {
      beginRecording();
      return;
    }
    const t = setTimeout(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
      setCountKey((k) => k + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const beginRecording = () => {
    if (!videoRef.current?.srcObject) return;
    chunksRef.current = [];
    const stream = videoRef.current.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('playback');
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setCountdown(null);
    setRecordingTime(0);
    setPhase('recording');
    timerRef.current = setInterval(() => setRecordingTime((s) => s + 1), 1000);
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();

  const retake = () => {
    setVideoURL(null);
    setRecordingTime(0);
    setPhase('idle');
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSaveVideo = () => {
    const saved = localStorage.getItem("fms_videos");
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }
    const newVideo = {
      id: "v_" + Date.now(),
      title: videoTitle || "Recorded Video",
      duration: formatTime(recordingTime) === "00:00" ? "00:15" : formatTime(recordingTime),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      size: "8.5 MB",
      format: "WEBM • 720p",
      url: videoURL || "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "/video_thumbnail.png",
      transcript: "This is the transcript of the recorded video titled: " + videoTitle + ". In this video, we review key strategic items, updates, and progress for the Founder Management System.",
      blogDraft: "<h1>" + videoTitle + "</h1><p>This blog post was automatically compiled from our video recording. We covered recent updates, progress tracking, and key highlights.</p><h2>Key Highlights</h2><ul><li>Discussed robotic system goals</li><li>Reviewed timeline and core requirements</li></ul>",
      description: "Recorded video explaining updates for " + videoTitle + "."
    };
    list.unshift(newVideo);
    localStorage.setItem("fms_videos", JSON.stringify(list));
    navigate("/videos");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 py-10 font-mono text-black">

     

        <CustomInput
          label='Title for video'
          placeholder='Robotic version 1'
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
        />
      {/* Video Container */}
      <div className="w-full max-w-2xl aspect-video relative bg-[#111] border border-neutral-800 rounded overflow-hidden mb-6 mt-12">


        {/* Idle placeholder */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.2">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.88v6.24a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="text-[11px] tracking-[0.2em] text-neutral-700">Start the camera and recorder what's in you mind</span>
          </div>
        )}

        {/* Live camera */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${
            phase === 'camera' || phase === 'countdown' || phase === 'recording' ? 'block' : 'hidden'
          }`}
          autoPlay
          muted
        />

        {/* Playback */}
        {phase === 'playback' && videoURL && (
          <video
            src={videoURL}
            className="w-full h-full object-cover"
            controls
            autoPlay
          />
        )}

        {/* Countdown overlay */}
        {phase === 'countdown' && countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span
              key={countKey}
              className="text-[96px] font-black text-white leading-none"
              style={{ animation: 'countPop 0.9s ease-out forwards' }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* REC badge */}
        {phase === 'recording' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 border border-neutral-700 rounded px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] tracking-widest text-red-400 font-semibold">REC</span>
            <span className="text-[11px] text-neutral-400 ml-1">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Playback badge */}
        {phase === 'playback' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 border border-neutral-700 rounded px-2.5 py-1">
            <span className="text-[11px] tracking-widest text-green-400 font-semibold">PLAYBACK</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {phase === 'idle' && (
         <Button variant="primary" size="md" text='Start camera' onClick={startCamera}/>
        )}

        {phase === 'camera' && (
            <Button variant="primary" size="md" text='Start Recording' onClick={startCountdown}/>
        )}

        {phase === 'recording' && (
          <Button variant="secondary" size="md" text='Stop Recording' onClick={stopRecording}/>
        )}

        {phase === 'playback' && (
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="primary" size="md" text='Retake' onClick={retake}/>
            <Button variant="primary" size="md" text='Save to Library' onClick={handleSaveVideo}/>
            <a href={videoURL!} download="recording.webm">
              <Button variant="outlineDark" size="md" text='Download'/>
            </a>
            <IconButton icon={<CiEdit size={20} color='black' />} onClick={() => alert('this will allow us to edit the video')} />
          </div>
        )}
      </div>

      {/* Countdown keyframe */}
      <style>{`
        @keyframes countPop {
          0%   { transform: scale(1.6); opacity: 0; }
          20%  { transform: scale(1);   opacity: 1; }
          80%  { transform: scale(1);   opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default VideoRecorder;