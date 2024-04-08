import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

const AddressSelection = () => {
    const CONFIGURATION = {
        "mapsApiKey": "AIzaSyBJXRZnDd7FZD9riqF6MvkCw5lt3GIP6rM",
        "mapOptions": {
            "center": {"lat":37.4221,"lng":-122.0841},
            "fullscreenControl":true,
            "mapTypeControl":false,
            "streetViewControl":true,
            "zoom":11,
            "zoomControl":true,
            "maxZoom":22,
            "mapId":""
        },
    };

    const [address, setAddress] = useState({
        location: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        country: '',
    });

    const [place, setPlace] = useState(null); // Dodanie stanu dla place

    const [map, setMap] = useState(null);
    const [google, setGoogle] = useState(null);

    const [markers, setMarkers] = useState([]);

    const handleChange = (event, inputType) => {
        setAddress(prevState => ({
            ...prevState,
            [inputType]: event.target.value
        }));
    };

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: CONFIGURATION.mapsApiKey,
                version: "weekly",
            });

            loader.load().then(async (googleInstance) => {
                setGoogle(googleInstance);
                const { Autocomplete } = await googleInstance.maps.importLibrary("places");

                const mapOptions = CONFIGURATION.mapOptions;
                const newMap = new googleInstance.maps.Map(document.getElementById('gmp-map'), mapOptions);
                setMap(newMap);
                const autocomplete = new Autocomplete(document.getElementById('location-input'), {
                    fields: ['address_components', 'geometry', 'name'],
                    types: ['address'],
                });

                autocomplete.addListener('place_changed', () => {
                    const newPlace = autocomplete.getPlace();
                    if (!newPlace.geometry) {
                        window.alert(`No details available for input: '${newPlace.name}'`);
                        return;
                    }
                    setPlace(newPlace);
                    setAddress({
                        location: newPlace.name,
                        locality: newPlace.address_components[2].long_name,
                        administrative_area_level_1: newPlace.address_components[0].long_name,
                        postal_code: newPlace.address_components[6].long_name,
                        country: newPlace.address_components[5].long_name,
                    });
                    handleCheckout(newMap, newPlace);
                });
            });
        };

        initMap();
    }, []);

    const handleCheckout = (map, place) => {
        if (google && google.maps) {
            if (place && place.geometry) {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.formatted_address
                });

                map.setCenter(place.geometry.location);
            }
        } else {
            console.error('Google Maps API is not available.');
        }
    };

    const handleAdd = () => {
        if (place && place.geometry) {
            const markerPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };

            setMarkers(prevMarkers => [...prevMarkers, markerPosition]);
            console.log('Markers:', markers);
            handleCheckout(map, place);
        } else {
            console.error('Place geometry not available.');
        }
    };

    return (
        <div className="card-container">
            <div className="panel">
                <div>
                    <img className="sb-title-icon" src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg" alt="" />
                    <span className="sb-title">Address Selection</span>
                </div>
                <input
                    type="text"
                    placeholder="Address"
                    id="location-input"
                    value={address.location}
                    onChange={(e) => handleChange(e, 'location')}
                />
                <input
                    type="text"
                    placeholder="Apt, Suite, etc (optional)"
                    value={address.administrative_area_level_1 }
                    onChange={(e) => handleChange(e, 'administrative_area_level_1')}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={address.locality}
                    onChange={(e) => handleChange(e, 'locality')}
                />
                <div className="half-input-container">
                    <input
                        type="text"
                        className="half-input"
                        placeholder="Zip/Postal code"
                        value={address.postal_code}
                        onChange={(e) => handleChange(e, 'postal_code')}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleChange(e, 'country')}
                />
                <button className="button-cta" onClick={handleAdd}>Zapisz</button>
            </div>
            <div className="map" id="gmp-map" style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default AddressSelection;
