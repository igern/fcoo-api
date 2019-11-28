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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
var MongoClient = require("mongodb").MongoClient;
const geofence_1 = require("./geofence");
const latlon_1 = require("./latlon");
const dbUrl = "mongodb://igern:nkLnt69XZNRfoRM9pXRo8LRXHHVCN2Rb6jrlMt0xk3HHC6d0PUNzz2fPvHKEtjRS0rCzi0WoItJWMNY9XlaIsg%3D%3D@igern.mongo.cosmos.azure.com:10255/?ssl=true&appName=@igern@";
const dbName = process.env.dbName || "fcoodb";
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const port = process.env.PORT || "3001";
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello there');
});
app.post("/api", (req, res) => {
    const input = req.body;
    const coordinateList = [];
    for (const point of input.geofence.latlonList) {
        coordinateList.push(new latlon_1.LatLon(point.lat, point.lon));
    }
    let geofence;
    switch (input.geofence.type) {
        case "polygon":
            geofence = new geofence_1.PolygonalGeofence(input.beginTime, input.endTime, coordinateList);
            break;
        default:
            res.send("bad geofence type");
            break;
    }
    MongoClient.connect(dbUrl, (err, client) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equal(null, err);
        const db = client.db(dbName);
        geofence.handle(db).then((result) => {
            client.close();
            if (result.length < 1) {
                res.status(404).send("no data");
            }
            else {
                res.status(200).send(result);
            }
        });
    }));
});
//# sourceMappingURL=app.js.map