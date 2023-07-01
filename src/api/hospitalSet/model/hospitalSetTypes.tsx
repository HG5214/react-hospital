export interface hospitalAdd{
    "hosname":string,
    "hoscode":string,
    "apiUrl":string,
    "contactsName":string,
    "contactsPhone":string,
}
export interface IhosoitalItem extends hospitalAdd{
    "id": number,
    "signKey"?:string,
}
export type IhospitalList=IhosoitalItem[]
export interface IhospitalSetRes{
    total:number,
    records:IhospitalList
}