<script>
  import "../../node_modules/leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { setContext, onMount } from "svelte";
  import { areas, collectionPoints } from "../store/db";

  let mapContainer;
  let map = L.map(L.DomUtil.create("div"), {
    center: [49.7124, 11.0631],
    zoom: 14,
    zoomControl: false,
  });

  let gpsPosition = L.circle([51, 9], { radius: 1500000 });
  gpsPosition.addTo(map);

  // TODO: Enable GPS
  map.locate({ watch: true, enableHighAccuracy: true });

  map.on("locationfound", (e) => {
    let radius = e.accuracy / 2;

    gpsPosition.setLatLng(e.latlng);
    gpsPosition.setRadius(radius);
  });

  map.on("locationerror", (e) => {
    // TODO: Enable GPS
    //map.locate({ watch: true, enableHighAccuracy: false });
    console.error(e.message);
  });

  setContext("leafletMapInstance", map);

  L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  }).addTo(map);

  var areasLayer = L.geoJSON().addTo(map);
  areas.subscribe((areasGeoJSON) =>
    areasGeoJSON.then((areass) => {
      console.log(areass);
      areasLayer.addData(areass);
    })
  );

  const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  var pointLayer = L.geoJSON().addTo(map);
  pointLayer.setStyle({
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
  });
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
  <slot />
</div>

<style>
  .map {
    flex: 1;
  }
</style>
