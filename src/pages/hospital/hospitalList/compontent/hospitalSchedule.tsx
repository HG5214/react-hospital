import React, { useEffect, useState} from 'react'
import { Card,Row,Col,Tree,Tag,Pagination,Table, Button,message} from 'antd'
import type {TreeProps } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';
import {reqTreeList,reqGetScheduleRules,reqGetScheduleList} from '@api/hospitalList'
import { useParams,useNavigate} from 'react-router-dom';
import {ISched,Ibooking,ItableScheduled,ItableList} from '@api/hospitalList/model/hospitalListTypes'
export default function HospitalSchedule() {
    const navigate=useNavigate()
      const onSelect: TreeProps['onSelect'] = (selectedKeys, info:any) => {
        // 更新状态是为了面包屑拿到最新数据，以及我们在请求排班规则的时候需要用到depcode
        setDepname(info.node.depname)
        const depcode=selectedKeys[0] as string
        getScheduleRules(page,pageSize,depcode)
        setPage(1)
        setDepCode(depcode)
      };
      const columns:ColumnsType<ItableScheduled>=[
        {
            title:'序号',
            render:(_,record,index)=>(index+1)
        },
        {
            title:'职称',
           dataIndex:'title'
        },
        {
            title:'号源时间',
           dataIndex:'workDate'
        },
        {
            title:'可预约数',
           dataIndex:'availableNumber'
        },
        {
            title:'剩余预约数',
           dataIndex:'reservedNumber'
        },
        {
            title:'挂号费(元)',
           dataIndex:'amount'
        },
        {
            title:'擅长技能',
           dataIndex:'skill'
        },
      ]
    const {hoscode}=useParams()
     // 存储所有一级科室的depcode
  const [depCodes, setDepCodes] = useState<string[]>([])
    // 选中的科室的depcode，默认是第一个,二级科室
    const [depcode, setDepCode] = useState('')
    const [page,setPage]=useState(1)
    const [pageSize,setpageSize]=useState(5)
    const [total,setTotal]=useState(0)
    const [bookingScheduleList,setBookingScheduleList]=useState<Ibooking>()
    const [hosname,setHosname]=useState('')
    const [depname,setDepname]=useState('')
    const [workDate,setWorkDate]=useState('')
    // 存储的科室信息
    const [depList,setdepList]=useState<ISched>()
    const [datial,setdatial]=useState<ItableList>([])
    //获取当前医院所有科室的数据
    const getSchedule=async(hoscode:string)=>{
        const result=await reqTreeList(hoscode)
        setdepList(result)
        // 
        let depname=result[0].children[0].depname
        setDepname(depname)
        // 遍历result，往每一个一级科室添加一个disabled:true,禁用一级科室
        result.forEach((item) => {
            item.disabled = true
          })
        //  默认选中的二级科室
          let depcode = result[0].children[0].depcode
          setDepCode(depcode)
          //获取当前科室排版规则的函数，在科室被选择后获取排班规则
          getScheduleRules(page,pageSize,depcode)
        //拿到所有的一级科室
          const codes = result.map((item) => item.depcode)
          setDepCodes(codes)
    }
    // 排班规则详情列表
    const tableListSchedule= async(depcode:string,workDate:string)=>{
        const result=await reqGetScheduleList(depcode,workDate,hoscode as string)
        setdatial(result)
        
    }
    
    // 获取排班规则
    const getScheduleRules=async(page:number,pageSize:number,depcode:string)=>{
        const result=await reqGetScheduleRules(page,pageSize,hoscode as string,depcode)
        // 性能优化，当没有排班数据，清空状态中的排班规则详细表格数据，清空排班规则总数，清空排班数据，清空排班规则日期，提示用户当前科室暂无数据，，并返回不在往下执行。
        if (!result.bookingScheduleList.length) {
          // 提示用户
          message.error('当前科室暂无数据')
          // 清空表格的数据
          setdatial([])
          // 清空排班数据
          setBookingScheduleList([])
          // 清空总数
          setTotal(0)
          setWorkDate('')
          return
        }
        setTotal(result.total)
        setBookingScheduleList(result.bookingScheduleList)
        setHosname(result.baseMap.hosname)
        // 在bookkingScheduleList后面加上可选链是因为，有些科室没有排班规则，当没有排班规则数据时候，为undefined,这样就不会继续往下了，解决报错
        let workDate=result.bookingScheduleList[0]?.workDate
        setWorkDate(workDate)
        // 在获取到工作日期之后我们发送获取排班规则详情列表的请求
        tableListSchedule(depcode,workDate)
    }
    const tagHandel=(workDate:string)=>{
        return ()=>{
            // 获取最新的排班日期，通过改变面包屑的排版日期，我们就能动态的修改展示的高亮
            setWorkDate(workDate)
            tableListSchedule(depcode,workDate)
        }
    }
      useEffect(()=>{
        getSchedule(hoscode as string)
      },[])
  return (
    <Card>
       <p>选择：{hosname} / {depname} / {workDate}</p>
       <Row gutter={30}>
       <Col span={5} style={{border:'1px solid #ccc',overflow:'scroll',height:500}}>
       <Tree
      onSelect={onSelect}
        //点击子节点触发的
      selectedKeys={[depcode]}
        // 点击复选框触发的，父级
        // default开头的属性只在第一次赋值有效
      expandedKeys={depCodes}
      // 告诉Tree title和key用是什么值
      fieldNames={{title:'depname',key:'depcode'}}
      treeData={depList as any}
    />
       </Col>
       <Col span={19} style={{}}>
        {bookingScheduleList?.map((item)=>( <Tag color={workDate===item.workDate?'green':''} key={item.workDate} onClick={tagHandel(item.workDate)}><div>{item.workDate}/{item.dayOfWeek}</div><div>{item.availableNumber}/ {item.reservedNumber}</div></Tag>))}
        <Pagination className='gay'  current={page} total={total} pageSize={pageSize} showQuickJumper={true} pageSizeOptions={[2,5,10]} onChange={(page,pageSize)=>{
            setPage(page)
            setpageSize(pageSize)
            // 重新获取排班规则
            getScheduleRules(page,pageSize,depcode)

        }}></Pagination>
        <Table rowKey={'id'} pagination={false} columns={columns} dataSource={datial}  className='gay' bordered/>
        <Button className='gay' onClick={()=>{
            navigate(-1)
        }}>返回</Button>
       </Col>
       </Row>
    </Card>
  )
}
{/* <Tree
    //  控制复选框是否展示
    //   checkable
        //默认展开所有的数节点/子节点
    //   defaultExpandedKeys={['0-0-0', '0-0-1']}
        // 默认选中的树节点/内容节点，子节点
    //   defaultSelectedKeys={['0-0-0', '0-0-1']}
    // 默认选中复选框的树节点
    //   defaultCheckedKeys={['0-0-0', '0-0-1']}
      onSelect={onSelect}
      //点击复选框时触发
    //   onCheck={onCheck}
      treeData={treeData}
    /> */}

