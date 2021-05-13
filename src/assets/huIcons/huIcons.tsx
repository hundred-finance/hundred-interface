import React from "react"
import "./style.css"

interface Props{
    size?: string,
    darkMode?: boolean,
    color?: string,
    width?: string,
    height?: string,
    style?: React.CSSProperties,
    className?: string
}

const HuLogo : React.FC<Props> = (props : Props) => {
    const style: React.CSSProperties = {
        width: `${props.size ? props.size : "120px"}`,
        height: `${props.size ? props.size : "120px"}`
    }

    const cls1: React.CSSProperties = {
        fill: 'none',
        stroke: `${props.darkMode ? '#fff' :'#212121'}`,
        strokeLinecap: 'round',
        strokeMiterlimit: 10,
        strokeWidth: '25.32px'
    }

    const cls2: React.CSSProperties = {
        fill:'#11a2ea'
    }

    const cls3: React.CSSProperties = {
        fill: `${props.darkMode ? '#fff' :'#212121'}`
    }

    return (
        <svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style={style}>
            <line style={cls1} className="cls-1" x1="45.85" y1="239.67" x2="45.85" y2="626.81"/>
            <path style={cls2} className="cls-2" d="M368.77,238c105.71,0,155.94,55.88,179.47,102.75,25,49.86,25.31,99.17,25.31,101.25,0,.41.41,45.48,22.69,89.44,29,57.19,80.44,86.19,153,86.19,96.94,0,175.8-78.87,175.8-175.8q0-2.21-.06-4.41c-2.35,94.9-80.28,171.39-175.74,171.39-72.51,0-124-29-153-86.19-22.28-44-22.69-89-22.69-89.45,0-2.07-.28-51.38-25.31-101.24-23.53-46.87-73.76-102.75-179.47-102.75-54.42,0-105.81,21.42-144.7,60.32s-60.32,90.28-60.32,144.7c0,1.47,0,2.94.06,4.41,1.12-52.78,22.42-102.45,60.26-140.29C263,259.46,314.35,238,368.77,238Z"/>
            <path style={cls3} className="cls-3" d="M893.9,297.17c-38.9-38.9-90.29-60.31-144.71-60.31a204.7,204.7,0,0,0-109.8,31.88A14.61,14.61,0,0,0,655,293.42a175.5,175.5,0,0,1,94.15-27.35c95.46,0,173.39,76.48,175.74,171.39q.06,2.21.06,4.41c0,96.93-78.86,175.8-175.8,175.8-72.51,0-124-29-153-86.19-22.28-44-22.69-89-22.69-89.44,0-2.08-.28-51.39-25.31-101.25C524.71,293.92,474.48,238,368.77,238c-54.42,0-105.81,21.42-144.7,60.32-37.84,37.84-59.14,87.51-60.26,140.29,1.12,52.78,22.42,102.45,60.26,140.29,38.89,38.89,90.28,60.31,144.7,60.31a204.47,204.47,0,0,0,112.44-33.58,14.61,14.61,0,1,0-16-24.44A175.3,175.3,0,0,1,368.77,610C273.31,610,195.38,533.55,193,438.65q-.06-2.2-.06-4.41c0-96.94,78.87-175.8,175.8-175.8,72.52,0,124,28.86,152.92,85.77,22.24,43.73,22.64,88.57,22.64,89,0,2.09.3,51.59,25.34,101.66,23.55,47.08,73.8,103.19,179.52,103.19,54.42,0,105.81-21.42,144.71-60.31,37.84-37.84,59.13-87.51,60.25-140.29C953,384.68,931.74,335,893.9,297.17Z"/>
            <path style={cls3} className="cls-3" d="M497.58,764.41v-95c0-4.2,2.17-6.37,6.52-6.37,4.19,0,6.21,2.17,6.21,6.37v34.93c5.43-4.19,11-5.75,17.7-5.75a30.22,30.22,0,0,1,30,30.12v35.71c0,3.57-2.17,6.37-6.36,6.37s-6.52-2.8-6.52-6.37V728.7a17.39,17.39,0,0,0-34.78,0v35.71c0,3.57-2,6.37-6.21,6.37A6.43,6.43,0,0,1,497.58,764.41Z"/>
            <path style={cls3} className="cls-3" d="M624.11,705v59.46a6.3,6.3,0,0,1-6.37,6.37c-4.19,0-6.36-2.49-6.52-6.06-5.43,3.88-11.17,6.06-17.23,6.06a30.28,30.28,0,0,1-30.27-30.12V705a6.33,6.33,0,0,1,6.52-6.37c4.19,0,6.36,2.18,6.36,6.37v35.71a17.31,17.31,0,1,0,34.62,0V705c0-4.19,2.18-6.37,6.52-6.37A6.3,6.3,0,0,1,624.11,705Z"/>
            <path style={cls3} className="cls-3" d="M631.87,764.41V705a6.3,6.3,0,0,1,6.37-6.37c4,0,6.21,2,6.36,5.9a28.7,28.7,0,0,1,17.39-5.9,30.18,30.18,0,0,1,30.27,30.12v35.71a6.44,6.44,0,0,1-12.88,0V728.7a17.39,17.39,0,0,0-34.78,0v35.71a6.21,6.21,0,0,1-6.36,6.37A6.3,6.3,0,0,1,631.87,764.41Z"/>
            <path style={cls3} className="cls-3" d="M697.85,740.66v-12a30.19,30.19,0,0,1,30.28-30.12c6,0,11.8,2.18,17.23,6.06V669.4c0-4.2,2.17-6.37,6.52-6.37,4.19,0,6.37,2.17,6.37,6.37v71.26a30.2,30.2,0,0,1-60.4,0Zm12.89,0a17.31,17.31,0,1,0,34.62,0v-12a17.31,17.31,0,0,0-34.62,0Z"/>
            <path style={cls3} className="cls-3" d="M816.15,714.73l.16-.16c-2.95,3.73-6.83,3.26-9.32,1.25a16.62,16.62,0,0,0-11-4A17.3,17.3,0,0,0,778.74,729v35.4a6.21,6.21,0,0,1-6.37,6.37c-4.34,0-6.52-2.18-6.52-6.37V705.26c0-4.19,2.18-6.37,6.52-6.37a6.38,6.38,0,0,1,6.37,5.44,30,30,0,0,1,36.48,1.55A6.83,6.83,0,0,1,816.15,714.73Z"/>
            <path style={cls3} className="cls-3" d="M825,752.46a33.13,33.13,0,0,1-2.17-11.8v-12a29.69,29.69,0,0,1,18.47-27.63h-.15a27.69,27.69,0,0,1,11.8-2.49,30,30,0,0,1,27.63,18.48,25.62,25.62,0,0,1,2.48,11.64,6.86,6.86,0,0,1-1.86,4.66,7.21,7.21,0,0,1-4.5,1.86h-41v5.44c0,7.29,4.19,13,10.56,16A15.6,15.6,0,0,0,853,758a17.5,17.5,0,0,0,12.26-5.27,18.62,18.62,0,0,0,3.73-5.44c1.24-2.48,1.86-4,6-4,3.57,0,6.37,1.86,6.37,6.05a4.82,4.82,0,0,1-.62,2.33,31.56,31.56,0,0,1-6.52,10.4,29.52,29.52,0,0,1-21.27,8.7A30.64,30.64,0,0,1,825,752.46Zm12.58-31.21-.62,1.24h32c-3-6.67-9-11-16-11C846.27,711.47,840.68,715.2,837.58,721.25Z"/>
            <path style={cls3} className="cls-3" d="M888.19,740.66v-12a30.18,30.18,0,0,1,30.27-30.12c6.06,0,11.8,2.18,17.23,6.06V669.4c0-4.2,2.18-6.37,6.52-6.37,4.19,0,6.37,2.17,6.37,6.37v71.26a30.2,30.2,0,0,1-60.39,0Zm12.88,0a17.31,17.31,0,1,0,34.62,0v-12a17.31,17.31,0,0,0-34.62,0Z"/>
        </svg>
    )
}

const HuLogo1: React.FC<Props> = (props: Props) => {
    const style1: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    const style2: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    const style3: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    return (
        <svg
            width={props.width ? props.width : "100px"}
            height={props.height ? props.height : "100px"}
            viewBox="0 0 133.80357 133.80357">
            <g
               transform="translate(-38.098215,-81.598216)">
              <path
                 style={style1}
                 d="M 169.25595,148.5 A 64.255951,64.255951 0 0 1 105,212.75595 64.255951,64.255951 0 0 1 40.74405,148.5 64.255951,64.255951 0 0 1 105,84.244051 64.255951,64.255951 0 0 1 169.25595,148.5 Z">                   
              </path>
              <path
                 style={style2}
                 d="m 157.16072,163.61905 a 40.82143,40.82143 0 0 1 -40.82143,40.82143 40.82143,40.82143 0 0 1 -40.821432,-40.82143 40.82143,40.82143 0 0 1 40.821432,-40.82143 40.82143,40.82143 0 0 1 40.82143,40.82143 z" />
              <path
                 style={style3}
                 d="M 133.72619,154.54762 A 25.702381,25.702381 0 0 1 108.0238,180.25 25.702381,25.702381 0 0 1 82.321426,154.54762 25.702381,25.702381 0 0 1 108.0238,128.84524 a 25.702381,25.702381 0 0 1 25.70239,25.70238 z">
              </path>
            </g>
        </svg>
    )
}

const HuLogoSpinner: React.FC<Props> = (props: Props) => {
    const style1: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    const style2: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    const style3: React.CSSProperties = {
        fill:'none',
        stroke: `${props.color ? props.color : '#333'}`,
        strokeWidth:5.29167,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:4,
        strokeDasharray:'none'
    }

    return (
        <svg
            width={props.width ? props.width : "100px"}
            height={props.height ? props.height : "100px"}
            viewBox="0 0 150 150" style={props.style}>
            <g
               transform="translate(-38.098215,-81.598216)">
              <path
                 style={style1}
                 d="M 169.25595,148.5 A 64.255951,64.255951 0 0 1 105,212.75595 64.255951,64.255951 0 0 1 40.74405,148.5 64.255951,64.255951 0 0 1 105,84.244051 64.255951,64.255951 0 0 1 169.25595,148.5 Z">
                <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1.5s" 
                        from="360 105 150"
                        to="0 105 150" 
                        additive="sum"
                        repeatCount="indefinite" />                    
              </path>
              <path
                 style={style2}
                 d="m 157.16072,163.61905 a 40.82143,40.82143 0 0 1 -40.82143,40.82143 40.82143,40.82143 0 0 1 -40.821432,-40.82143 40.82143,40.82143 0 0 1 40.821432,-40.82143 40.82143,40.82143 0 0 1 40.82143,40.82143 z" >
                     <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1.5s" 
                        from="360 105 150"
                        to="0 105 150" 
                        additive="sum"
                        repeatCount="indefinite" />
              </path>
              <path
                 style={style3}
                 d="M 133.72619,154.54762 A 25.702381,25.702381 0 0 1 108.0238,180.25 25.702381,25.702381 0 0 1 82.321426,154.54762 25.702381,25.702381 0 0 1 108.0238,128.84524 a 25.702381,25.702381 0 0 1 25.70239,25.70238 z">
                     <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1.5s" 
                        from="360 105 150"
                        to="0 105 150" 
                        additive="sum"
                        repeatCount="indefinite" />
              </path>
            </g>
        </svg>
    )
}

const HuArrow: React.FC<Props> = (props: Props) => {
    const style: React.CSSProperties = {
        fill: props.color ? props.color : "#000000",
        stroke: props.color ? props.color : "#000000",
        strokeWidth:0.264584,
        strokeLinecap:"round",
        strokeLinejoin:"round",
        strokeMiterlimit:4,
        strokeDasharray:"none"
    }

    return(
         <svg className={props.className}  width={props.width ? props.width : "50"} height={props.height ? props.height : "50"} viewBox="0 0 13.229166 13.229167">
            <path style={style} d="M 6.6145829,2.3129704 13.183342,0.09378244 6.6145836,13.229876 0.09307221,0.09378184 Z" />
        </svg>
    )

}

const Spinner: React.FC<Props> = (props: Props) => {
    const style = {
        width: props.size ? props.size : "50px",
        height: props.size ? props.size : "50px"
    }
    return(
        <svg style={style} className="spinner" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none"></circle>
        </svg>
    )
}

export {HuLogo, HuLogo1, HuLogoSpinner, HuArrow, Spinner}