import React from 'react' ; 
import { Typography , Avatar  } from '@mui/material';

import warningIcon from "../media/warning.png";
import {Grid , Paper } from "@mui/material" ;
const BottomMessage = ({messages}) =>{

    return (
        <Grid container spacing={2}>
            {
                messages.map(
                    (msg,index)=>(
                        <Grid item xs={6} key={index} >
                            <Paper id={"paper"} elevation={24} sx={{p:1 ,display:"flex",alignItems:"center" }}>
                                <Avatar src={warningIcon} alt={"warning"}/>
                                <Typography sx={{fontSize:32 , color:"gold" ,marginLeft:5,fontFamily:"-apple-system"}}> {"  "+msg}</Typography>
                            </Paper>
                        </Grid>
                    )
                )
            }
        </Grid>
    )

}; 
// export default BottomMessage ; 
export default React.memo(BottomMessage) ; 