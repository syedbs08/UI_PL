import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ConfigsLoaderService {
  private httpClient: HttpClient;
  private configs: Configs;
  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }
  get ApiurlAuth() {
    return this.configs.urlAuth;
  }
  get ApiurlMaster() {
    return this.configs.urlMaster;
  }
 
  get ApiurlAttachment() {
    return this.configs.urlAttachment;
  }
 
  public async loadConfigs(): Promise<any> {
    return this.httpClient
      .get("../../../assets/config/config.json")
      .pipe((settings) => settings)
      .toPromise()
      .then((settings) => {
        this.configs = settings as Configs;
      });
  }
}
export interface Configs {
  
  urlMaster: string;
  urlAuth: string;
  urlAttachment: string;

}
