export interface SNSPlanningSummary {
    monthList: string[]
    planningData: SNSPlanning[]
}

export interface SNSPlanning {
    snsSummaryId:               number;
    materialId:               number;
    materialCode:             string;
    materialAndSubGroupDesc:  string;
    subGroup:               string;
    description:            string;
    type:                   string;
    customerId:             number;
    customerCode:           string;
    customerName:           string;
    month0Quantity?:         number;
    month1Quantity?:         number;
    month2Quantity?:         number;
    month3Quantity?:         number;
    month4Quantity?:         number;
    month5Quantity?:         number;
    month6Quantity?:         number;
    month7Quantity?:         number;
    month8Quantity?:         number;
    month9Quantity?:         number;
    month10Quantity?:         number;
    month11Quantity?:         number;
    month12Quantity?:         number;
    disableEditQuantity:      boolean;
    isUpdated:                boolean;
}