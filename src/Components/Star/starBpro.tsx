import React from "react"
import "./starBpro.css"
import star from "../../assets/icons/rating-star.svg"

interface Props {
    active: boolean
}

const StarBpro: React.FC<Props> = (props: Props) =>{
    return(
        props.active ?
            <img className="star" src={star}/>
        : <></>
    )
}

export default StarBpro