import React from 'react';
import { Form, Input, InputNumber, Button, Select, notification } from 'antd';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const DatasetForm = ({ onSubmit, setDatasetId, data, next }) => {
  const formFields = [
    { label: 'Title', name: 'title', placeholder: 'Dataset title', required: true },
    {
      label: 'Contact Email',
      name: 'contact_email',
      placeholder: 'shashi@factly.in',
      required: true,
    },
    { label: 'Contact Name', name: 'contact_name', placeholder: 'Shashi', required: true },
    { label: 'Description', name: 'description', placeholder: 'description' },
    { label: 'Data Standard', name: 'data_standard', placeholder: 'standard' },
    { label: 'Frequency', name: 'frequency', placeholder: '1 month', required: true },
    { label: 'Granularity', name: 'granularity', placeholder: 'granularity' },
    { label: 'License', name: 'license', placeholder: 'MIT License' },
    {
      label: 'Related Articles',
      name: 'related_articles',
      placeholder: 'link://to.related.articles',
    },
    { label: 'Source', name: 'source', placeholder: 'link://to.source.com' },
    { label: 'Temporal Coverage', name: 'temporal_coverage', placeholder: 'temporal_coverage' },
    { label: 'Time Saved', type: 'number', name: 'time_saved', placeholder: '12' },
  ];

  const onFinish = (values) => {
    values.frequency = `${values.frequency.count} ${values.frequency.units}`;

    onSubmit(values)
      .then((data) => {
        setDatasetId(data.id);
        notification.success({
          message: 'Success',
          description: 'Dataset succesfully added',
        });
        next();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: 'Error',
          description: 'Something went wrong',
        });
      });
  };

  return (
    <Form
      name="datasets_create_step_one"
      initialValues={data}
      {...formItemLayout}
      onFinish={onFinish}
    >
      {formFields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={
            field.required && [
              {
                required: true,
                message: `Please enter ${field.label}!`,
              },
            ]
          }
        >
          {field.type === 'number' ? (
            <InputNumber placeholder={field.placeholder} />
          ) : field.name === 'frequency' ? (
            <Input.Group compact>
              <Form.Item
                name={['frequency', 'count']}
                noStyle
                rules={[{ required: true, message: 'Frequency count is required' }]}
              >
                <InputNumber min={1} style={{ width: '15%' }} placeholder="12" />
              </Form.Item>
              <Form.Item
                name={['frequency', 'units']}
                noStyle
                rules={[{ required: true, message: 'Frequency unit is required' }]}
              >
                <Select placeholder="Select Unit">
                  <Option value="days">Days</Option>
                  <Option value="months">Months</Option>
                  <Option value="years">Years</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          ) : (
            <Input placeholder={field.placeholder} />
          )}
        </Form.Item>
      ))}
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DatasetForm;