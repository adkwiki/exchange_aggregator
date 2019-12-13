import { AdkService } from "../model/AdkService";
import { AdkServiceId } from "../model/enum/AdkServiceId";
import { AdkServiceType } from "../model/enum/AdkServiceType";

export class AdkServiceRepository {
    
    private _serviceArray : AdkService[] = []; 

    constructor() {
        this._serviceArray.push(new AdkService(AdkServiceId.wallet1, "http://wallet1.aidoskuneen.com:14266", "", AdkServiceType.node));
        this._serviceArray.push(new AdkService(AdkServiceId.wallet2, "http://wallet2.aidoskuneen.com:14266", "", AdkServiceType.node));
        this._serviceArray.push(new AdkService(AdkServiceId.market, "https://aidosmarket.com", "/api/stats", AdkServiceType.site));
        this._serviceArray.push(new AdkService(AdkServiceId.explorer, "https://explorer.aidoskuneen.com", "", AdkServiceType.site));
    }

    findAll() {
        return this._serviceArray;
    }

}