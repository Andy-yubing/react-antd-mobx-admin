import axios from 'axios';
import { notification } from 'antd';
import md5 from 'md5';
import history from '../history';
import globalStore from '../stores/global';

const service = axios.create({
  timeout: 30000,
  cache: false,
});

// timestamp 时间戳
// token
// #AAA 常量
// axios.defaults.headers.common.Authorization =
// 'Basic timestamp=13123123123,token=tiket,sign=md5(timestamp+#AAA)';

//request 拦截器
service.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');

    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
      // 加密常量
      const secret = '#GMS';
      // 时间戳--当前毫秒数
      const timestamp = (new Date()).getTime().toString();
      // 加密后签名
      const sign = md5(timestamp + secret);

      config.headers.Authorization = `Basic timestamp=${timestamp},token=${token},sign=${sign}`;
      
      // 除登录等接口外，其他请求都需要带当前页面的 MenuID
      if(config.method === 'get') {
        if(!config.params) {
          config.params = {};
        }
        if(globalStore.selectedKeys.length > 0) {
          config.params.MenuID = globalStore.selectedKeys[0];
        }
      } else {
        if(!config.data) {
          config.data = {};
        }
        if(globalStore.selectedKeys.length > 0) {
          config.data.MenuID = globalStore.selectedKeys[0];
        }
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 304) {
      const { data } = response;

      if (data.Code === 200 && response.headers.authorization) {
        // 更新本地保存的 token
        sessionStorage.setItem('token', response.headers.authorization);
      }

      if (data.Code === 101) { // 数据校验失败
        // 展示 data.Error.ModelState 里面的校验数据
      } else if (data.Code === 100 || data.Code === 104) {
        // 清空 localstorage 的 user 信息和 token
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');

        // 跳转登录页
        history.push('/login');
      } else if (data.Code !== 200) {
        notification.error({
          message: `Code: ${data.Code}`,
          description: data.Error.Message,
        });
      }
      return data;
    } else {
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
      });
      return Promise.reject('error');
    }
  },
  error => {

    notification.error({
      message: `error`,
      description: error.message,
    });
    return Promise.reject(error);
  }
);

export default service;
