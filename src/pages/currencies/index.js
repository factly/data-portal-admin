import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, Button, Popconfirm, Form, notification } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import Loading from '../../components/loading';
import { loadCurrencies, updateCurrency, deleteCurrency } from '../../actions/currencies';

const EditableCell = ({ editing, dataIndex, title, record, index, children, ...restProps }) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please enter ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Currencies = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const { loading, data, load, update, remove } = props;
  const total = data.length;

  React.useEffect(() => {
    load();
  }, [load]);

  const get = (page, limit) => {
    cancel();
    load(page, limit);
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const index = data.findIndex((item) => item.id === key);

      if (index > -1) {
        update(key, row, index)
          .then(() => {
            setEditingKey('');
            notification.success({
              message: 'Success',
              description: 'Currency succesfully updated',
            });
          })
          .catch(() => {
            notification.error({
              message: 'Error',
              description: 'Something went wrong',
            });
          });
      }
    } catch (err) {
      notification.warning({
        message: 'Warning',
        description: 'Validation failed',
      });
    }
  };

  const deleteCurrency = (key) => {
    const index = data.findIndex((item) => item.id === key);
    if (index > -1) {
      remove(key, index)
        .then(() => {
          notification.success({
            message: 'Success',
            description: 'Currency succesfully deleted',
          });
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
          });
        });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'ISO code',
      dataIndex: 'iso_code',
      width: '25%',
      editable: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      width: '25%',
      render: (_, record) => {
        return <span title={record.created_at}>{moment(record.created_at).fromNow()}</span>;
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button icon={<CloseOutlined />}>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              type="primary"
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
                marginRight: 8,
              }}
            >
              Edit
            </Button>
            <Popconfirm
              disabled={editingKey !== ''}
              title="Sure to delete?"
              onConfirm={() => deleteCurrency(record.id)}
            >
              <Button disabled={editingKey !== ''} icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Link to={'/currencies/create'}>
        <Button type="primary" style={{ marginBottom: 16 }}>
          Add Currency
        </Button>
      </Link>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey="id"
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            defaultPageSize: 5,
            onChange: get,
            total: total,
          }}
        />
      </Form>
    </div>
  );
};

Currencies.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  load: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { list } = state.currencies;
  return {
    loading: list.loading,
    data: list.items,
  };
};

const mapDispatchToProps = (dispatch) => ({
  load: (page, limit) => dispatch(loadCurrencies(page, limit)),
  update: (id, data, index) => dispatch(updateCurrency(id, data, index)),
  remove: (id, index) => dispatch(deleteCurrency(id, index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Currencies);
