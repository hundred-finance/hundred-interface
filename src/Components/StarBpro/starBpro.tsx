import React from "react"
import "./starBpro.css"
import star from "../../assets/icons/rating-star.svg"
import bpro from "../../assets/images/BPRO-logo.svg"

interface Props {
    active: boolean,
    backstop: boolean
}

const StarBpro: React.FC<Props> = (props: Props) =>{
    return(
        props.active && props.backstop ?
            <div className="star-bpro star-bpro-icons">
                <img src={bpro}/>
                <img src={star}/>
            </div>
        : props.active ?
            <div className="star star-bpro-icons">
                <img src={star}/>
            </div>
        : props.backstop ?
            <div className="bpro star-bpro-icons">
                <img src={bpro}/>
            </div>
        : <></>
    )
}

export default StarBpro