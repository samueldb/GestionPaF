import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { ParcellesPubliquesComponent } from './parcelles/parcelles-publiques/parcelles-publiques.component';
import { HttpClientModule } from "@angular/common/http";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { ParcellePubliqueService } from './services/parcellepublique.service';
import { AddParcelleFamilleComponent } from './parcelles/parcellesFamille/add-parcelle-famille/add-parcelle-famille.component';
import { ParcelleFamilleService } from './services/parcelleFamille.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ParcelleFamilleListComponent } from './parcelles/parcellesFamille/parcelle-famille-list/parcelle-famille-list.component';

const appRoutes: Routes = [
  {path: 'parcellesPubliques', component: ParcellesPubliquesComponent},
  {path: 'addParcelleFamille', component: AddParcelleFamilleComponent},
  {path: 'parcelleFamilleList', component: ParcelleFamilleListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ParcellesPubliquesComponent,
    AddParcelleFamilleComponent,
    ParcelleFamilleListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    LeafletModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [ParcellePubliqueService, ParcelleFamilleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
