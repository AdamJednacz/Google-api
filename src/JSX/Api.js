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

    // Define google, place, and map variables in the outer scope
    let google, place, map;

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
                google = googleInstance;
                const { Autocomplete } = await google.maps.importLibrary("places");

                const mapOptions = CONFIGURATION.mapOptions;
                map = new google.maps.Map(document.getElementById('gmp-map'), mapOptions);
                const autocomplete = new Autocomplete(document.getElementById('location-input'), {
                    fields: ['address_components', 'geometry', 'name'],
                    types: ['address'],
                });

                autocomplete.addListener('place_changed', () => {
                    place = autocomplete.getPlace();
                    if (!place.geometry) {
                        window.alert(`No details available for input: '${place.name}'`);
                        return;
                    }
                    setAddress({
                        location: place.name,
                        locality: place.formatted_address,
                        administrative_area_level_1: place.address_components[0].long_name,
                        postal_code: place.address_components[6].long_name,
                        country: place.address_components[5].long_name,
                    });

                    handleCheckout(); // Call handleCheckout function
                });
            });
        };

        initMap();
    }, []);

    const handleCheckout = () => {
        if (google && google.maps) {
            if (place && place.geometry) {
                // Tworzenie znacznika na mapie w miejscu wybranego adresu
                const marker = new google.maps.Marker({
                    position: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    },
                    map: map,
                    title: place.formatted_address // Opcjonalny tytuł znacznika
                });

                // Ustawienie nowego centrum mapy na wybranej lokalizacji
                map.setCenter(place.geometry.location);
            }
        } else {
            console.error('Google Maps API is not available.');
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
                    value={address.locality}
                    onChange={(e) => handleChange(e, 'locality')}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={address.administrative_area_level_1}
                    onChange={(e) => handleChange(e, 'administrative_area_level_1')}
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
                <button className="button-cta" onClick={handleCheckout}>Checkout</button>
            </div>
            <div className="map" id="gmp-map" style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default AddressSelection;
