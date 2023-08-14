
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';


// Dubai
import map from "../media/map_big3.png"
const mapBound = [[25.1383,55.3735],[25.1251,55.3950]] ; 

//Dubai final
// import map from "../media/map_final.png" ;
// const mapBound = [[25.1567,55.3598] , [25.10446,55.42231]] ; 

// import map from "../media/TPK_map.png"; 
// const mapBound = [[25.15488,121.38585],[25.14687,121.39796]]

const vicon = require("../media/truck.png") ; 
const stopicon = require("../media/busStop.png") ; 
const nextstopicon = require("../media/destination.png") ; 


const vehicle_icon = L.icon({  iconUrl:vicon , iconSize : [40,40] ,});
const station_icon = L.icon({iconUrl:stopicon,iconSize:[40,40]}) ; 
const next_station_icon = L.icon({iconUrl:nextstopicon , iconSize: [50,50] , }) ; 
const line_options = {
    styles:[
        {color:'red' , weight:5 ,}
    ]
};





const MapComponent = ({ icon_array,fixed_stations ,vehiclePos , next_station }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const Vehicle_markerRef = useRef(null);
  const NextStation_markerRef = useRef(null) ; 
  const RoutingMachine_Ref = useRef(null) ; 

  // const MarkerSetRef = useRef( new Array(Object.keys(fixed_stations).length) ); 
  const MarkerGroupRef = useRef(null) ; 

  useEffect(() => {
    if (!mapRef.current) {
      // 創建地圖
      mapRef.current = L.map(mapContainerRef.current)
      // .setView([25.13248,55.38216], 16.5);
      .setView(vehiclePos , 16) ; 
      
      // 添加地圖圖層(online)
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      //   opacity: 0.8, 
      // }).addTo(mapRef.current);

      // 添加地圖圖層(offline) 
      L.imageOverlay(map , mapBound ,{
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        opacity: 1,
      }).addTo(mapRef.current) ; 
      // 加入站點marker
      //scheme1. 站點marker都是固定不動的, 這樣只要在mount時標記就好不用動
      //scheme2. 下一個抵達站點的marker要特殊色, 如果能覆蓋掉marker最簡單直接
      // -----
      // for (const [i,station] of Object.keys(fixed_stations).entries() ) {
      //   console.log(`Debug station:${station} next_station:${next_station} station==next_station : ${station==next_station}`) ; 
      //   const station_marker = L.marker(fixed_stations[station] ,
      //     //  {icon:  station==next_station? next_station_icon:station_icon})
      //     {icon: station==next_station? next_station_icon:L.icon({iconUrl:icon_array[i] , iconSize: [20,20] , })})
      //   .addTo(mapRef.current) ; 
      // }
      // -----
    }
    // 若地圖不存在就在車輛位置初始化 , 如果已經存在就更新地圖位置變成以車輛為中心. 
    else{
      mapRef.current.panTo(vehiclePos) ; 
    }

    //########## 車輛標記 ##########

    // 移除上一個車輛位置的marker
    if (Vehicle_markerRef.current) {Vehicle_markerRef.current.remove();} 
    // 在地圖上添加車輛標記
    if (vehiclePos) {
      const marker = L.marker(vehiclePos, {icon:vehicle_icon}).addTo(mapRef.current);
      marker.bindPopup('Vehicle Position'); 
      Vehicle_markerRef.current = marker ; 
    }
    // #############################
    // 使用routing-machine來繪製路徑 , 如果路徑已經存在就先移除上一條 
    // (offline時關閉 , 有發現開著這個會影響到地圖的顯示範圍 )

    // if (RoutingMachine_Ref.current){RoutingMachine_Ref.current.remove()}  
    // RoutingMachine_Ref.current = L.Routing.control(
    //     {
    //         // router: L.Routing.osrmv1().route , 
    //         waypoints:[ L.latLng(vehiclePos) , L.latLng(fixed_stations[next_station])  ] , 
    //         show: false  ,
    //         lineOptions:line_options,
    //         createMarker : (i,waypoint,n)=>null , 
    //     }
    // ).addTo(mapRef.current) ; 
    // #############################

  
    // 站點Marker,包含下一站標記 , 
    // 建立MarkerGroup設定為Ref , 這樣後面繪製的時候方便先行清除 
    if (MarkerGroupRef.current){MarkerGroupRef.current.remove()}
    const markerGroup = new Array(Object.keys(fixed_stations).length) ; 
    for (const [i,station] of Object.keys(fixed_stations).entries() ){
      markerGroup[i] = L.marker(fixed_stations[station],
        {icon: station==next_station? next_station_icon:L.icon({iconUrl:icon_array[i] , iconSize: [20,20] , })}
      )
    }
    MarkerGroupRef.current = L.layerGroup(markerGroup).addTo(mapRef.current) ; 



  }, [vehiclePos ,next_station]);


     
  
    useEffect(() => {
      return () => {
        // 在組件卸載時移除地圖
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }, []);

  // return <div ref={mapContainerRef} style={{ height: '100%' , width:'100%' ,borderRadius:"30px"  }} />;
  return (
       <div className={"MapContainer"} ref={mapContainerRef}  />
  );
}; 

export default MapComponent;
