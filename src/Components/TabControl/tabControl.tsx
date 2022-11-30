import React, { ReactNode, useEffect, useRef, useState } from "react"
import "./tab.css"

interface TabProps{
    children?: ReactNode
}

const Tab:React.FC<TabProps> = (props : TabProps) =>{
    return(
        <div className="tab">
            {props.children}
        </div>
    )
}

interface TabHeaderProps{
    children?: ReactNode,
    tabChange: number
}

const TabHeader: React.FC<TabHeaderProps> = (props : TabHeaderProps) => {
    const [, setLeft] = useState<string>("0")
    const [, setWidth] = useState<string>("0")


    useEffect(()=>{
        const w = 100 / React.Children.count(props.children)
        const l = (w * (props.tabChange -1))+"%"
        setLeft(l)
        setWidth(`${w}%`)
    }, [props.tabChange, setLeft, React.Children.count(props.children)])

    return(
        <div className="tab-header">
            {props.children}
            
        </div>
    )
}

interface TabHeaderItemProps{
    tabId: number,
    tabChange: number,
    setTabChange: React.Dispatch<React.SetStateAction<number>>,
    title: string
}

const TabHeaderItem: React.FC<TabHeaderItemProps> = (props : TabHeaderItemProps) => {
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

interface TabContentProps{
    children?:ReactNode
}

const TabContent: React.FC<TabContentProps> = (props : TabContentProps) => {
    return(
        <div className="tab-content">
            {props.children}
        </div>
    )
}

interface TabContentItemProps{
    tabId: number,
    open: boolean,
    tabChange: number,
    children?: ReactNode
}

const TabContentItem: React.FC<TabContentItemProps> = (props : TabContentItemProps) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [tabIndex] = useState(props.tabId)
    const [active, setActive] = useState(false)

    useEffect(()=>{
        if (active || props.open){
            if(ref.current){
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