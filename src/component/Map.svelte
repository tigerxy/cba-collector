<script lang="ts">
  import Fab, { Icon } from "@smui/fab";
  import type { Feature } from "geojson";
  import L from "leaflet";
  import { createEventDispatcher, onMount, setContext } from "svelte";
  import "../../node_modules/leaflet/dist/leaflet.css";
  import { areas, collectionPoints } from "../store/db";

  const dispatch = createEventDispatcher<{
    areaSelected: Feature;
    collectingPointSelected: Feature;
  }>();

  export let noGPSPosition = false;
  let followLocation = true;

  let mapContainer;
  let map = L.map(L.DomUtil.create("div"), {
    center: [49.7124, 11.0631],
    zoom: 14,
    zoomControl: false,
  });

  let gpsPosition = L.circle([51, 9], { radius: 1500000 });

  map.locate({ watch: true, enableHighAccuracy: true });

  map.on("locationfound", (e) => {
    gpsPosition.setLatLng(e.latlng);
    gpsPosition.setRadius(e.accuracy / 2);
    gpsPosition.addTo(map);
    if (followLocation) {
      map.flyTo(e.latlng);
    }
    noGPSPosition = false;
  });

  map.on("locationerror", (e) => {
    // TODO: Enable GPS
    //map.locate({ watch: true, enableHighAccuracy: false });
    console.error(e.message);
    gpsPosition.remove();
    noGPSPosition = true;
  });

  map.on("movestart", (e) => {
    followLocation = false;
    console.log("movestart");
  });

  const moveToLocation = () => {
    console.log("moveToLocation clicked")
    if (!noGPSPosition) map.flyTo(gpsPosition.getLatLng());
    followLocation = true;
  };

  setContext("leafletMapInstance", map);

  L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  }).addTo(map);

  var areasLayer = L.geoJSON(null, {
    onEachFeature: (feature, layer) => {
      console.log(layer);
      layer.addEventListener("click", (e) => {
        dispatch("areaSelected", e.target.feature);
      });
    },
  }).addTo(map);
  areas.subscribe((areasGeoJSON) =>
    areasGeoJSON.then((areass) => {
      areasLayer.addData(areass);
    })
  );

  const myIcon = L.icon({
    iconSize: [30, 35],
    iconAnchor: [15, 35],
    popupAnchor: [0, -37],
    iconUrl: "/images/tree_grey.png",
  });

  var pointLayer = L.geoJSON(null, {
    pointToLayer: (geoJsonPoint, latlng) => {
      return L.marker(latlng, {
        icon: myIcon,
      });
    },
    onEachFeature: (feature, layer) => {
      layer.addEventListener("click", (e) => {
        dispatch("collectingPointSelected", e.target.feature);
      });
    },
  }).addTo(map);
  collectionPoints.subscribe((points) =>
    points.then((loadedPoints) => {
      console.log(loadedPoints);
      pointLayer.addData(loadedPoints);
    })
  );

  onMount(() => {
    mapContainer.appendChild(map.getContainer());
    map.getContainer().style.width = "100%";
    map.getContainer().style.height = "100%";
    map.getContainer().style.zIndex = "0";
    map.invalidateSize();
  });
</script>

<div class="map" bind:this={mapContainer}>
  <Fab
    class="fly-to-button"
    on:click={moveToLocation}
    exited={noGPSPosition}
  >
    <Icon class="material-icons">my_location</Icon>
  </Fab>
</div>

<style>
  .map {
    flex: 1;
  }
  * :global(.fly-to-button) {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1;
  }
</style>
