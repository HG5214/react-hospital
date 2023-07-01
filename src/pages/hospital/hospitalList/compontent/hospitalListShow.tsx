import React,{useEffect,useState} from 'react'
import { Button, Card, Descriptions } from 'antd';
import { useNavigate,useParams } from 'react-router-dom'
import {reqGetHospitalShowList} from '@api/hospitalList'
import {IhospitalShowRes} from '@api/hospitalList/model/hospitalListTypes'
export default function OrderListShow() {
  const navigate=useNavigate()
  const {id}=useParams()
  const [datail,setDatail]=useState<IhospitalShowRes>({})
 const hospListShow= async(id:string)=>{
  const result=await reqGetHospitalShowList(id)
  setDatail(result)
 }
  useEffect(()=>{
    hospListShow(id as string)
  },[])
  return (
    <Card>
  <Descriptions title="基本信息" bordered column={4}>
    {/* labelStyle修改的是label那一格的格式 */}
    {/* column控制把一行分成几份 */}
    <Descriptions.Item label="医院名称" labelStyle={{height:100,width:50}}  span={1}>{datail.hospital?.hosname}</Descriptions.Item>
    <Descriptions.Item label="医院logo"  span={3}><img src={'data:image/png;base64,'+datail.hospital?.logoData} width={120}></img></Descriptions.Item>
    <Descriptions.Item label="医院编码" labelStyle={{height:100,width:50}} span={1}>{datail.hospital?.hoscode}</Descriptions.Item>
    <Descriptions.Item label="医院地址" span={3}>{datail.hospital?.param.fullAddress}</Descriptions.Item>
    <Descriptions.Item label="坐车路线" labelStyle={{height:100,width:50}} span={4}>{datail.hospital?.route}</Descriptions.Item>
    <Descriptions.Item label="医院简介" labelStyle={{height:250,width:50}} span={4}>{datail.hospital?.intro}</Descriptions.Item>
  </Descriptions>
  <Descriptions title='预约规则信息' style={{marginTop:30}} column={4} bordered>
  <Descriptions.Item label='预约周期' span={2}>{datail.bookingRule?.cycle}天</Descriptions.Item>
  <Descriptions.Item label='放号时间' span={2}>{datail.bookingRule?.releaseTime}</Descriptions.Item>
  <Descriptions.Item label='挂停时间' span={2}>{datail.bookingRule?.stopTime}</Descriptions.Item>
  <Descriptions.Item label='退号时间' span={2}>{datail.bookingRule?.quitTime}</Descriptions.Item>
  <Descriptions.Item label='退号时间' span={4}>{datail.bookingRule?.rule.map((item,index)=>{
    return <div key={index}>{`${index+1}.${item}`}</div>
  })}</Descriptions.Item>
  </Descriptions>
  <Button className='gay' onClick={()=>{
    navigate(-1)
  }}>返回</Button>
    </Card>
  )
}
