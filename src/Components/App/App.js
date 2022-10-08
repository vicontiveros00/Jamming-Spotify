import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let trackList = this.state.playlistTracks;
      track.active = true;
      trackList.push(track);
      this.setState({
        playlistTracks: trackList,
      })
      this.updateSearchResults();
    }
  }

  updateSearchResults() {
    let notActiveSongs = this.state.searchResults;
    let activeSongs = notActiveSongs.filter(track => !track.active);

    this.setState({
      searchResults: activeSongs
    })
  }

  removeTrack(track) {
    track.active = false;
    let activeSong = track;
    let notActiveSongs = this.state.searchResults;
    notActiveSongs.unshift(activeSong);
    this.setState({
      searchResults: notActiveSongs
    });
    
    let removeSong = this.state.playlistTracks;
    removeSong = removeSong.filter(song => song.id !== track.id);

    this.setState({
      playlistTracks: removeSong
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(searchTerm) {
    Spotify.searchSpotify(searchTerm).then(searchResults => {
      this.setState({
        searchResults: searchResults
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <div className="intro">
          <p>Hi, so this app doesn't work unless I add you as an authorized users as per the rules of using the Spotify API. Contact me if you wanna test this out.</p>
        </div>
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
        <p className="watermark">github.com/vicontiveros00/</p>
      </div>
    )
  }
}

export default App;
