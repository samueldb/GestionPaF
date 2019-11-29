import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as D from 'leaflet-draw';
import * as carto from '@carto/carto.js';
import { FeuillesService } from 'src/app/services/feuilles.service';
import { ParcelleFamilleService } from 'src/app/services/parcelleFamille.service';
import { ParcellePubliqueService } from 'src/app/services/parcellepublique.service';
import { SectionsService } from 'src/app/services/sections.service';
import { ParcelleFamille } from 'src/app/models/ParcelleFamille.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-parcelle-famille',
  templateUrl: './add-parcelle-famille.component.html',
  styleUrls: ['./add-parcelle-famille.component.css']
})
export class AddParcelleFamilleComponent implements OnInit, OnDestroy {

  private apiKey = '261bbc94c8266573016ba9454127b905b931b0a6';
  private username = 'samueldeschampsberger';
  parcelleFamilleForm: FormGroup;
  map: L.Map;
  private sections;
  private feuilles;
  private parcellesPubliques;
  private sectionsLayerGroup = L.layerGroup();
  private feuillesLayerGroup = L.layerGroup();
  private parcellesPubliquesLayerGroup = L.layerGroup();
  private cartoLayer;
  OverlayMaps;
  cartoClient;
  parcellesFamille: any[];
  parcellesFamilleSubscription: Subscription;


  constructor(private formBuilder: FormBuilder,
    private parcellePubliqueService: ParcellePubliqueService,
    private parcelleFamilleService: ParcelleFamilleService,
    private sectionService: SectionsService,
    private feuilleService: FeuillesService,
    private router: Router) { }


  ngOnInit() {
    this.initForm();
    this.initMap();
    this.parcellesFamilleSubscription = this.parcelleFamilleService.parcelleFamilleSubject.subscribe(
      (parcelles: ParcelleFamille[]) => {
        this.parcellesFamille = parcelles;
      }
    );
    this.parcelleFamilleService.emitParcelleFamilleSubject();
  }

  ngOnDestroy(){
    this.parcellesFamilleSubscription.unsubscribe();
  }

  initForm() {
    this.parcelleFamilleForm = this.formBuilder.group({
      sectionName: ['', Validators.required],
      feuilleName: ['', Validators.required],
      numero: ['', Validators.required]
    })
  }

  initMap() {
    this.map = L.map(
      'map', {
      center: L.latLng(45.488841, 6.567785),
      zoom: 12
    }
    )

    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    // var tilesParcelles = L.tileLayer('https://api.mapbox.com/styles/v1/samueldb/cjw7k7d4l02xm1co2mnb30n9m/wmts?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIegREQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0',
    //   {                               
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    //   });
    // tilesParcelles.addTo(this.map);

    var layerSource = new carto.source.SQL("SELECT * FROM parcelles_montfort_2019_10");
    var layerStyle = new carto.style.CartoCSS(this.parcelleFamilleService.getDefaultStyle());

    this.cartoClient = new carto.Client({
      apiKey: this.apiKey,
      username: this.username
    })

    this.cartoLayer = new carto.layer.Layer(layerSource, layerStyle,
      {
        featureClickColumns: ['section', 'numero', 'contenance']
      }
    );
    this.cartoLayer.on('featureClicked', featEvent => {
      console.log("clicked on : " + featEvent.data.numero);
      this.parcelleFamilleForm.controls['numero'].setValue(featEvent.data.numero);
      // let el: HTMLElement = this.parcelleFamilleForm.controls['numero'];
      // el.blur();
      this.onBlurNumeroMethod();
    })
    this.cartoLayer.hide();
    this.cartoClient.addLayer(this.cartoLayer, {
      minZoom: 17
    });

    this.AddSectionLayer();
    this.AddFeuilleLayer();
    this.AddParcellesPubliquesLayer();

    var baseLayers = {
      "OSM": tiles,
      // "cadastre": tilesParcelles
    }
    this.OverlayMaps = {
      "sections": this.sectionsLayerGroup,
      "feuilles": this.feuillesLayerGroup,
      "parcelles": this.parcellesPubliquesLayerGroup,
      // "parcellesCarto": this.cartoClient.getLayers()
    }

    this.cartoClient.getLeafletLayer().addTo(this.map);
  }

  private AddParcellesPubliquesLayer() {
    this.parcellePubliqueService.getParcellesPubliques().subscribe(parcelles => {
      this.parcellesPubliques = parcelles;
      this.parcellesPubliques.type = 'parcellesPubliques';
      const styledProperties = {
        weight: 1,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0,
        maxZoom: 18,
        attribution: 'parcelle'
      };
      this.initLayer(this.parcellesPubliques, styledProperties);
    });
  }

  private AddFeuilleLayer() {
    this.feuilleService.getFeuillesShapes().subscribe(feuilles => {
      this.feuilles = feuilles;
      this.feuilles.type = 'feuilles';
      const styledProperties = {
        weight: 2,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0,
        attribution: 'feuille'
      };
      this.initLayer(this.feuilles, styledProperties);
    });
  }

  private AddSectionLayer() {
    this.sectionService.getSectionsShapes().subscribe(sections => {
      this.sections = sections;
      this.sections.type = 'sections';
      const styledProperties = {
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0,
        attribution: 'section'
      };
      this.initLayer(this.sections, styledProperties);
    });
  }

  initLayer(data, styleProperties) {
    const layer = L.geoJSON(data, {
      style: (feature) => ({
        weight: styleProperties.weight,
        opacity: styleProperties.opacity,
        color: styleProperties.color,
        fillOpacity: styleProperties.fillOpacity,
      }),
      filter: (feature) => {
        if (data.type == 'parcellesPubliques') {
          return feature.properties.numero > 0;
        }
        else {
          return true;
        }
      },
      attribution: styleProperties.attribution

    });
    var typeOfLayer = styleProperties.attribution;
    if (typeOfLayer == "section") {
      this.sectionsLayerGroup.addLayer(layer);
      // this.sectionsLayerGroup.addTo(this.map);
    }
    else if (typeOfLayer == "feuille") {
      this.feuillesLayerGroup.addLayer(layer);
      // this.feuillesLayerGroup.addTo(this.map);
    }
    else if (typeOfLayer == "parcelle") {
      this.parcellesPubliquesLayerGroup.addLayer(layer);
      // this.parcellesPubliquesLayerGroup.addTo(this.map);
    }
  }

  onBlurSectionMethod() {
    var givenSection = this.parcelleFamilleForm.value['sectionName'];
    var match;
    this.cartoLayer.hide();
    this.parcelleFamilleForm.controls["feuilleName"].reset();
    this.parcelleFamilleForm.controls["numero"].reset();
    this.sectionsLayerGroup.eachLayer(function (glayer) {
      glayer.eachLayer(function (layer) {
        if (typeof (layer.feature) != 'undefined') {
          if (layer.feature.properties.code == givenSection) {
            match = layer.getBounds();
            layer.setStyle({ weight: 5, color: 'yellow' });
          }
          else {
            layer.setStyle({ weight: 1, color: 'red' });
          }
        }
      }
      )
    });
    this.map.addLayer(this.sectionsLayerGroup);
    this.map.fitBounds(match);
  }

  onBlurFeuilleMethod() {
    var givenSection = this.parcelleFamilleForm.value['sectionName'];
    var givenFeuille = this.parcelleFamilleForm.value['feuilleName'];
    var match;
    this.map.addLayer(this.feuillesLayerGroup);
    this.map.eachLayer(function (layer: L.Layer) {
      if (typeof (layer.feature) != 'undefined' && layer.defaultOptions.attribution == 'section') {
        // Re init section styles
        layer.setStyle({ weight: 1, color: 'red' });
      }
      if (typeof (layer.feature) != 'undefined' && layer.defaultOptions.attribution == 'feuille') {
        var prop = layer.feature.properties;
        if (prop.section == givenSection && prop.numero == givenFeuille) {
          match = layer.getBounds();
          layer.setStyle({ weight: 5, color: 'yellow' });
          // layer.bindTooltip(layer.feature.properties.numero, { permanent: true, direction: "center", opacity: 0.5 }).openTooltip();
        }
        else if (prop.section != givenSection || prop.numero != givenFeuille) {
          layer.setStyle({ weight: 1, color: 'blue' });
          layer.closeTooltip();
          layer.redraw();
        }
      }
    });
    this.map.addLayer(this.sectionsLayerGroup);
    if (typeof (match) != 'undefined') {
      this.map.fitBounds(match);
    }
  }

  onBlurNumeroMethod() {
    var givenSection = this.parcelleFamilleForm.value['sectionName'];
    var givenParcelle = this.parcelleFamilleForm.value['numero'];
    var match;
    this.parcellesPubliquesLayerGroup.eachLayer(function (grouplayer) {
      grouplayer.eachLayer(function (layer) {
        if (typeof (layer.feature) != 'undefined') {
          var prop = layer.feature.properties;
          layer.closeTooltip();
          if (prop.numero == givenParcelle && prop.section == givenSection) {
            match = layer.getBounds();

            layer.setStyle({ opacity: 1, color: 'red', weight: 3 });
          }
          else if (prop.section == givenSection) {
            layer.setStyle({ opacity: 0.2, color: 'grey' });
          }
          else {
            layer.setStyle({ opacity: 0 });
            layer.closeTooltip();
          }
        }
      }
      )
    });
    var newSourceSQL = new carto.source.SQL("SELECT * FROM parcelles_montfort_2019_10 WHERE section like '" + givenSection + "'");
    this.cartoLayer.setSource(newSourceSQL);
    this.cartoLayer.show();
    this.map.addLayer(this.parcellesPubliquesLayerGroup);
    if (typeof (match) != 'undefined') {
      this.map.fitBounds(match);
    }
  }

  onSubmitForm(form: NgForm) {
    console.log("submit ! " + form.value);
    const section = form.value['sectionName'];
    const feuille = form.value['feuilleName'];
    const numero = form.value['numero'];
    var selectedFeature = this.getGeoJsonFromCarto(section, numero);
    var newParcelle = new ParcelleFamille(
                                selectedFeature["id"], 
                                "parcelle", 
                                selectedFeature["geometry"], 
                                true,
                                selectedFeature.properties["contenance"],
                                section, 
                                feuille, 
                                numero);
    this.parcelleFamilleService.addParcelleFamille(newParcelle);
    this.router.navigate(['/parcelleFamilleList']);

  }

  getGeoJsonFromCarto(section: string, numero: number) {
    var geojson;
    this.parcellesPubliquesLayerGroup.eachLayer(function (grouplayer) {
      grouplayer.eachLayer(function (layer) {
        if (typeof (layer.feature) != 'undefined') {
          var prop = layer.feature.properties;
          if (prop.numero == numero && prop.section == section) {
            geojson = layer.toGeoJSON();
        }
      }
    });
    });
    return geojson;
  }
}
