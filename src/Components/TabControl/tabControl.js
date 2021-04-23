import React, { useEffect, useRef, useState } from "react"
import "./tab.css"



const Tab = (props) =>{
    return(
        <div className="tab">
            {props.children}
        </div>
    )
}

const TabHeader = (props) => {
    const [left, setLeft] = useState("0")
    const [width, setWidth] = useState(0)


    useEffect(()=>{
        var w = 100 / props.children.length
        var l = (w * (props.tabChange -1))+"%"
        setLeft(l)
        setWidth(w+"%")
    }, [props.tabChange, setLeft, props.children.length])

    return(
        <div className="tab-header">
            {props.children}
            <span className="indicator"
                style={
                    {
                        left:left,
                        width:width
                    }}>

                </span>
        </div>
    )
}

const TabHeaderItem = (props) => {
    const [tabIndex] = useState(props.tabId)
    const [active, setActive] = useState(false)

    useEffect(()=>{
        if (props.tabChange === tabIndex){
            setActive(true)
        }else{
            setActive(false)
        }

    }, [props.tabChange, setActive, tabIndex])

    return(
        <div className={`tab-header-item ${active ? "active" : ""}`} onClick={()=>{props.setTabChange(tabIndex)}}>
            {props.title}
        </div>
    )
}

const TabContent = (props) => {
    return(
        <div className="tab-content">
            {props.children}
        </div>
    )
}

const TabContentItem = (props) => {
    const ref = useRef(null)
    const [tabIndex] = useState(props.tabId)
    const [active, setActive] = useState(false)

    useEffect(()=>{
        if (active || props.open){
            if(ref){
                ref.current.scrollTop = 0
            }
        }
    }, [active, props.open])

    useEffect(()=>{
        
        if (props.tabChange === tabIndex){
            setActive(true)
        }else{
            setActive(false)
        }

    }, [props.tabChange, setActive, tabIndex])

    return(
        <div ref={ref} className={`tab-content-item ${active ? "active" : ""}`}>
            {props.children}
        </div>
    )
}

export {Tab, TabHeader, TabHeaderItem, TabContent, TabContentItem}