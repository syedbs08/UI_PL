export interface Material {
    materialId:               number;
    materialCode:             string;
    materialShortDescription: string;
    companyId:                number;
    barCode:                  string;
    inSap:                    boolean;
    weight:                   number;
    volume:                   number;
    seaPortId:                number;
    airPortId:                number;
    productCategoryId1:       number;
    productCategoryId2:       number;
    productCategoryId3:       null;
    productCategoryId4:       null;
    productCategoryId5:       null;
    productCategoryId6:       null;
    supplierId:               number;
    isActive:                 boolean;
    createdDate:              Date;
    createdBy:                string;
    updateDate:               Date;
    updateBy:                 string;
}
export interface MaterialList {
    MaterialId:number;
    MaterialCode:string;
}