import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useMemo, useRef } from 'react'
import CustomMapView from './CustomMapView';
import type { PointPickerProps } from '~/types';

export default function PointPickerMap({ value, onChange }: PointPickerProps) {
    const markerStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            scale: 1
        })
    });


    const source = useRef(new VectorSource());

    if (value) {
        const feature = new GeoJSON().readFeature(value, {
            featureProjection: 'EPSG:3857'
        }) as Feature;
        source.current.addFeature(feature)
    }

    const layers = useMemo(() => [
        new VectorLayer({ source: source.current, style: markerStyle })
    ], []);

    const handleClick = (coordinate: number[]) => {
        const feature = new Feature(new Point(coordinate));
        source.current.clear();
        source.current.addFeature(feature);

        const geoJson = new GeoJSON().writeFeatureObject(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        onChange(geoJson);
    };

    return <CustomMapView layers={layers} onClick={handleClick} />;
}
