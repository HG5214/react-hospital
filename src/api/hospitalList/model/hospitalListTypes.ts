export type status=0|1
export interface IhospitalParams{
    page:number,
    limit:number,
    hoscode?:string,
    hosname?:string,
    hostype?:string,
    provinceCode?:string,
    cityCode?:string,
    districtCode?:string,
    status?:status
}
export interface IhospitalListItem{
        "id":string,
        "createTime"?: string,
        "param": {
          "hostypeString": string,
          "fullAddress": string
        },
        "hosname":string,
        "logoData":string,
        "status":status,
        
}
export type IhospitalList=IhospitalListItem[]
export interface IhospitalListRes{
    content:IhospitalList,
    totalElements:number
}
export interface Idict{
  id:number,
  name:string,
  value:string,
}
export type IdictList = Idict[]
export interface IhospShowBook{
    "cycle":number,
    "releaseTime": string,
      "stopTime": string,
      "quitTime": string,
      "rule": string[]
}
export interface IhospitalShow extends IhospitalListItem{
    hoscode:string,
    intro:string,
    route:string
}
export interface IhospitalShowRes{
  bookingRule?:IhospShowBook,
  hospital?:IhospitalShow
}
export type ISched=ISchedule[]
export interface ISchedule {
      "depcode": string,
      "depname": string,
      "children":ISched,
      disabled?: boolean
}
export interface IbookingSchedule{
      "workDate": string,
        "dayOfWeek": string,
        "reservedNumber":number,
        "availableNumber": number,
}
export type Ibooking=IbookingSchedule[]
export interface IScheduleRule{
  total:number,
  bookingScheduleList:Ibooking,
  baseMap: {
    hosname: string
  }
}
export interface ItableScheduled{
  "id":string
  "title": string,
  "skill":string ,
  "workDate": string,
  "reservedNumber":number,
  "availableNumber":number,
  "amount":number,
}
export type ItableList=ItableScheduled[]