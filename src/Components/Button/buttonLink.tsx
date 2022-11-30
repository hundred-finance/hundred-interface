import React from "react";
import "./button.css"

interface Props{
    url: string,
    label: string
}
const ButtonLink: React.FC<Props> = ({url, label} : Props) => {
    return(
        <a className="button button-link" href={url} target="_blank" rel="noreferrer">{label}</a>
    )
}

export default ButtonLink