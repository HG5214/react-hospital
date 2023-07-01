import {Table,Card} from 'antd';
import React,{useEffect,useState} from 'react';
import {findByParentId} from '@api/information/index'
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import Loading from '@/components/Loading';
export default function Information() {
    const [dictList,setDictList]=useState<any[]>([])
    const columns = [
        { title: "名称", dataIndex: "name", key: "name" },
        { title: "编码", dataIndex: "dictCode", key: "dictCode" },
        { title: "值", dataIndex: "value", key: "value" },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
        },
    ];
      const findByparentIdDate= async(id:number)=>{
        const data=await findByParentId(id)
        const dictlist=data.map((item)=>{
            return{
                ...item,
                // 设置这个children是为了在请求二级数据时候加进去，显示数据的
                children:[],
            }
        })  
        setDictList(dictlist)
      }
      const rightHandel=(onExpand:any, record:any)=> async(e:any)=>{
       const data:any= await findByParentId(record.id)
            record.children=data.map((item:any)=>{
                return{
                    ...item,
                }
            })
            if(!data.length)return
            // record是数据对象，e是事件对象，只有传入了点击的对象，和数据对象，onExpand才能展开数据
        onExpand(record, e);
      }
useEffect(()=>{
    findByparentIdDate(1)
},[])
  return (
    <Card>
        <Table rowKey={'id'} columns={columns} expandable={{
            	expandIcon: ({ expanded, onExpand, record }) => {
                    //expaned是图标是否展开(boolean值)，onExpand：点击展开图标时触发的函数，record是数据
                    
                    // if (!record.hasChildren) {
                    //     return <span className="dict-box"></span>;
                    // }
                    return expanded ? (
                        <DownOutlined
                            className="dict-icon"
                            onClick={(e) => onExpand(record, e)}
                        />
                    ) : (
                        <RightOutlined
                            className="dict-icon"
                            onClick={rightHandel(onExpand,record)}
                        />
                    );
                }
        }} dataSource={dictList} pagination={false} bordered/>
    </Card>
  )
}
