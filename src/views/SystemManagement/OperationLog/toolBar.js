import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon, Input, DatePicker, Select } from 'antd';

import styles from './toolBar.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@observer
export default class OperationLogToolBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
    }
  }

  handleSearch = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const { form, operationLog } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        // 格式化查询参数
        Object.keys(values).forEach(key => {
          if(values[key]) {
            if(key === 'LM_OperateStartTime' || key === 'LM_OperateEndTime') {
              values[key] = values[key].format('YYYY-MM-DD');
            }
          }
        });

        // 修改 store 数据
        operationLog.setData({
          searchFormValues: values,
          pagination: {
            ...operationLog.pagination,
            current: 1, //刷新时重置页码
          },
        });

        // 排序数据
        let orderData = {};
        if(operationLog.orderField) {
          orderData = {
            OrderField: operationLog.orderField,
            IsDesc: operationLog.isDesc,
          }
        }

        // 发起请求
        operationLog.fetchList({
          CurrentPage: 1,
          PageSize: operationLog.pagination.pageSize,
          ...orderData,
          ...values,
        });
      }
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, operationLog } = this.props;
    
    form.resetFields();

    operationLog.setData({
      searchFormValues: {},
    });
  }

  // 展开、关闭
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  

  render() {
    const { getFieldDecorator } = this.props.form;
    const { operationLog, handleRemoveChecked } = this.props;
    const { expandForm } = this.state;

    return (
      <div className={styles.toolBar}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <FormItem label="操作者">
            {getFieldDecorator('LM_OperateUser')(
              <Input placeholder="请输入操作者" />
            )}
          </FormItem>
          {
            expandForm && 
            <span>
              <FormItem label="操作时间">
                {getFieldDecorator('LM_OperateStartTime')(
                  <DatePicker placeholder="操作起始时间" />
                )}
              </FormItem>
              <FormItem colon={false}>
                {getFieldDecorator('LM_OperateEndTime')(
                  <DatePicker placeholder="操作结束时间" />
                )}
              </FormItem>
              <FormItem label="操作类型">
                {getFieldDecorator('LM_OperateType')(
                  <Select placeholder="请选择操作类型" allowClear>
                  {
                    operationLog.operateTypeTextValue.map(item => (
                      <Option value={parseInt(item.value, 10)} key={item.value}>{item.text}</Option>
                    ))
                  }
                </Select>,
                )}
              </FormItem>
            </span>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 12 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 12 }} onClick={this.toggleForm}>
              { expandForm ? <span>收起 <Icon type="up" /></span> : <span>展开 <Icon type="down" /></span> }
            </a>
          </div>
          <div className={styles.buttonGroups}>
            <Button.Group>
              <Button
                icon="delete"
                onClick={handleRemoveChecked}
              >
                删除
              </Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}