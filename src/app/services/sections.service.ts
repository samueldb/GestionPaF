import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SectionsService {

    constructor(private http: HttpClient) { }

    getSectionsShapes(): Observable<any> {
        return this.http.get("assets/data_parcelles/cadastre-73253-sections.json");
    }
}
