import React from "react"
import Button from "../Button/button"
import "./searchTextBox.css"

interface Props{
    searchText: string,
    setSearchText: React.Dispatch<React.SetStateAction<string>>
}
const SearchTextBox: React.FC<Props> = ({searchText, setSearchText} : Props) => {

    return <div className="search-textbox">
        <div className="search-textbox-button">
            <Button onClick={() => setSearchText("")} rectangle={true} arrow={true} searchText={true} large={true}>
                All
            </Button>
        </div>
        <div className="search-text">
            <div className="search-text-icon"/>
            <input type={"search"} value={searchText} onInput={(e: any) => setSearchText(e.target.value)} placeholder={"SEARCH HERE"}/>
        </div>
    </div>

}

export default SearchTextBox