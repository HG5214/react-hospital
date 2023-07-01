import React,{useEffect,useState,Key} from 'react'
import { Button, Form, Input,Card,Space,Table,Modal, message} from 'antd';
import { SearchOutlined,EditOutlined,DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import {IhospitalList,IhosoitalItem} from '../../../api/hospitalSet/model/hospitalSetTypes'
import {getReqHospitalSet,getReqDeleteHospitalSet,getReqBatchHospitalSet} from '../../../api/hospitalSet'
let flag=false
export default function HospitalSet() {
  // 发送请求从服务器获取到的数据
  const [list,setList]=useState<IhospitalList>([])
  // 当前服务器总的数据条数
  const [total,setTotal]=useState(0)
  // 动态获取每页条数
  const [pageSize,setpageSize]=useState(2)
  // 动态获取批量删除的id列表
  const [ids,setIds]=useState<Key[]>([])
  const [loading,setLoading]=useState(false)
  // form相当于formdata，与Form表单的form属性绑定，获取表单的数据
  const [form]=Form.useForm()
  // 动态获取第几页
  const [page,setPage]=useState(1)
  const navigate=useNavigate()
  useEffect(()=>{
    // 组件挂载的时候请求数据
   fetch(1,pageSize)
  },[])
  // 数据查询
  async function fetch(page:number,pageSize:number){
    setLoading(true)
    const {hosname,hoscode}=form.getFieldsValue()
    let result
    if(flag){
      result=await getReqHospitalSet(page,pageSize,hosname,hoscode)
    }else{
      result=await getReqHospitalSet(page,pageSize)
    }
    setList(result.records)
    setTotal(result.total)
    setLoading(false)
   }
 const onFinish=()=>{
  flag = true
  setPage(1)
  fetch(1, pageSize)
 }
//  清空查询
 const clearList=()=>{
  form.setFieldsValue({hosname:undefined,hoscode:undefined})
  fetch(1,pageSize)
  flag=false
  setPage(1)
 }
//  删除表格的一条数据
 const delHospital=(id:string)=>{
  return ()=>{
    getReqDeleteHospitalSet(id)
    fetch(page,pageSize)
  }
 }
 const columns: ColumnsType<IhosoitalItem> = [
  {
    title: '序号',
    render:(_,loacd,index)=>(<a>{index+1}</a>),
    width:100,
    align:'center'
  },
  
  {
    title: '医院名称',
    // key: 'age',
     dataIndex: 'hosname',
  },
  {
    title: '医院编号',
    dataIndex: 'hoscode',
  },
  {
    title: 'api基础路径',
    // key: 'tags',
    dataIndex: 'apiUrl',
  },
  {
    title: '签名',
    dataIndex:'signKey'
  },
  {
    title: '联系人姓名',
    dataIndex:'contactsName'
  },
  {
    title: '联系人手机',
    dataIndex:'contactsPhone',
  },
  {
    title: '操作',
    render:(_)=>{
      return(<Space size={'small'}>
        <Button type='primary' icon={<EditOutlined />} onClick={()=>{
          navigate(`/syt/hospital/hospitalSet/edit/${_.id}`)
        }}></Button>
        <Button type='primary' icon={<DeleteOutlined />} danger onClick={delHospital(_.id)}></Button>
      </Space>)
    },
    fixed:'right',
    width:120
  },
];
  return (
     <Card>
     <Form layout='inline' onFinish={onFinish} form={form} onValuesChange={()=>{
      flag=false
     }}>
        <Form.Item name='hosname'>
          <Input placeholder='医院名称'></Input>
        </Form.Item>
        <Form.Item name='hoscode'>
          <Input placeholder='医院编号'></Input>
        </Form.Item>
        <Form.Item>
       <Space size={'small'}> 
        <Button type="primary" icon={<SearchOutlined />} htmlType='submit' >查询</Button>
        <Button onClick={clearList}>清空</Button></Space>
        </Form.Item>
      </Form>
      <Space size={'small'} className='gay'> 
        <Button type="primary" onClick={()=>{
          navigate('/syt/hospital/hospitalSet/add')
        }}>添加</Button>
        <Button type="primary" danger disabled={!ids.length} onClick={()=>{
          Modal.confirm({
            title: '您确认要删除这些数据吗?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
              getReqBatchHospitalSet(ids)
              setIds([])//清空数组，让批量删除按钮禁用
              fetch(page,pageSize)
              message.success('数据删除成功')
            },
            // 取消的回调
            // onCancel() {
            //   console.log('Cancel');
            // },
          });
        }}>批量删除</Button></Space>
        <Table className='gay'
         loading={loading} 
         columns={columns} 
         dataSource={list} 
         scroll={{x:1500}}
          rowSelection={{
            onChange(selectedRowKeys, selectedRows){
              // selectedRowKeys:是选中的id列表,selectedRows:是选中的数据列表
              setIds(selectedRowKeys)
            }
          }} 
          bordered 
          pagination={{total,showSizeChanger:true,pageSize,showQuickJumper:true,pageSizeOptions:[2,5,10],showTotal:(total)=>{return `总共${total}条`},current:page,
          onChange:(page,pageSize)=>{setpageSize(pageSize)
            setPage(page)
            // page是页数,pageSize是每页条数，点击设置页数和每页条数的时候，设置一个状态，动态设置每页条数，更新条数，onChange触发时，发送请求，拿到最新数据，重新渲染页面
          fetch(page,pageSize)}}} 
        rowKey={'id'}/>
     </Card>
  )
}
