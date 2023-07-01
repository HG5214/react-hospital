import { request } from "@utils/http";
import {IhospitalParams,IhospitalListRes,IdictList,status,IhospitalShowRes,ISched,IScheduleRule,ItableList} from './model/hospitalListTypes'
export function reqGetHospitalList({page,limit,hoscode,hosname,hostype,provinceCode,cityCode,districtCode,status}:IhospitalParams){
    return request.get<any,IhospitalListRes>(`/admin/hosp/hospital/${page}/${limit}`,{
        params:{
            hoscode,
            hosname,
            hostype,
            provinceCode,
            cityCode,
            districtCode,
            status
        }
    })
}
// 获取省数据
export function hospitalFindData(dictCode='province'){
    return request.get<any,IdictList>(`/admin/cmn/dict/findByDictCode/${dictCode}`)
}
export function hospitalFindCity(parentId='10000'){
    return request.get<any,IdictList>(`/admin/cmn/dict/findByParentId/${parentId}`)
}
export function reqGetUpdateStatus(id:string,status:status){
    return request.get<any,null>(`/admin/hosp/hospital/updateStatus/${id}/${status}`)
}
export function reqGetHospitalShowList(id:string){
    return request.get<any,IhospitalShowRes>(`/admin/hosp/hospital/show/${id}`)
}
// 获取排班树形列表数据
export function reqTreeList(hoscode:string){
    return request.get<any,ISched>(`/admin/hosp/department/${hoscode}`)
}
export function reqGetScheduleRules(page:number,limit:number,hoscode:string,depcode:string){
    return request.get<any,IScheduleRule>(`/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`)
}
// 获取表格数据
export function reqGetScheduleList(depcode:string,workDate:string,hoscode:string){
    return request.get<any,ItableList>(`/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`)
}
