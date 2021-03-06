import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Checkbox, Button, Alert } from 'antd';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import logo from '@/assets/logo.svg';

const FormItem = Form.Item;

@inject('currentUser')
@Form.create()
@observer
export default class Login extends Component {

  componentDidMount = () => {
    const { form } = this.props;
    const loginName = localStorage.getItem('loginName');
    const loginPwd = localStorage.getItem('loginPwd');
    const remember = localStorage.getItem('remember');

    if(remember===true || remember==='true') {
      form.setFieldsValue({
        LoginName: loginName,
        LoginPwd: loginPwd,
        remember: true,
      });
    } else {
      form.setFieldsValue({
        remember: false,
      });
    }
  }

  handleSubmit = (e) => {
    const { form, currentUser } = this.props;
    e.preventDefault();
    form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          console.log(values);
          currentUser.login(values);
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {

    const { form, currentUser } = this.props;

    const { getFieldDecorator } = form;

    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
          </div>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              {
                currentUser.error &&
                currentUser.submitting === false &&
                this.renderMessage(currentUser.error.Message)
              }
              <FormItem>
                {getFieldDecorator('LoginName', {
                  rules: [{
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="请输入用户名"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('LoginPwd', {
                  rules: [{
                    required: true, message: '请输入密码',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
              <FormItem className={styles.additional}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox className={styles.autoLogin}>记住密码</Checkbox>
                )}
                <Button size="large" loading={currentUser.submitting} className={styles.submit} type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}