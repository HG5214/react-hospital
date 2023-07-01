import React,{useEffect,useState} from 'react'
import { Select,Card,Button, Form, Input,Space,Table, message} from 'antd';
import {reqGetHospitalList,hospitalFindData,hospitalFindCity,reqGetUpdateStatus} from '../../../api/hospitalList'
import { useNavigate } from 'react-router-dom';
import {IhospitalList,IhospitalListItem,IdictList,status} from '@api/hospitalList/model/hospitalListTypes'
import type { ColumnsType } from 'antd/es/table';
// 需要定义在全局不然，每次页面加载falg都是false
let falg=false
export default function HospitalList() {
  const navigate=useNavigate()
  const {Option}=Select
  const [page,setPage]=useState(1)
  const [pageSize,setpageSize]=useState(2)
  const [list,setList]=useState<IhospitalList>([])
  const [total,setTotal]=useState(0)
  const [form]=Form.useForm()
  const [loading,setLoading]=useState(false)
  const [province,setProvince]=useState<IdictList>([])
  const [city,setCity]=useState<IdictList>([])
  const [district, setdistrict]=useState<IdictList>([])
  const [hosType,setHostype]=useState<IdictList>([])
  // 省 市 区 医院类型 加载效果
  const [provinceLoading,setProvinceLoading]=useState(false)
  const [cityLoading,setCityLoading]=useState(false)
  const [districtLoading,setdiscrictLoading]=useState(false)
  const [hosTypeLoading,setHostypeLoading]=useState(false)
  const onFinish = async(values: any) => {
    falg=true
    setPage(1)
    fetch(1,pageSize)
  };
  const fetch= async(page:number,limit:number)=>{
    setLoading(true)
    const value=form.getFieldsValue()
    let result
    if(falg){
      result=await reqGetHospitalList({...value,page,limit})
    }else{
      result=await reqGetHospitalList({page,limit})
    }
    setList(result.content)
    setTotal(result.totalElements)
    setLoading(false)
  }
  const getProvince=async()=>{
    setProvinceLoading(true)
    const result=await hospitalFindData()
    setProvince(result)
    setProvinceLoading(false)
  }
  const getCityList=async(value:string)=>{
    setCityLoading(true)
    const result=await hospitalFindCity(value)
   setCity(result)
   setCityLoading(false)
  }
  // 清空查询框数据
  const claerSelect=()=>{
    falg=false
    fetch(page,pageSize)
    // form.setFieldsValue({hoscode:undefined,hosname:undefined,hosType:undefined,provinceCode:undefined,cityCode:undefined,districtCode:undefined,status:undefined})
    // 表单是空的可以用重置表单
    form.resetFields()
  }
  const districtList=async(value:string)=>{
    setdiscrictLoading(true)
    const result=await hospitalFindCity(value)
    setdistrict(result)
    setdiscrictLoading(false)
  }
  const hosTypeList=async()=>{
    setHostypeLoading(true)
    const result=await hospitalFindCity()
    setHostype(result)
    setHostypeLoading(false)
  }
  const updatStatus= async(id:string,status:status)=>{
    await reqGetUpdateStatus(id,status)
    fetch(page,pageSize)
  }
  useEffect(()=>{
    // 在组件挂载的时候执行，加上[]
  fetch(page,pageSize)
  getProvince()
  hosTypeList()
  },[])
  const columns: ColumnsType<IhospitalListItem> = [
    {
      title: '序号',
      render: (_,record,index)=>{
        return index+1
      },
      width:80,
      align:'center'
    },
    {
      title: '医院logo',
      render:(_)=>{
        return <img src={'data:image/png;base64,'+_.logoData} alt="" width={120}/>
      }
    },
    {
      title: '医院名称',
      dataIndex: 'hosname',
    },
    {
      title: '等级',
      dataIndex: 'param',
      render:(param)=>{
        return param.hostypeString
      }
    },
    {
      title: '详细地址',
      dataIndex: 'param',
      render:(param)=>{
        return param.fullAddress
      }
      },
    {
      title: '状态',
      dataIndex:'status',
      render:(status)=>{
        return status?'已上线':'已下线'
      }
      },
    {
      title: '创建时间',
      dataIndex:'createTime'
      },
    {
      title: '操作',
     render:(_)=>{
      return <Space>
        <Button type='primary' onClick={()=>{
          navigate(`/syt/hospital/orderListShow/${_.id}`)
        }}>查看</Button>
        <Button type='primary' onClick={()=>{
          navigate(`/syt/hospital/hospitalSchedule/${_.hoscode}`)
        }}>排班</Button>
        <Button type='primary' onClick={()=>{
          updatStatus(_.id,_.status?0:1)
        }}>{_.status?'已下线':'已上线'}</Button>
      </Space>
     },
     width:120
      },
  ];
  return (
    <Card>
      <Form
      onValuesChange={()=>{
        falg=false
      }}
      form={form}
      layout='inline'
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item name='provinceCode'>
        <Select loading={provinceLoading} style={{width:200,marginBottom:20}} placeholder='请选择省' onChange={(value)=>{
         getCityList(value)
        // 在选择省的时候清空市跟区
         form.setFieldsValue({cityCode:undefined,districtCode:undefined})
        }}>
        {province.map((item)=>{
         return <Option value={item.value} key={item.id}>{item.name}</Option>
        })}
        </Select>
      </Form.Item>
      <Form.Item name='cityCode'>
        <Select loading={cityLoading} style={{width:200}} placeholder='请选择市' onChange={(value)=>{
          // 在选择市的时候清空区
          form.setFieldsValue({districtCode:undefined})
          districtList(value)
        }}>
        {city.map((item)=>{
         return <Option value={item.value} key={item.id}>{item.name}</Option>
        })}
        </Select>
      </Form.Item>
      <Form.Item name='districtCode'>
        <Select loading={districtLoading} style={{width:200}} placeholder='请选择区'>
        {district.map((item)=>{
         return <Option value={item.value} key={item.id}>{item.name}</Option>
        })}
        </Select>
      </Form.Item>
      <Form.Item
        name="hosname"
      >
        <Input placeholder='医院名称'/>
      </Form.Item>

      <Form.Item
        name="hoscode"
      >
        <Input placeholder='医院编号'/>
      </Form.Item>
      <Form.Item
        name="hostype"
      >
      <Select loading={hosTypeLoading} style={{width:200}} placeholder='医院类型'>
      {hosType.map((item)=>{
         return <Option value={item.value} key={item.id}>{item.name}</Option>
        })}
        </Select>
      </Form.Item>
      <Form.Item
        name="status"
      >
       <Select style={{width:200}} placeholder='医院状态'>
        <Option value="0">已下线</Option>
        <Option value="1">已上线</Option>
        </Select>
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit">
         查询
        </Button>
      </Form.Item>
     <Form.Item>
     <Button onClick={()=>{
      claerSelect()
     }}>清空</Button>
     </Form.Item>
    </Form>
    <Table rowKey={'id'} loading={loading} columns={columns} rowSelection={{}} dataSource={list}  className='gay' bordered pagination={{
      pageSize,
      total,
      current:page,
      pageSizeOptions:[2,5,10],
      showQuickJumper:true,
      showSizeChanger:true,
      showTotal:(total)=>{
        return (`共${total}条`)
      },
      onChange:(page,pageSize)=>{
        setPage(page)
        setpageSize(pageSize)
        fetch(page,pageSize)
      }
    }}/>;
    </Card>
  )
}
