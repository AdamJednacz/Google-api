import React, {  useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Api from './JSX/Api';
import View2 from './JSX/View2';

import './App.css';
const App = () => {

    const [google, setGoogle] = useState(null);

    const CONFIGURATION = {
        "mapsApiKey": "AIzaSyBJXRZnDd7FZD9riqF6MvkCw5lt3GIP6rM",
        // Pozostała konfiguracja mapy
    };

    const loader = new Loader({
        apiKey: CONFIGURATION.mapsApiKey,
        version: "weekly",
    });

    loader.load().then((googleInstance) => {
        setGoogle(googleInstance);
    });
    return (
        <BrowserRouter>

                <Routes>
                    <Route path="/" element={<Api />} />
                    <Route path="/view2" element={<View2 />} />
                </Routes>

        </BrowserRouter>
    );
};

export default App;
