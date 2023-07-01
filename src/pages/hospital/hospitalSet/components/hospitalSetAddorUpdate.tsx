import React,{useEffect} from 'react'
import { Button, Form, Input,Card,Space} from 'antd';
import{postReqHospitalSetAdd,getReqOneHospitalSet,getReqUpdateHospitalSet} from '../../../../api/hospitalSet/index'
import { useNavigate,useParams } from 'react-router-dom';
export default function HospitalSetAdd() {
    const navigate=useNavigate()
    const {id}=useParams()
    const [form]=Form.useForm()
    const onFinish = async(values: any) => {
      if(id){
        values.id=id
        await getReqUpdateHospitalSet(values)
      }else{
        await postReqHospitalSetAdd(values)
      }
      navigate(-1)
      };
      useEffect(()=>{
        if(!id)return
       ;(async()=>{
       const result=await getReqOneHospitalSet(id)
        form.setFieldsValue(result)
       })()
      })
    //   const onFinishFailed = (errorInfo: any) => {
    //     console.log('Failed:', errorInfo);
    //   };
  return (
    <Card>
    <Form
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 22 }}
        //  initialValues设置默认值,通过表单的name属性控制
    //   initialValues={{ remember: true }}
      onFinish={onFinish}
    // 表单校验不通过时候触发
    //onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="医院名称"
        name="hosname"
        rules={[{ required: true, message: '请输入医院名称!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="医院编码"
        name="hoscode"
        rules={[{ required: true, message: '请输入医院编码!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="api基础路径"
        name="apiUrl"
        rules={[{ required: true, message: '请输入api基础路径!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="联系人名称"
        name="contactsName"
        rules={[{ required: true, message: '请输入联系人名称!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="联系人手机"
        name="contactsPhone"
        rules={[{ required: true, message: '请输入联系人手机号!'},
        { pattern: /^1[3-9]\d{9}$/, message: '必须是正确的手机号格式' }
    ]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset:2 }}>
       <Space>
       <Button type="primary" htmlType="submit">
          保存
        </Button>
        <Button onClick={()=>{
            navigate(-1)
        }}>返回</Button>
       </Space>
      </Form.Item>
    </Form>
    </Card>
  )
}