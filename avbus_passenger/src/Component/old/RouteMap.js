import React from "react";  
import {Container,Grid} from "@mui/material" ; 
import Station  from "./Station";
import L from "leaflet"
const each_row_display = 4


const RouteMap = ({stations}) => {

        return(
            <Grid container spacing={3}>
                {Array.from({ length: stations.length }).map((_, index) => (
                    <Grid item xs={10 / each_row_display } key={index}>
                     {/* <h3>{String(index)}</h3> */}
                     <Station 
                        station_name={stations[index].station_name} 
                        station_state={stations[index].station_state}
                    />

                    </Grid>
                ))}
            </Grid>
        )

    };


export default RouteMap ; 