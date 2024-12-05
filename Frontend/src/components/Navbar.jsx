import { Button } from "@mui/material"
import { useState, useEffect } from "react";
import Playlists from "./Playlists";

const Navbar = () => {
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const email = localStorage.getItem('email');

    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`http://localhost:3000/playlists?email=${encodeURIComponent(email)}`); // Backend endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }
            console.log(response);
            
            const data = await response.json();
            setPlaylists(data);
            localStorage.setItem('playlists', JSON.stringify(data));
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const storedPlaylists = localStorage.getItem('playlists');
        if (storedPlaylists) {
            setPlaylists(JSON.parse(storedPlaylists));
        }
    }, []);

    return (
        <>
            <div style={{backgroundColor: '#27272f', padding: '0px 10px', margin: '10px', display: 'flex', borderRadius: '15px', alignItems: 'center', justifyContent: 'space-between',}}> 
                <h3 style={{color: '#fff'}}>Design Studio</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Button style={{textTransform: 'none', color: '#fff', backgroundColor: '#006BCE'}} onClick={fetchPlaylists}>Import Data from Youtube</Button>
                    <p style={{color: '#fff', fontSize: '16px', border: '1px solid #006BCE', borderRadius: '10px', padding: '8px'}}>Support Request</p>
                    <p style={{color: '#fff', fontSize: '16px', border: '1px solid #006BCE', borderRadius: '10px', padding: '8px'}}>Product Tour</p>
                    <input placeholder="Search Project..." style={{padding: '8px', borderRadius: '10px'}} />
                </div>
            </div>
            <Playlists playlists={playlists} email={email} error={error} />
        </>
    )
}

export default Navbar