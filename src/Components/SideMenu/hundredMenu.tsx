import React, { useEffect, useState} from "react"
import "./hundredMenu.css"
import {ethers} from "ethers"
import { Spinner } from "../../assets/huIcons/huIcons"
import { Network } from "../../networks"
import { BigNumber } from "../../bigNumber"

interface Props{
    hndPrice: number,
    hndBalance: BigNumber | null,
    hndEarned: BigNumber | null,
    hndSpinner: boolean,
    address: string,
    provider: ethers.providers.Web3Provider | null,
    network: Network | null,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenHundred: React.Dispatch<React.SetStateAction<boolean>>,
    handleCollect: () => Promise<void>,
    hundredBalance: BigNumber | null,
}


const HundredMenu: React.FC<Props> = (props: Props) => {
    const [tvl, setTvl] = useState<BigNumber | null>(null)

    useEffect(() => {
        if(props.network  && props.network.HUNDRED_CONTRACT_ADDRESS && props.hundredBalance){
            const temp = +props.hundredBalance.toString() * 2 * props.hndPrice
            setTvl(BigNumber.parseValue(temp.noExponents()))
        }
        else setTvl(null)
    }, [props.hndPrice, props.hundredBalance])

    return (
        <div className="hundred-menu">
            <hr/>
            <div className="hundred-menu-item">
                <div className="hundred-menu-item-label"><label>HND Price </label><span>${BigNumber.parseValue(props.hndPrice.toString()).toRound(2, true)}</span></div>
                {tvl ? <div className="hundred-menu-item-label"><label>TVL</label><span>${tvl.toRound(2, true)}</span></div> : null}
                {props.network  && props.network.trade ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={props.network.trade} target="_blank" rel="noreferrer">Trade</a></div> : null}
                {props.network  && props.network.addLiquidity ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={props.network.addLiquidity} target="_blank" rel="noreferrer">Add Liquidity</a></div> : null}
                {props.network  && props.network.stakeLp ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={props.network.stakeLp} target="_blank" rel="noreferrer">Stake LP</a></div> : null}
            </div>
            <div className="hundred-menu-item">
                <hr/>
                <div className="hundred-menu-item-label"><label>HND Balance </label><span>{props.hndBalance ? (props.hndBalance.gt(BigNumber.from(0)) ? props.hndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>HND Earned </label><span>{props.hndEarned ? props.hndEarned?.gt(BigNumber.from(0)) ? props.hndEarned?.toRound(2, true, true) : "0.00" : "--"}</span></div>
                <div className={`${props.hndSpinner ? "hundred-menu-item-button-disabled" : "hundred-menu-item-button"}`} onClick={() => !props.hndSpinner ? props.handleCollect() : null}>
                    {props.hndSpinner ? (<Spinner size={"25px"}/>) : "Collect"}</div>
            </div>
        </div>
    )
}

export default HundredMenu