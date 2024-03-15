export interface Customer {
    id:number,
    itemName:string;
    customerId:         number;
    customerCode:       string;
    customerName:       string;
    customerShortName:  string;
    emailId:            string;
    regionId:           number | null;
    regionName:         null | string;
    departmentId:       number | null;
    departmentName:     null | string;
    countryId:          number;
    countryName:        string;
    salesOfficeId:      number | null;
    salesOfficeName:    null | string;
    personInChargeId:   string;
    personInChargeName: null;
    isBP:               boolean;
    isPSI:              boolean;
    isActive:           boolean;
    salesTypeIds:       string;
    salesTypeNames:     string;
    accountId:          number | null;
    createdDate:        string;
    updateDate:         string;
    updateDate1:        string;
    createdDate1:       string;
    updateBy:           string;
    createdBy:          string;
}