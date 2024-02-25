import { useRef, useState, useEffect, useCallback } from "react";
import { Button, Box } from "@mui/material";

import axios from "axios";
import "./App.css";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGES = 20;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMessage("");
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}$page=${page}&per_page=${IMAGES}&client_id=${API_KEY}`
        );
        setImages(data.results);
        setTotalPage(data.total_pages);
      }
    } catch (e) {
      setErrorMessage("Error fetching images. Try again later!");
    }
  }, [page]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  const box = {
    marginTop: "2px",
    marginBottom: "15px",
  };

  const resetSearch = () => {
    setPage(1);
    getImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="App">
      <div className="App-header">
        <div>
          <h1>Image Search</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="text">
          <form onSubmit={handleSearch}>
            <input
              ref={searchInput}
              type="text"
              placeholder="Type something to search..."
            />
          </form>
        </div>
        <div className="search">
          <Button
            variant="contained"
            onClick={() => handleSelection("nature")}
            sx={{ marginRight: "5px" }}
          >
            Nature
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelection("dog")}
            sx={{ marginRight: "5px" }}
          >
            Dogs
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelection("cat")}
            sx={{ marginRight: "5px" }}
          >
            Cats
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelection("shoes")}
            sx={{ marginRight: "5px" }}
          >
            Shoes
          </Button>
        </div>
        <div className="images">
          {images.map((image) => (
            <img
              key={image?.id}
              src={image?.urls?.small}
              alt={image?.alt_description}
              className="image"
            />
          ))}
        </div>
        <Box sx={box}>
          {page > 1 && (
            <Button
              sx={{ marginRight: "5px" }}
              variant="contained"
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
          )}
          {page < totalPage && (
            <Button variant="contained" onClick={() => setPage(page + 1)}>
              Next
            </Button>
          )}
        </Box>
      </div>
    </div>
  );
};

export default App;
