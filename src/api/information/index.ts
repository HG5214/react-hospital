import { request } from "@utils/http";
export function findByParentId(parentId:number){
    return request.get<any,any[]>(`/admin/cmn/dict/findByParentId/${parentId}`)
}