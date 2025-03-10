"use client";

import React, { useState, useEffect } from "react";
import { 
    GoogleMap, 
    Marker, 
    Polyline, 
    useLoadScript 
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyDFsxHoFLM86i4wSKwUQVhLwlrtzf9Kte0";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const HospitalMap = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"], 
    });

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [path, setPath] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(userLoc);
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        if (userLocation && location) {
            console.log("Generating polyline path...");
            generatePath(userLocation, location);
        }
    }, [userLocation, location]);

    const handleSearch = async () => {
        if (!search) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: search }, (results, status) => {
            if (status === "OK") {
                const newLocation = results[0].geometry.location;
                const hospitalLocation = { lat: newLocation.lat(), lng: newLocation.lng() };
                setLocation(hospitalLocation);
            } else {
                alert("Location not found!");
            }
        });
    };

    const generatePath = (start, end) => {
        const steps = 10; // Adjust for smoothness
        const latStep = (end.lat - start.lat) / steps;
        const lngStep = (end.lng - start.lng) / steps;

        const pathPoints = Array.from({ length: steps + 1 }, (_, i) => ({
            lat: start.lat + i * latStep,
            lng: start.lng + i * lngStep,
        }));

        setPath(pathPoints);
    };

    if (!isLoaded) return <p>Loading Map...</p>;

    return (
        <div className="map_sec my-5">
            <div className="cont">
                <div className="input-cont mb-4">
                    <label htmlFor="address" className="text-black">
                        Search Hospital Address
                    </label>
                    <input
                        className="mt-2 p-2 border rounded w-full"
                        type="search"
                        placeholder="Search address"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="mt-2 p-2 bg-blue-600 text-white rounded"
                        style={{ backgroundColor: '#052C21' }}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className="map-cont mt-3" style={{ height: "400px" }}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={userLocation || { lat: 37.7749, lng: -122.4194 }}
                        zoom={userLocation ? 14 : 10}
                    >
                        {userLocation && <Marker position={userLocation} />}
                        {location && <Marker position={location} />}
                        {path.length > 0 && (
                            <Polyline
                                path={path}
                                options={{
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                }}
                            />
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};

export default HospitalMap;
