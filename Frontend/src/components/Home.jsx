import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { useEffect } from "react"

const Home = () => {

    useEffect(() => {
        const hasReloaded = sessionStorage.getItem("hasReloaded");
    
        if (!hasReloaded) {
          sessionStorage.setItem("hasReloaded", "true");
          window.location.reload();
        }
      }, []);

    return (
            <div className="App" style={{ display: 'flex', height: '100vh' }}>
                {/* Your Home Layout */}
                <Sidebar />
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Navbar />
                  {/* Add content here */}
                </div>
              </div>
    )
}

export default Home