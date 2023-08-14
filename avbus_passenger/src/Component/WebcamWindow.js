import React from "react";
import DPlayer from "dplayer";

function WebcamWindow() {
  const videoRef = useRef(null);
  let player;

  useEffect(() => {
    async function setupPlayer() {
      try {
        player = new DPlayer({
          container: videoRef.current,
          video: {
            url: "your-gstreamer-output-url", // 替換為gstreamer輸出的影像流URL
            type: "auto", // 或者根據影像流的實際格式，使用 "hls" 或 "mp4" 等等
          },
        });
      } catch (error) {
        console.error("初始化播放器失敗：", error);
      }
    }

    setupPlayer();

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return (
    <div className={}>
      <h2>Webcam Live:</h2>
      <div ref={videoRef} />
    </div>
  );
}

export default  WebcamWindow;
