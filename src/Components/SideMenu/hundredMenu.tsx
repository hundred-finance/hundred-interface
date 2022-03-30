import React, { useEffect, useRef, useState} from "react"
import "./hundredMenu.css"
import { Spinner } from "../../assets/huIcons/huIcons"
import { Network } from "../../networks"
import { BigNumber } from "../../bigNumber"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"

interface Props{
    hndPrice: number,
    hndBalance: BigNumber | null,
    hndEarned: BigNumber | null,
    hndRewards: BigNumber | null,
    address: string,
    handleCollect: () => Promise<void>,
    handleClaimHnd: () => Promise<void>, 
    handleClaimLockHnd: () => Promise<void>, 
    hundredBalance: BigNumber | null,
    vehndBalance: BigNumber | null,

}


const HundredMenu: React.FC<Props> = (props: Props) => {
    const {hndSpinner} = useUiContext()
    const {network} = useGlobalContext()

    const networkRef = useRef<Network | null>(null)
    networkRef.current = network
    useEffect(() => {
        networkRef.current = {...network} as any
    }, [network])

    const [tvl, setTvl] = useState<BigNumber | null>(null)

    useEffect(() => {
        if(networkRef.current  && networkRef.current.hundredLiquidityPoolAddress && props.hundredBalance){
            if(networkRef.current.liquidity){
                const temp = +props.hundredBalance.toString() / (networkRef.current.hndPoolPercent ? networkRef.current.hndPoolPercent : 1) * props.hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
            else{
                const temp = +props.hundredBalance.toString() * 2 * props.hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
        }
        else setTvl(null)
    }, [props.hndPrice, props.hundredBalance])

    return (
        <div className="hundred-menu">
            <hr/>
            <div className="hundred-menu-item">
                <div className="hundred-menu-item-label"><label>HND Price </label><span>${BigNumber.parseValue(props.hndPrice.toString()).toRound(2, true, true)}</span></div>
                {tvl ? <div className="hundred-menu-item-label"><label>{networkRef.current?.liquidity ? "Liquidity" : "TVL"}</label><span>${tvl.toRound(2, true, true)}</span></div> : null}
                {networkRef.current  && networkRef.current.trade ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.trade} target="_blank" rel="noreferrer">Trade</a></div> : null}
                {networkRef.current  && networkRef.current.addLiquidity ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.addLiquidity} target="_blank" rel="noreferrer">Add Liquidity</a></div> : null}
                {networkRef.current  && networkRef.current.stakeLp ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.stakeLp} target="_blank" rel="noreferrer">Stake LP</a></div> : null}
            </div>
            <div className="hundred-menu-item">
                <hr/>
                <div className="hundred-menu-item-label"><label>HND Balance </label><span>{props.hndBalance ? (props.hndBalance.gt(BigNumber.from(0)) ? props.hndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>veHND Balance </label><span>{props.vehndBalance ? (props.vehndBalance.gt(BigNumber.from(0)) ? props.vehndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>HND Earned </label><span>{props.hndRewards ? (props.hndRewards.gt(BigNumber.from(0)) ? props.hndRewards.toRound(2, true, true) : "0.00") : "--"}</span></div>
               
                <div className= {`${props.hndRewards ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => props.handleClaimHnd()}>Claim HND</div>
                <div className= {`${props.vehndBalance ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => props.handleClaimLockHnd()}>Claim and Lock HND</div>

                {props.hndEarned && +props.hndEarned.toString() > 0 ? 
                    <><div className="hundred-menu-item-label"><label>HND Earned (Legacy)</label><span>{props.hndEarned ? props.hndEarned?.gt(BigNumber.from(0)) ? props.hndEarned?.toRound(2, true, true) : "0.00" : "--"}</span></div>
                    <div className={`${hndSpinner ? "hundred-menu-item-button-disabled" : "hundred-menu-item-button"}`} onClick={() => !hndSpinner ? props.handleCollect() : null}>
                        {hndSpinner ? (<Spinner size={"25px"}/>) : "Claim Legacy HND"}</div></> : null
                }
            </div>
        </div>
    )
}

export default HundredMenu