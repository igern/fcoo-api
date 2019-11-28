"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Geofence {
    constructor(beginTime, endTime, vertices) {
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.vertices = vertices;
    }
    handle(db) {
        return __awaiter(this, void 0, void 0, function* () {
            let polygon = [];
            for (let i = 0; i < this.vertices.length; i++) {
                polygon.push([this.vertices[i].lat, this.vertices[i].lon]);
            }
            let collectionNames = yield this.getCollections(db, this.beginTime, this.endTime);
            let data = [];
            for (let i = 0; i < collectionNames.length; i++) {
                let VelData = yield this.makeRequest(db, collectionNames[i], polygon);
                data.push(VelData);
            }
            return data;
        });
    }
    getCollections(db, beginTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let collections = yield db.collections();
            let filteredCollection = collections.map(function (collection) {
                return Number(collection.collectionName);
            }).filter(function (number) {
                return number >= beginTime && number <= endTime;
            }).map(function (filteredValue) {
                return filteredValue.toString();
            });
            return filteredCollection;
        });
    }
}
exports.Geofence = Geofence;
class PolygonalGeofence extends Geofence {
    constructor(beginTime, endTime, vertices) {
        super(beginTime, endTime, vertices);
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.vertices = vertices;
    }
    makeRequest(db, collectionName, vertices) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({
                location: {
                    $geoWithin: {
                        $polygon: vertices
                    }
                }
            }).toArray(function (err, docs) {
                resolve({
                    timestamp: collectionName,
                    data: docs
                });
            });
        });
    }
}
exports.PolygonalGeofence = PolygonalGeofence;
//# sourceMappingURL=geofence.js.map