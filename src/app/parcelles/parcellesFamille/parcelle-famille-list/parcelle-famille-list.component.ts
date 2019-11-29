import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ParcelleFamilleService } from 'src/app/services/parcelleFamille.service';
import { ParcelleFamille } from 'src/app/models/ParcelleFamille.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parcelle-famille-list',
  templateUrl: './parcelle-famille-list.component.html',
  styleUrls: ['./parcelle-famille-list.component.css']
})

export class ParcelleFamilleListComponent implements OnInit, OnDestroy {

  @Input() index: number;
  parcellesFamille: ParcelleFamille[] = [];
  parcelleFamilleSubscription: Subscription;

  constructor(private parcelleService: ParcelleFamilleService) { }

  ngOnInit() {
    this.parcelleFamilleSubscription = this.parcelleService.parcelleFamilleSubject.subscribe(
      (parcellesFamille: ParcelleFamille[]) => {
        this.parcellesFamille = parcellesFamille;
      }
      )
    this.parcelleService.emitParcelleFamilleSubject();
  }

  ngOnDestroy(){
    this.parcelleFamilleSubscription.unsubscribe();
  }

  onFetch(){
    console.log("fetching features");
    this.parcelleService.getParcellesFamille();
  }

  onSave(){
    this.parcelleService.saveParcellesFamille();
  }

  onDeleteParcelle(p: ParcelleFamille){
    var index = this.parcellesFamille.indexOf(p);
    this.parcelleService.deleteParcelleFamille(index);
  }

  getColor(p: ParcelleFamille){
    var index = this.parcellesFamille.indexOf(p);
    if (this.parcellesFamille[index].newOrModified){
      return 'blue';
    }
    else{
      return 'grey';
    }
  }
}
