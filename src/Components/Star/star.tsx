import React from "react"
import "./star.css"
import star from "../../assets/icons/rating-star.svg"

interface Props {
    active: boolean
}

const Star: React.FC<Props> = (props: Props) =>{
    return(
        props.active ?
            <img className="star" src={star}/>
        : <></>
    )
}

export default Star