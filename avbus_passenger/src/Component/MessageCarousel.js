import React , {useState , useEffect} from 'react';
import Typography from '@mui/material/Typography';

const MessageCarousel = ({ messages }) => {

    const [ currentMessageIndex , setCurrentMessageIndex] = useState(0) ; 

    useEffect(
        ()=>{
            const handleAnimationEnd = () =>{
                console.log("Detect animationend")
                setCurrentMessageIndex((prev)=> (prev+1) % messages.length )
            }; 
            const marqueeElement = document.querySelector(".marquee"); 
            marqueeElement.addEventListener("animationiteration" , handleAnimationEnd) ;

            return () => {
                marqueeElement.removeEventListener("animationiteration" , handleAnimationEnd)
            }
        } , [messages] 
    );

    
    return (
        <div className="marquee">
            <Typography variant="h2" sx={{textAlign:"center"}}>
              {messages[currentMessageIndex]}
            </Typography>
        </div>
    )

};

export default MessageCarousel;
