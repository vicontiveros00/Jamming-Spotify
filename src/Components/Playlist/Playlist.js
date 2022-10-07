import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList'

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e) {
        console.log(e.target.value ? e.target.value : 'null'); //for debugging purposes
        this.props.onNameChange(e.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input placeholder="New Playlist" onChange={this.handleNameChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        this.props.onSave();
                    }
                }}/>
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save" onClick={this.props.onSave} >SAVE TO SPOTIFY</button>
            </div>
        );
    }
}

export default Playlist;