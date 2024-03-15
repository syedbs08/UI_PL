import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService) { }
    getConsolidatedReport(command) {
      return this.httpHelper.apiPost(this.apiUrl.urlReport + "consolidated-report", command);
    }
    getAccurencyReport(command) {
      return this.httpHelper.apiPost(this.apiUrl.urlReport + "accurency-report", command);
    }
    getNonConsolidatedReport(command) {
      return this.httpHelper.apiPost(this.apiUrl.urlReport + "non-consolidated-report", command);
    }
    getReportVariant(reportType) {
      return this.httpHelper.apiGet(this.apiUrl.urlReport + "report-variant/"+reportType, null);
    }
}

