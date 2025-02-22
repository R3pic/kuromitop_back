export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
};

export type SpotifySearchResponse = {
  tracks: {
    items: SpotifyTrackObject[];
  };
};

type SpotifyTrackObject = {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
};

type SpotifyArtist = {
  name: string;
};

type SpotifyAlbum = {
  images: SpotifyAlbumImage[];
};

type SpotifyAlbumImage = {
  url: string;
  width: number;
  height: number;
};