import {request} from '@utils/http'
import { Key } from 'react'
import {IhospitalSetRes,hospitalAdd,IhosoitalItem} from './model/hospitalSetTypes'
// 获取分页数据
export function getReqHospitalSet(page:number,limit:number,hosname?:string,hoscode?:string){
    return request.get<any,IhospitalSetRes>(`/admin/hosp/hospitalSet/${page}/${limit}`,{
        params:{
            hosname,
            hoscode
        }
    })
}
// 添加表格数据
export function postReqHospitalSetAdd(data:hospitalAdd){
    // 第二个null是返回值类型，这里我们不在意返回值所以null
    return request.post<any,null>(`/admin/hosp/hospitalSet/save`,data)
}
// 请求修改表格数据
export function getReqOneHospitalSet(id:string){
    return request.get<any,IhosoitalItem>(`/admin/hosp/hospitalSet/get/${id}`)
}
// 返回修改表格数据
export function getReqUpdateHospitalSet(data:IhosoitalItem){
    // 第二个null是返回值类型，这里我们不在意返回值所以null
    return request.put<any,null>(`/admin/hosp/hospitalSet/update`,data)
}
// 删除表格的一条数据
export function getReqDeleteHospitalSet(id:string){
    // 第二个null是返回值类型，这里我们不在意返回值所以null
    return request.delete<any,null>(`/admin/hosp/hospitalSet/remove/${id}`)
}
// 删除表格的多条数据
export function getReqBatchHospitalSet(ids:Key[]){
    // 第二个null是返回值类型，这里我们不在意返回值所以null
    return request.delete<any,null>(`/admin/hosp/hospitalSet/batchRemove`,{
        data:ids
    })
}