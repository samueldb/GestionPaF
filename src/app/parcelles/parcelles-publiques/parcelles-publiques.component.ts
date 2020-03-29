import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { ParcellePublique } from 'src/app/models/ParcellePublique.model';
import { ParcellePubliqueService } from 'src/app/services/parcellepublique.service';
import * as L from 'leaflet';
import { geoJSON } from 'leaflet';

@Component({
  selector: 'app-parcelles-publiques',
  templateUrl: './parcelles-publiques.component.html',
  styleUrls: ['./parcelles-publiques.component.css']
})
export class ParcellesPubliquesComponent {
  map: L.Map;
  parcellespubliques: ParcellePublique;
  defStyle;
  ParcellesLayer;
  visible;
  geoJsonParcellesLayer;

  options = {
    layers: [],
    zoom: 15,
    minZoom: 2,
    center: L.latLng(45.488841, 6.567785)
  };

  baseLayers = [L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 20, attribution: '&copy; OpenStreetMap contributors ' })]

    
  constructor(private http: HttpClient, private parcellesPubliquesService: ParcellePubliqueService) { }


  onMapReady(map: L.Map) {
    this.map = map;
    this.getParcellesPubliques().subscribe(
      (data: any) => {
        for (const f of data.features) {
          f.properties['style'] = this.setStyleParcelles(f);
        }
        this.parcellespubliques = data;
        this.parcellespubliques["type"] = "FeatureCollection";
        console.log(this.parcellespubliques);
        this.geoJsonParcellesLayer = L.geoJSON(this.parcellespubliques, {
          style:
            (feat) => {
              return feat.properties.style;
            },
          onEachFeature:
            (feat, layer) => {
              this.onEachFeature(feat, layer);
            }
        });
        this.geoJsonParcellesLayer.addTo(map);
      }
    );
  }

  onMapClick(map: L.Map, parcelle) {
    console.log(event);
    // map.openPopup;
  }

  onMapZoomEnd(map: L.Map) {
    console.log("zoom ended : " + this.map.getZoom())
    if (this.map.getZoom() > 16) {
      if (!this.visible) {
        this.geoJsonParcellesLayer.eachLayer((layer) => {
          // layer.openTooltip();
        });
        this.visible = true;
      }
    }
    else {
      if (this.visible){
        this.geoJsonParcellesLayer.eachLayer((layer) => {
          layer.hideTooltip();
        });
        this.visible = false;
      }
    }
  }

  onEachFeature(feature, layer) {
    var popUpText = "<b>Section :</b> " + feature.properties.section +
      "<br><b>Numéro :</b> " + feature.properties.numero;
    layer.bindPopup(popUpText, {
      closeButton: true
    });
    layer.on('click', layer.openPopup());
    
  }

  getParcellesPubliques() {
    return this.parcellesPubliquesService.getParcellesPubliques();
  }

  setStyleParcelles(feature) {
    this.defStyle = {
      "color": "grey",
      "fillColor": "white",
      "weight": 1,
      "opacity": 0.6,
      "fillOpacity": 0,
      "label": "unknown"
    };
    if (feature.properties.section == "A") { this.defStyle.color = "#4bae40"; };
    if (feature.properties.section == "B") { this.defStyle.color = "#db1ce7"; };
    if (feature.properties.section == "C") { this.defStyle.color = "#e7ca20"; };
    if (feature.properties.section == "D") { this.defStyle.color = "#e7301f"; };
    if (feature.properties.section == "E") { this.defStyle.color = "#ffaa00"; };
    if (feature.properties.section == "F") { this.defStyle.color = "#4b1964"; };
    if (feature.properties.section == "G") { this.defStyle.color = "#00a489"; };
    if (feature.properties.section == "H") { this.defStyle.color = "#8b6204"; };
    if (feature.properties.section == "I") { this.defStyle.color = "#f19041"; };
    this.defStyle.label = feature.properties.number;
    return this.defStyle;
  }
}
