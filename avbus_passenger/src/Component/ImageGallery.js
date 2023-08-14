import React , {useEffect} from "react" ; 
import ReactImageGallery from "react-image-gallery";


import Tp1_a from "../media/Tp1_a.jpg";
import Tp2_a from "../media/Tp2_a.jpg";
import Tp3_a from "../media/Tp3_a.jpg";
import Tp4_a from "../media/Tp4_a.jpg";

const images = [
    {
        original : Tp1_a, 
        // thumbnail : Tp1_a,
        
    },
    {
        original :Tp2_a, 
        // thumbnail : Tp2_a,
    },
    {
        original : Tp3_a,
        // thumbnail : Tp3_a, 
    },
    {
        original : Tp4_a ,
        // thumbnail : Tp4_a ,
    },
]


const ImageGallery =  React.memo(({ImageIndex,setImageIndex}) => {
    // 用來切換image index,避免每次更換顯示項目後圖片元件從頭開始計算
    useEffect(
        () => {
            return ()=>{setImageIndex( (prev)=>(prev+2)%images.length  )}
        }
    )
    return (
        <div className={"ImageCarousel-inner"}>
        <ReactImageGallery 
        autoPlay={1}
        lazyLoad={true}
        slideInterval={4000}
        slideDuration={1000}
        startIndex={ImageIndex}
        showNav={false}
        showFullscreenButton={false}
        items={images} /> 
        </div>
    )

}) ; 

export default React.memo(ImageGallery) ; 

