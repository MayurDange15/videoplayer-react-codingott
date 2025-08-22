import { useEffect, useRef, useState } from "react";
import {
  LuCirclePause,
  LuCirclePlay,
  LuFullscreen,
  LuStepBack,
  LuStepForward,
  LuTvMinimalPlay,
  LuVolume2,
  LuVolumeX,
} from "react-icons/lu";

const VideoPlayer = () => {
  const container = useRef(null);
  const videoTag = useRef(null);
  const progressTag = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [volumeRanger, setVolumeRanger] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const disableRightClick = (event) => {
    event.preventDefault();
  };

  const playAndPause = () => {
    const videoEl = videoTag.current;
    if (!videoEl) {
      return;
    }

    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const fullscreen = () => {
    const containerEl = container.current;
    if (!containerEl) {
      return;
    }

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerEl.requestFullscreen) {
        containerEl.requestFullscreen();
      } else if (containerEl.mozRequestFullScreen) {
        containerEl.mozRequestFullScreen();
      } else if (containerEl.webkitRequestFullscreen) {
        containerEl.webkitRequestFullscreen();
      } else if (containerEl.msRequestFullscreen) {
        containerEl.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const updateProgressOnClick = (event) => {
    const videoEl = videoTag.current;
    const progressEl = progressTag.current;
    if (!videoEl || !progressEl) {
      return;
    }

    const rect = progressEl.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;
    videoEl.currentTime = newProgress;
  };

  const seek = (time) => {
    const videoEl = videoTag.current;
    if (!videoEl) {
      return;
    }

    videoEl.currentTime += time;
  };

  const volumeControl = (event) => {
    const videoEl = videoTag.current;
    if (!videoEl) {
      return;
    }
    setVolume(event.target.value);
    videoEl.volume = event.target.value;
  };

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  function formatDuration(duration) {
    console.log(duration);
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(duration / 3600);
    if (hours === 0) {
      return `${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`;
    }
  }

  // Finding video duration and current time
  useEffect(() => {
    const videoEl = videoTag.current;
    if (!videoEl) {
      return;
    }

    // Finding video duration
    const handleLoadedMetaData = () => {
      setDuration(videoEl.duration);
    };
    videoEl.addEventListener("loadedmetadata", handleLoadedMetaData);

    // Finding video current time
    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
      setProgress((videoEl.currentTime / videoEl.duration) * 100);
    };
    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetaData);
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div ref={container} className="w-full mx-auto relative">
      <video
        ref={videoTag}
        src="/test.mp4"
        onContextMenu={disableRightClick}
      ></video>
      <div className="p-4 bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full space-y-3">
        <div className="flex text-white justify-between items-center">
          {/* buttons start */}
          <div className="flex items-center gap-2">
            {/* branding start */}
            {/* <img src="/logo.png" alt="logo" className="w-[24px]" /> */}
            <LuTvMinimalPlay />
            <h1 className="font-semibold text-base mt-px">Brand Name</h1>
          </div>
          <div>
            {Number.isFinite(currentTime)
              ? formatDuration(currentTime)
              : "00:00"}{" "}
            / {Number.isFinite(duration) ? formatDuration(duration) : "00:00"}
            {/*duration */}
          </div>
        </div>
        {/*controls start */}
        <div
          className="h-[15px] bg-white"
          onClick={updateProgressOnClick}
          ref={progressTag}
        >
          {/*progressbar full white background */}
          <div
            className="bg-rose-400 h-full"
            style={{ width: `${progress}%` }}
          />
          {/*progressbar how much completed */}
        </div>
        <div className="flex text-white justify-between items-center">
          {/* buttons start */}
          <div className="flex items-center gap-3">
            <button
              className="active:scale-95 transition-transform"
              onClick={() => seek(-10)}
            >
              <LuStepBack />
              {/* button step backward */}
            </button>
            <button
              onClick={playAndPause}
              className="active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <LuCirclePause className="w-8 h-8" />
              ) : (
                <LuCirclePlay className="w-8 h-8" />
              )}
              {/* button play pause */}
            </button>
            <button
              className="active:scale-95 transition-transform"
              onClick={() => seek(10)}
            >
              <LuStepForward />
              {/* button step forward */}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="active:scale-95 transition-transform relative"
              onClick={() => {
                setVolumeRanger(!volumeRanger);
              }}
            >
              {volumeRanger && (
                <input
                  onChange={volumeControl}
                  value={volume}
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  className="absolute -top-0 right-5"
                />
              )}
              {volume > 0 ? <LuVolume2 /> : <LuVolumeX />}

              {/* button volume max */}
            </button>
            <button
              onClick={fullscreen}
              className="active:scale-95 transition-transform"
            >
              <LuFullscreen />
              {/* button fullscreen */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
