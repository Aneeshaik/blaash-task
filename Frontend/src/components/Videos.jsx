import VideoList from "./VideoList"

const Videos = ({videos}) => {
    return (
        <div 
            style={{ 
                width: '400px',
                height: '100%',  
                borderRadius: '15px', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '3px 0px'}}>
                <VideoList />
            </div>
            <div style={{backgroundColor: '#27272f', padding: '5px 10px', borderRadius: '15px', height: '100%', width: '100%'}}>
                <h3 style={{textAlign: 'left', color: '#fff'}}>Thumbnail Title</h3>
                {videos && videos.map((video) => (
                    <div style={{display: 'flex', gap: '10px', marginBottom: '5px'}}>
                        <img style={{width: '160px', height: '100%', borderRadius: '10px'}} src={video.snippet.thumbnails.medium.url} alt='thumbnail' />
                        <p style={{color: '#fff', textAlign: 'left', margin: '0px'}}>{video.snippet.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Videos