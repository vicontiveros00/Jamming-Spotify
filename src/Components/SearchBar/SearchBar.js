import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term: ''
        }
        
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        console.log(e.target.value);
        this.setState({
            term: e.target.value
        })
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        this.search();
                    }
                }}/>
                <button onClick={this.search} className="SearchButton">SEARCH SPOTIFY</button>
            </div>
        )
    }
}

export default SearchBar;