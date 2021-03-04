import React, { useEffect, useRef, useState } from "react"
import "./tab.css"



const Tab = (props) =>{
    


    /*var tabHeader = document.getElementsByClassName("tab-header")[0]
    var tabContent = document.getElementsByClassName("tab-content")[0]

    var headerItems = tabHeader?.getElementsByClassName("tab-header-item")
    
    if (headerItems?.length > 0){
        var headerActive = tabHeader.getElementsByClassName("active")
            if(headerActive.length > 0){
                for(let j=0; j<headerActive.length; j++){
                    headerActive[j].classList.remove("active")
                }
            }

            var contentActive = tabContent.getElementsByClassName("active")
            if (contentActive.length > 0){
                for(var j=0; j< contentActive.length; j++){
                    contentActive[j].classList.remove("active")
                }
            }
        var indicator = tabHeader.getElementsByClassName("indicator")[0]
        indicator.style.width = "calc(100% / " + headerItems.length + ")"
        indicator.style.left = "0"
        var headerItem=headerItems[0]
        var item = document.querySelector("[data-tab-item='"+headerItem?.dataset.tabValue+"']")
        headerItem?.classList.add("active")
        item?.classList.add("active")
    }


    for(let i=0; i<headerItems?.length; i++){
        headerItems[i].addEventListener("click", function (){
            var headerActive = tabHeader.getElementsByClassName("active")
            if(headerActive.length > 0){
                for(let j=0; j<headerActive.length; j++){
                    headerActive[j].classList.remove("active")
                }
            }

            var contentActive = tabContent.getElementsByClassName("active")
            if (contentActive.length > 0){
                for(var j=0; j< contentActive.length; j++){
                    contentActive[j].classList.remove("active")
                }
            }
            var item = document.querySelector("[data-tab-item='"+headerItems[i].dataset.tabValue+"']")
            headerItems[i]?.classList.add("active")
            item?.classList.add("active")
            var indicator = tabHeader.getElementsByClassName("indicator")[0]
            indicator.style.left = `${100*i/headerItems.length}%`
            
        });

        
    }*/

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
        console.log(l)
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