import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
// import JSMpegPlayer from 'jsmpeg-player';
import JSMpeg from 'jsmpeg-player' ; 
// import JSMpeg from "jsmpeg" ;

const StreamLive = () => {
  const wsUrl = 'ws://localhost:8082/'; // 替換成你的後端WebSocket服務器的URL

  // 用於追蹤錯誤狀態
  const [error, setError] = useState(null);

  useEffect(() => {
    // 定義JSMpegPlayer的實例
    let player;

    try {
      // 嘗試建立JSMpegPlayer實例
      
      // player = new JSMpegPlayer(wsUrl, {
      //   canvas: document.getElementById('video-canvas'),
      // });

      player = new JSMpeg.Player(wsUrl , 
        {
          canvas : document.getElementById('video-canvas')  ,
          data : {
            canvas : {
              width:320 , height:240
            }
          }
      }) ;
      // 清除錯誤狀態
      setError(null);
    } catch (err) {
      // 處理錯誤情況
      setError('無法連接到影像流服務器。');
      console.log("ERRRRRR",err)
      console.error(err);
    }
    console.log("JSPMEG ", error) ; 
    // 清理工作和解構
    return () => {
      if (player) {
        player.destroy();
      }
    };
    
  }, [wsUrl]);
  console.log("JSPMEG ", error) ; 
  return (
    <>
      {/* {error ? <div>{error}</div> : <Typography sx={{color:"gold" , fontSize:35 , fontWeight:'bold',textAlign:"center"}}>
      Cannot connect to webcam !</Typography>}
      <canvas id="video-canvas"/> */}
      {error ? <Typography sx={{color:"gold" , fontSize:35 , fontWeight:'bold',textAlign:"center"}}>
      Cannot connect to webcam !</Typography>:<canvas id="video-canvas"/> } 
      
    </>
  );
};

export default StreamLive;
