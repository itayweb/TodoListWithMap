import { Typography } from "@mui/material";
import { useAtom } from "jotai";
import { Feature } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { useMemo } from "react";
import { tasksAtom } from "~/atoms";
import CustomMapView from "~/components/CustomMapView";
import CustomSidebar from "~/components/CustomSidebar";

export default function Map() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const format = useMemo(() => new GeoJSON(), []);

  const markerStyle = useMemo(() => new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      anchor: [0.5, 1],
      scale: 1
    })
  }), []);

  const layers = useMemo(() => {
    const features = tasks.map((item) => {
      const feature = format.readFeature(item.location, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }) as Feature;

      feature.set('name', item.name);
      return feature;
    });

    return [
      new VectorLayer({
        source: new VectorSource({ features }),
        style: markerStyle
      })
    ];
  }, [tasks, format]);

  return (
    <CustomSidebar>
      <Typography variant="h2">Tasks Map</Typography>
      <CustomMapView layers={layers} displayTooltip={true} height="70vh" />
    </CustomSidebar>
  );
}
