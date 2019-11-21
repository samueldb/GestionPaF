import {FeatureCollection} from 'geojson'

export class ParcelleFamille{
    constructor(
        public id: string,
        public type: string,
        public geometry: string,
        public properties: string,
        public section,
        public feuille,
        public numero
    ){}
}