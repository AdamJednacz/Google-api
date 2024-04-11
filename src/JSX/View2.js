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
        console.log('Stored markers:', storedMarkers);
    }, []);

    const findClosestMarker = (clickedPosition, markers) => {
        let closestMarker = null;
        let minDistanceX = Number.MAX_VALUE;
        let minDistanceY = Number.MAX_VALUE;

        markers.forEach(markerPosition => {
            const distanceX = Math.abs(markerPosition.lat - clickedPosition.lat);
            const distanceY = Math.abs(markerPosition.lng - clickedPosition.lng);

            if (distanceX < minDistanceX || distanceY < minDistanceY) {
                minDistanceX = distanceX;
                minDistanceY = distanceY;
                closestMarker = markerPosition;
            }
        });

        return closestMarker;
    };

    useEffect(() => {
        const addMarker = (clickedPosition) => {
            if (map) {
                if (clickedMarker) {
                    clickedMarker.setMap(null);
                }

                const newClickedMarker = new window.google.maps.Marker({
                    position: clickedPosition,
                    map: map,
                });
                setClickedMarker(newClickedMarker);

                localStorage.setItem('clickedMarker', JSON.stringify(clickedPosition));
                console.log('Clicked marker latitude:', clickedPosition.lat());
                console.log('Clicked marker longitude:', clickedPosition.lng());

                localStorage.setItem('clickedMarkerLatitude', clickedPosition.lat());

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
        if (clickedMarker) {
            const closest = findClosestMarker(clickedMarker.getPosition().toJSON(), savedMarkers);
            setClosestMarker(closest);
        }
    }, [clickedMarker, savedMarkers]);

    useEffect(() => {
        if (map) {
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
