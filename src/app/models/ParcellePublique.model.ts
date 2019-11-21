import { GeoJsonTypes } from 'geojson';
import {FeatureCollection} from 'geojson'

export class ParcellePublique{
    constructor(
        public id: string,
        public type: GeoJsonTypes,
        public geometry: string,
        public properties: string,
        public feature
    ){}
}