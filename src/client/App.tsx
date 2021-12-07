import * as React from 'react';
import { useState, useEffect } from 'react';

interface ISong {
	id: string;
	title: string;
	artist: string;
}

interface IAnnotation {
	fragment: string;
	annotation: string;
	votesTotal: number;
}

interface ISongResultsProps {
	songs: ISong[];
	onSongClick: (songId: string, title: string, artist: string) => void;
}

interface IAnnotationResultsProps {
	annotations: IAnnotation[];
}

const App = () => {
	const [songQuery, setSongQuery] = useState<string>('');
	const [songResults, setSongResults] = useState<ISong[]>([]);
	const [annotationResults, setAnnotationResults] = useState<IAnnotation[]>([]);
	const [selectedSong, setSelectedSong] = useState<ISong>(null);

	const getSongs = async () => {
		if (!songQuery) return;
		const response = await fetch(`/api/search?q=${songQuery}`);
    const data = await response.json();
    setSongResults(data.songs);
		setAnnotationResults([]);
	}

	const getAnnotations = async (songId: string) => {
		if (!songId) return;
		const response = await fetch(`/api/annotations/${songId}`);
    const data = await response.json();
		setSongResults([]);
		setAnnotationResults(data.annotations);
	}
	
	const handleSongQueryChange = (e: any) => {
		setSongQuery(e.target.value);
	}

	const handleSongClick = (songId: string, title: string, artist: string) => {
		setSelectedSong({
			id: songId, title, artist
		});
		getAnnotations(songId);
	}

	return (
		<main className="container my-5">
			<h1>What is your favorite artist saying?</h1>
			<input autoFocus autoComplete='off' placeholder='Search for a song' type='text' onChange={handleSongQueryChange}></input>
			<button onClick={getSongs}>Search</button>
			<div className='song-results-conatiner'>
				{ songResults.length > 0 ? <SongResults songs={songResults} onSongClick={handleSongClick}/> : null}
			</div>

			{ annotationResults.length > 0 ? 
				(<div className='annotation-results-conatiner'>
					<p>Artist: { selectedSong.artist}</p>
					<p>Song: { selectedSong.title}</p>
					<AnnotationResults annotations={annotationResults}/>
				</div>) : null
			}
			
		</main>
	);
};

const SongResults = ({songs, onSongClick}: ISongResultsProps) => {
	const songResults = songs.map((song, i) => {
		return (
			<li onClick={() => onSongClick(song.id, song.title, song.artist)} key={i} className='song-result' >
				<p>Song: {song.title}</p>
				<p>Artist: {song.artist}</p>
			</li>
		);
	});

	return (
		<div>
			<h3>Songs found:</h3>
			<ul>
				{songResults}
			</ul>
		</div>
	)
}

const AnnotationResults = ({annotations}: IAnnotationResultsProps) => {
	const annotationResults = annotations.map((annotation, i) => {
		return (
			<li key={i} className='annotation-result' >
				<p>Lyrics: {annotation.fragment}</p>
				<p>Explanation: {annotation.annotation}</p>
			</li>
		);
	});

	return (
		<div>
			<h3>Annotations:</h3>
			<ul>
				{annotationResults}
			</ul>
		</div>
	)
}

const NoSongResults = () => {
	return (
		<div>Sorry, no songs were found matching the search</div>
	)
}

/* CLASS REACT EXAMPLE */
// class App extends React.Component<IAppProps, IAppState> {
// 	constructor(props: IAppProps) {
// 		super(props);
// 		this.state = {
// 			name: null
// 		};
// 	}

// 	async componentDidMount() {
// 		try {
// 			let r = await fetch('/api/hello');
// 			let name = await r.json();
// 			this.setState({ name });
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	render() {
// 		return (
// 			<main className="container my-5">
// 				<h1 className="text-primary text-center">Hello {this.state.name}!</h1>
// 			</main>
// 		);
// 	}
// }

// export interface IAppProps {}

// export interface IAppState {
// 	name: string;
// }

export default App;
