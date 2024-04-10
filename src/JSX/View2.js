import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const View2 = () => {
    const [savedMarkers, setSavedMarkers] = useState([]);
    const [clickedMarker, setClickedMarker] = useState(null);
    const [closestMarker, setClosestMarker] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        setSavedMarkers(storedMarkers);
        console.log(storedMarkers);
    }, []);

    useEffect(() => {
        const addMarker = (clickedPosition) => {
            if (map) {
                // Usuń poprzedni kliknięty marker, jeśli istnieje
                if (clickedMarker) {
                    clickedMarker.setMap(null);
                }

                // Dodaj nowy kliknięty marker
                const newClickedMarker = new window.google.maps.Marker({
                    position: clickedPosition,
                    map: map,
                });
                setClickedMarker(newClickedMarker);
                setClosestMarker(clickedPosition);


                // Zapisz aktualną pozycję klikniętego markera w local storage
                localStorage.setItem('clickedMarker', JSON.stringify(clickedPosition));
                console.log(clickedPosition.lat(), clickedPosition.lng());

                // Zapisz szerokość geograficzną klikniętego markera
                localStorage.setItem('clickedMarkerLatitude', clickedPosition.lat());

                // Zaktualizuj mapę
                initMap();
            }
        };

        const initMap = async () => {
            const mapInstance = new window.google.maps.Map(document.getElementById('gmp-map'), {
                zoom: 11,
            });
            setMap(mapInstance);

            const bounds = new window.google.maps.LatLngBounds();
            savedMarkers.forEach(markerPosition => {
                const marker = new window.google.maps.Marker({
                    position: markerPosition,
                    map: mapInstance,
                });
                bounds.extend(marker.getPosition());
            });

            mapInstance.fitBounds(bounds);

            mapInstance.addListener('click', (event) => {
                addMarker(event.latLng);
            });
        };

        initMap();
    }, [savedMarkers]);

    useEffect(() => {
        if (map) {
            // Usuń poprzedni kliknięty marker, jeśli istnieje
            if (clickedMarker) {
                clickedMarker.setMap(map);
            }

            const bounds = new window.google.maps.LatLngBounds();
            savedMarkers.forEach(markerPosition => {
                bounds.extend(markerPosition);
            });
            if (clickedMarker) {
                bounds.extend(clickedMarker.getPosition());
            }
            map.fitBounds(bounds);
        }
    }, [clickedMarker, map, savedMarkers]);

    return (
        <div>
            <div id="gmp-map" style={{ width: '50%', height: '400px' }}></div>
            {closestMarker && (
                <p>Najbliższy znacznik: {JSON.stringify(closestMarker)}</p>
            )}
            <Link to="/">View1</Link>
        </div>
    );
};

export default View2;
