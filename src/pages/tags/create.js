import React from 'react';
import { Form, Input, Button } from 'antd';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const TagCreate = (props) => {
  const onFinish = (values) => {
    fetch(process.env.REACT_APP_API_URL + '/tags', {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((_) => {
        props.history.push(`${process.env.PUBLIC_URL}/tags`);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please enter name!',
          },
        ]}
      >
        <Input placeholder="Ex. Crime In India" />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        rules={[
          {
            required: true,
            message: 'Please enter slug!',
          },
        ]}
      >
        <Input placeholder="Ex. crime-in-india" />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TagCreate;
