import BigNumber from "bignumber.js";
import React, { useEffect, useRef, useState } from "react"
import { HuLogo, HuArrow } from "../../../assets/huIcons/huIcons"
import { zeroStringIfNullish } from "../../../helpers";
import Button from "../../Button/Button";
import "./PctButton.css"


  const PctButton = (props)  => {

    const [active, setActive] = useState(false)

    const ref = useRef(null);
   
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setActive(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    const claimPct = () => {
        props.claimPct(props.account)
    }

    return (
        <div ref={ref} className="pct-button" >
            <div className="pct-button-header" onClick={() => setActive(!active)}>
                <HuLogo className="pct-button-logo" size="30"/>
                <div className="pctBalance">
                    {`${new BigNumber(zeroStringIfNullish(props.pctBalance))
                    .decimalPlaces(4)
                    .toString()}`} 
                </div>
                <HuArrow className="pct-button-arrow" color="#646464" width="10" height="10"/>
            </div>
            
            <ul className={active ? "active" : ""}>
                <li>
                    <span>PCT Balance</span>
                    <span>{`${new BigNumber(zeroStringIfNullish(props.pctBalance))
                        .decimalPlaces(4)
                        .toString()}`}
                    </span>
                </li>
                <li>
                <span>
                    PCT Earned
                </span>
                <span>
                    {`${new BigNumber(zeroStringIfNullish(props.pctEarned))
                    .decimalPlaces(4)
                    .toString()}`}
                </span>
                </li>
                <li>
                <Button onClick={claimPct}> Collect</Button>
                </li>
            </ul>
        </div>
    )
  }

export default PctButton