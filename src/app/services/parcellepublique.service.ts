import { ParcellePublique } from '../models/ParcellePublique.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ParcellePubliqueService{
    parcellesPubliquesList: Array<ParcellePublique[]>;
    ppSubject = new Subject<any[]>();
    pp;

    constructor(private httpClient: HttpClient){}

    emitParcellePubliqueSubject(){
        // this.getParcellesPubliques();
        this.ppSubject.next(this.pp.slice());
    }

    addParcellePublique(parPub: ParcellePublique[]){
        this.parcellesPubliquesList.push(parPub);
        this.emitParcellePubliqueSubject();
    }

    getParcellesPubliques(){
        return this.httpClient
            .get<any[]>("assets/data_parcelles/2019-73253.json");
    }
}