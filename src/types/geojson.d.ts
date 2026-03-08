declare module '*.geojson' {
    const value: GeoJSON.Feature | GeoJSON.FeatureCollection;
    export default value;
}

