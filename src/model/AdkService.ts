import { AdkServiceId } from "./enum/AdkServiceId";
import { AdkServiceType } from "./enum/AdkServiceType";

export class AdkService {
    constructor(readonly adkServiceId: AdkServiceId, readonly baseUrl: string, readonly urlPath: string, readonly type: AdkServiceType) {}
}