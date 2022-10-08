let accessToken;
const clientID = ''; //spotify api key goes here
const redirectURI = 'https://jammmingvic.surge.sh/'
const url = 'https://api.spotify.com/v1/';


const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //clears parameters and grab new token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }
    },
    searchSpotify(term) {
        return fetch(`${url}search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${Spotify.getAccessToken()}`}
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            if(!jsonResponse.tracks) {
                return [];
            }
             return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                active: false //removes song from search results if true
             }))   
            }) 
    },
    savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userId;

        return fetch(`${url}me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`${url}users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`${url}users/${userId}/playlists/${playlistId}/tracks`,{ 
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({
                        uris: trackUris 
                    })
                })
            })
        })
    }
}

export default Spotify;