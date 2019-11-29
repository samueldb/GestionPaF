import { ParcelleFamille } from '../models/ParcelleFamille.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParcelleFamilleService {
   parcelleFamilleSubject = new Subject<ParcelleFamille[]>();
   private parcellesFamille: ParcelleFamille[] = [];

   emitParcelleFamilleSubject() {
      this.parcelleFamilleSubject.next(this.parcellesFamille.slice());
   }

   addParcelleFamille(parcelleObject: ParcelleFamille) {
      this.parcellesFamille.push(parcelleObject);
      this.emitParcelleFamilleSubject();
      console.log("parcelle bien ajoutée" + parcelleObject);
   }

   saveParcellesFamille() {
      // this.getParcellesFamille();
      for (let p of this.parcellesFamille){
         p.newOrModified = false;
      }
      this.httpClient.put('https://fonciermontfort.firebaseio.com/parcellesFamille.json',
         this.parcellesFamille)
         .subscribe(
            () => {
               console.log('Enregistrement terminé');
            },
            (error) => {
               console.log('Erreur : ' + error)
            }
         );
   }

   getParcellesFamille(){
      this.httpClient
      .get<ParcelleFamille[]>('https://fonciermontfort.firebaseio.com/parcellesFamille.json')
      .subscribe(
        (response) => {
          this.parcellesFamille = response;
          this.emitParcelleFamilleSubject();
          },
          (error) => {
            console.log('Erreur : ' + error);
          }
      )
   }

   deleteParcelleFamille(i: number){
      this.parcellesFamille.splice(i, 1);
      this.emitParcelleFamilleSubject();
   }

   getDefaultStyle() {
      return '#parcelles_montfort_2019_10 {\
            polygon-opacity: 0;\
            line-color: #FFF;\
            line-width: 0.5;\
            line-opacity: 1;\
         }\
         #parcelles_montfort_2019_10[section="A"] {\
            line-color: #A6CEE3;\
         }\
         #parcelles_montfort_2019_10[section="B"] {\
            line-color: #1F78B4;\
         }\
         #parcelles_montfort_2019_10[section="C"] {\
            line-color: #B2DF8A;\
         }\
         #parcelles_montfort_2019_10[section="D"] {\
            line-color: #33A02C;\
         }\
         #parcelles_montfort_2019_10[section="E"] {\
            line-color: #012700;\
         }\
         #parcelles_montfort_2019_10[section="F"] {\
            line-color: #E31A1C;\
         }\
         #parcelles_montfort_2019_10[section="G"] {\
            line-color: #3E7BB6;\
         }\
         #parcelles_montfort_2019_10[section="H"] {\
            line-color: #A53ED5;\
         }\
         #parcelles_montfort_2019_10[section="I"] {\
            line-color: #CAB2D6;\
         }\
         #parcelles_montfort_2019_10::labels {\
               text-name: [numero];\
               text-face-name: \'Lato Bold Italic\';\
               text-size: 10;\
               text-fill: #000000;\
               text-label-position-tolerance: 0;\
               text-allow-overlap: true;\
               text-placement: point;\
               text-placement-type: simple;\
             }';
   }

   constructor(private httpClient: HttpClient) { }
}