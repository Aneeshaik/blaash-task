import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from 'react';

const VideoList = () => {
    const [videoList, setVideoList] = useState(false)
    const [popularVideos, setPopularVideos] = useState([])

    const fetchVideoList = async () => {
        try {
            const response = await fetch('https://blaash-task-api.onrender.com/most-popular');
            const data = await response.json();
            if (Array.isArray(data)) {
                setPopularVideos(data);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching video list:', error);
        }
        console.log(popularVideos);
    }
    useEffect(() => {
        fetchVideoList()
    },[])

    return (
        <div>
            <Tooltip title="Popular videos" arrow>
                <ViewListIcon style={{color: '#fff', fontSize: '35px', cursor: 'pointer'}} onClick={() => {fetchVideoList(); setVideoList(true)}}/>
            </Tooltip>
            <Modal
            open={videoList}
            onClose={() => setVideoList(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            >
                <div style={{position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 60,
                    width: '500px',
                    minHeight: '100vh',
                    height: '100%',
                    border: '0px',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    backgroundColor: '#27272f',
                    boxShadow: 24,
                    padding: '5px 10px',
                    paddingBottom: '10px',
                    borderRadius: 1,
                }}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3 style={{color: '#fff'}}>Popuplar Videos</h3>
                            <CloseIcon style={{color: '#fff', cursor: 'pointer'}} onClick={() => setVideoList(false)}/>
                        </div>
                        
                        {popularVideos.length > 0 ? (
                        popularVideos.map((video, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                <img style={{ width: '160px', height: '100%', borderRadius: '10px' }} src={video.snippet.thumbnails.medium.url} alt='thumbnail' />
                                <p style={{ color: '#fff', textAlign: 'left', margin: '0px' }}>{video.snippet.title}</p>
                            </div>
                        ))
                        ) : (<>
                            {console.log("no popular videos")}
                            <p style={{ color: '#fff' }}>No popular videos available.</p>
                            </>
                        )}
                    </div>
            </Modal>
        </div>
    )
}

export default VideoList