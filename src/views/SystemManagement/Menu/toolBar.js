import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';

import styles from './toolBar.less';

@observer
export default class MenuToolBar extends Component {

  render() {

    const { menu, handleNew, handleEdit, handleRemoveChecked } = this.props;

    return (
      <div className={styles.toolBar}>
        <div className={styles.buttonGroups}>
          <Button.Group>
            <Button
              icon="plus"
              onClick={handleNew}
              loading={menu.newBtnLoading}
            >
              新建
            </Button>
            <Button
              icon="edit"
              onClick={handleEdit}
            >
              编辑
            </Button>
            <Button
              icon="delete"
              onClick={handleRemoveChecked}
            >
              删除
            </Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}