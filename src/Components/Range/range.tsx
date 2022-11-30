import React, { useState } from "react"
import "./range.css"

interface Props{
    setRatio?: (x:number) => void
    disabled?: boolean
}

const Range: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState(0)

    const valueChange = (e:  any) => {
        const min = e.target.min
        const max = e.target.max
        const val = e.target.value

        let width = (val - min) * 100
        console.log(width)
        if(width === 2500)
            width +=100
        else if(width === 7500)
            width -= 100

        e.target.style.backgroundSize = width / (max - min) + '% 100%'
        setValue(Number(val))
        if(props.setRatio){
            props.setRatio(val/100)
        }
    }
    return (
        <div className="range">
            <div className={`slider-container ${props.disabled ? "slider-container-disabled" : ""}`}>
                <input disabled={props.disabled} className="slider" type={"range"} value={value} min={0} max={100} step={25} 
                    onInput={(e) => valueChange(e)}/> 
            </div>
            <div className="range-span">{value}%</div>
        </div>
    )
}

export default Range