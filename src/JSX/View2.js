import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const View2 = () => {
    const [savedMarkers, setSavedMarkers] = useState([]);
    const [clickedMarkers, setClickedMarkers] = useState([]);
    const [closestMarker, setClosestMarker] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        setSavedMarkers(storedMarkers);
    }, []);

    useEffect(() => {
        // Funkcja dodająca nowy znacznik w miejscu kliknięcia
        const addMarker = (clickedPosition) => {
            if (map) {
                // Usuń wszystkie istniejące znaczniki z mapy
                clickedMarkers.forEach(marker => {
                    marker.remove();
                });

                // Dodaj nowy znacznik
                const newClickedMarker = new window.google.maps.Marker({
                    position: clickedPosition,
                    map: map,
                });
                console.log("Lista obiektów przed usunięciem:", clickedMarkers);
                setClickedMarkers([newClickedMarker]);
                setClosestMarker(clickedPosition);
            }
        };


        const initMap = async () => {
            // Inicjalizacja mapy
            const mapInstance = new window.google.maps.Map(document.getElementById('gmp-map'), {
                zoom: 11,
            });
            setMap(mapInstance);

            // Tworzenie obiektu LatLngBounds do określenia granic obszaru zawierającego wszystkie znaczniki
            const bounds = new window.google.maps.LatLngBounds();

            // Dodanie wcześniej zapisanych znaczników na mapie i aktualizacja granic
            savedMarkers.forEach(markerPosition => {
                const marker = new window.google.maps.Marker({
                    position: markerPosition,
                    map: mapInstance,
                });
                bounds.extend(marker.getPosition());
            });

            // Ustawienie granic mapy
            mapInstance.fitBounds(bounds);

            // Nasłuchiwanie kliknięć na mapie
            mapInstance.addListener('click', (event) => {
                addMarker(event.latLng);
            });
        };

        // Wywołanie funkcji inicjalizującej mapę
        initMap();
    }, [savedMarkers]);

    useEffect(() => {
        if (map) {
            // Usuń poprzednie kliknięte znaczniki
            clickedMarkers.forEach(marker => {
                marker.setMap(null);
            });

            if (clickedMarkers.length > 0) {
                const lastClickedMarker = clickedMarkers[clickedMarkers.length - 1];
                lastClickedMarker.setMap(map);

                // Ustawienie granic mapy z uwzględnieniem wszystkich znaczników
                const bounds = new window.google.maps.LatLngBounds();
                savedMarkers.forEach(markerPosition => {
                    bounds.extend(markerPosition);
                });
                bounds.extend(lastClickedMarker.getPosition());
                map.fitBounds(bounds);
            }
        }
    }, [clickedMarkers, map, savedMarkers]);



    return (
        <div>
            <div id="gmp-map" style={{ width: '50%', height: '400px' }}></div>
            {closestMarker && (
                <p>Najbliższy znacznik: {JSON.stringify(closestMarker)}</p>
            )}
            {/* Dodatkowe zawartości komponentu, np. nagłówek, przyciski */}
            <Link to="/">View1</Link>
        </div>
    );
};

export default View2;
