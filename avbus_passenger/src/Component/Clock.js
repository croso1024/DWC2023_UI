import React , {useState , useEffect} from "react"; 
import { Typography } from "@mui/material";

const Clock = ({text}) => {

    const [time ,setTime ] = useState(new Date()) ; 

    useEffect( 
        ()=>{
            const interval = setInterval( ()=>setTime(new Date()) , 10000) ; 
            return () =>{clearInterval(interval)} 
        }  ,  []
    );
    // it use "h3" so that be affect by the css with same level tag 
    const timeHours = time.getHours()<=9? "0"+String(time.getHours()) : String(time.getHours()) ;
    const timeMinute = time.getMinutes()<=9? "0"+String(time.getMinutes()):String(time.getMinutes()) ; 
    
    //return text? <h1>{`${timeHours}:${timeMinute} ${text}`}</h1>:<h1>{`${timeHours}:${timeMinute}`}</h1>
    return text? (
        <Typography sx={{fontSize:45 , fontWeight:'bold' ,fontFamil:"apple-system", color:"gold" }}>{`${timeHours}:${timeMinute} ${text}`}</Typography>
    ):(
        <Typography sx={{fontSize:45, fontWeight:'bold',fontFamil:"apple-system", color:"gold" }}>{`${timeHours}:${timeMinute}`}</Typography>
    )

}

export default Clock  ; 