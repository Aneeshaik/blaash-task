import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Videos from "./Videos";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Playlists = ({ playlists, error, email }) => {
  const [videos, setVideos] = useState([]);
  const [newPlaylists, setNewPlayLists] = useState(playlists);
  const [userLayout, setUserLayout] = useState([]);

  useEffect(() => {
    if (playlists) {
      setNewPlayLists(playlists);
    }
  }, [playlists]);

  const fetchUserLayout = async () => {
    if (email) {
      try {
        const response = await fetch(
          `https://blaash-task-api.onrender.com/user/layout?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserLayout(data.layout);
          reorderPlaylists(data.layout);
        } else {
          console.error("Error fetching user layout:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user layout:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserLayout();
  }, [email, playlists]);

  const reorderPlaylists = (layout) => {
    if (playlists && layout.length > 0) {
      const orderedPlaylists = layout
        .map((id) => playlists.find((playlist) => playlist.id === id))
        .filter(Boolean);
      setNewPlayLists(orderedPlaylists);
    }
  };

  const handlePlaylistClick = async (playlist) => {
    try {
      const response = await fetch(
        `https://blaash-task-api.onrender.com/playlists/videos/${playlist.id}`
      );
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedPlaylists = Array.from(newPlaylists);
    const [removed] = reorderedPlaylists.splice(result.source.index, 1);
    reorderedPlaylists.splice(result.destination.index, 0, removed);
    setNewPlayLists(reorderedPlaylists);
  };

  const saveLayout = async () => {
    const updatedLayout = newPlaylists.map((playlist) => playlist.id);

    try {
      const response = await fetch(`https://blaash-task-api.onrender.com/user/layout/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          layout: updatedLayout,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save layout");
      }
      console.log("Layout saved successfully");
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const loadLayout = async () => {
    await fetchUserLayout();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        justifyContent: "space-between",
        flex: 1,
        margin: "10px",
      }}
    >
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3
            style={{
                margin: "0px",
                color: "#fff",
                padding: "10px 0",
                textAlign: "left",
            }}
            >
            Product Playlists
            </h3>
            <div style={{ display: "flex", gap: "10px", marginRight: '10px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={saveLayout}
                style={{ backgroundColor: "#0d6efd", textTransform: 'none' }}
            >
                Save Layout
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={loadLayout}
                style={{ backgroundColor: "#6c757d", textTransform: 'none' }}
            >
                Load Layout
            </Button>
            </div>
        </div>
        <div
          style={{
            backgroundColor: "#27272f",
            marginRight: "10px",
            borderRadius: "15px",
            height: "100%",
            padding: "20px",
            overflowY: "auto",
            color: "#fff",
          }}
        >
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlists" direction="horizontal">
              {(provided) => (
                <div
                  className="playlists"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    width: "100%",
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {newPlaylists.map((playlist, index) => {
                    return (
                      <Draggable
                        key={String(playlist.id)}
                        draggableId={String(playlist.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            onClick={() => handlePlaylistClick(playlist)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              position: "relative",
                              width: "32%",
                              borderRadius: "15px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "15px",
                              }}
                              src={playlist.snippet.thumbnails.medium.url}
                              alt="thumbnail"
                            />
                            <div
                              style={{
                                position: "absolute",
                                cursor: "pointer",
                                bottom: "0px",
                                width: "100%",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  margin: "0 0 10px",
                                  color: "#fff",
                                  marginLeft: "10px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textAlign: "left",
                                }}
                              >
                                {playlist.snippet.title}
                              </p>
                              <div
                                style={{
                                  backgroundColor: "#000",
                                  opacity: "0.8",
                                  padding: "10px 0",
                                  borderRadius: '0px 0px 15px 15px',
                                  textAlign: "center",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "14px",
                                    margin: "0",
                                    fontWeight: "bold",
                                    color: "#aaa",
                                  }}
                                >
                                  {playlist.contentDetails.itemCount || 0}{" "}
                                  {playlist.contentDetails.itemCount === 1
                                    ? "Video"
                                    : "Videos"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Box>
      <Videos videos={videos} />
    </div>
  );
};

export default Playlists;
