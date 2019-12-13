import axios from "axios"

import { AdkService } from "../model/AdkService";

export class ServiceCrawler {

  async crawl(adkServie: AdkService) {

  }

  private crawlNode(adkServie: AdkService) {

    /*
      return new Promise(function (resolve, reject) {
          request(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
              console.log("body:" + body);
              resolve(true);
            } else {
              console.log("error:" + error);
              resolve(false);
            }
          });
        });
      */
  }

  private async crawlSite(adkServie: AdkService) {
    const axiosClient = axios.create({
      baseURL: adkServie.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'
    });

    let response;
    try {
      response = await axiosClient.get(adkServie.urlPath);
    } catch(error) {
      throw new Error(error);
    }
    console.log(response);

  }
}