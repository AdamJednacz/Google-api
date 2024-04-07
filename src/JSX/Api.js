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

            loader.load().then(async () => {
                const { Map, Autocomplete } = await google.maps.importLibrary("places");

                const mapOptions = CONFIGURATION.mapOptions;
                const map = new Map(document.getElementById('gmp-map'), mapOptions);
                const autocomplete = new Autocomplete(document.getElementById('location-input'), {
                    fields: ['address_components', 'geometry', 'name'],
                    types: ['address'],
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
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
                });
            });
        };

        initMap();
    }, []);

    const handleSubmit = () => {
        console.log('Address:', address);
        // Tutaj możesz przekazać wartość `address` dalej w swojej aplikacji
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
                        placeholder="State/Province"
                        value={address.postal_code}
                        onChange={(e) => handleChange(e, 'postal_code')}
                    />
                    <input
                        type="text"
                        className="half-input"
                        placeholder="Zip/Postal code"
                        value={address.country}
                        onChange={(e) => handleChange(e, 'country')}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleChange(e, 'country')}
                />
                <button className="button-cta" onClick={handleSubmit}>Checkout</button>
            </div>
            <div className="map" id="gmp-map" style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default AddressSelection;
