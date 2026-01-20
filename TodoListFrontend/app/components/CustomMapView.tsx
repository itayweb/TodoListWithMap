import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { useEffect, useRef } from 'react';
import type { FeatureLike } from 'ol/Feature';
import type { MapViewProps } from '~/types';
import { Box } from '@mui/material';

export default function CustomMapView({
    layers = [],
    center = [0, 0],
    zoom = 2,
    onClick,
    height = '400px',
    displayTooltip = false
}: MapViewProps) {
    const mapElement = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const overlayElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof document === 'undefined' || !mapElement.current) return;

        const map = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                ...layers
            ],
            view: new View({ center: fromLonLat(center), zoom }),
        });

        map.on('singleclick', (event) => {
            if (onClick) onClick(event.coordinate, map);
        });

        let currentFeature: FeatureLike | undefined;

        const displayFeatureInfo = (pixel: number[], target: EventTarget | null) => {
            const isControl = (target as HTMLElement)?.closest('.ol-control') !== null;

            const feature = isControl
                ? undefined
                : (map.forEachFeatureAtPixel(pixel, (f) => f) as Feature | undefined);

            const targetElement = map.getTargetElement();
            if (targetElement) {
                targetElement.style.cursor = feature ? 'pointer' : '';
            }

            if (feature && overlayElement.current) {
                overlayElement.current.style.left = pixel[0] + 'px';
                overlayElement.current.style.top = pixel[1] + 'px';
                if (feature !== currentFeature) {
                    overlayElement.current.style.visibility = 'visible';
                    overlayElement.current.innerText = feature.get('name') || '';
                }
            } else {
                if (overlayElement.current) {
                    overlayElement.current.style.visibility = 'hidden';
                }
            }
            currentFeature = feature;
        };

        map.on('pointermove', (evt) => {
            if (evt.dragging) {
                if (overlayElement.current) {
                    overlayElement.current.style.visibility = 'hidden';
                }
                currentFeature = undefined;
                return;
            }
            if (displayTooltip)
                displayFeatureInfo(evt.pixel, evt.originalEvent.target);
        });

        const mapTargetElement = map.getTargetElement();
        let handlePointerLeave: (() => void) | null = null;

        if (mapTargetElement) {
            handlePointerLeave = () => {
                currentFeature = undefined;
                if (overlayElement.current) {
                    overlayElement.current.style.visibility = 'hidden';
                }
            };
            mapTargetElement.addEventListener('pointerleave', handlePointerLeave);
        }

        mapRef.current = map;

        return () => {
            if (mapTargetElement && handlePointerLeave) {
                mapTargetElement.removeEventListener('pointerleave', handlePointerLeave);
            }
            map.setTarget(undefined);
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const currentLayers = mapRef.current.getLayers().getArray();
        const tileLayer = currentLayers.find(layer => layer instanceof TileLayer);
        const currentVectorLayers = currentLayers.filter(layer => !(layer instanceof TileLayer));

        currentVectorLayers.forEach(layer => {
            mapRef.current?.getLayers().remove(layer);
        });

        layers.forEach(layer => {
            mapRef.current?.getLayers().push(layer);
        });
    }, [layers]);

    return (
        <Box style={{ position: 'relative', width: '100%', height }}>
            <Box ref={mapElement} style={{ height, width: '100%' }} />
            <Box
                ref={overlayElement}
                style={{
                    position: 'absolute',
                    display: 'inline-block',
                    height: 'auto',
                    width: 'auto',
                    zIndex: 100,
                    backgroundColor: '#333',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '4px',
                    padding: '5px',
                    visibility: 'hidden',
                    pointerEvents: 'none'
                }}
            />
        </Box>
    );
}
