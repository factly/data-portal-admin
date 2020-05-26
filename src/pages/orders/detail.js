import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Form, Descriptions, Card } from 'antd';

const OrderDetail = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState();
  const [total, setTotal] = useState(0);
  const { id } = useParams();

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/${id}/items`)
      .then((data) => data.json())
      .then((data) => {
        setData(data.nodes);
        setTotal(data.total);
        if (data.total) {
          setOrder(data.nodes[0].Order)
        }
      });
  }, [id]);

  const get = (page, limit) => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/${id}/items?page=${page}&limit=${limit}`)
      .then((data) => data.json())
      .then((data) => {
        setData(data.nodes);
        setTotal(data.total);
      });
  };

  const columns = [
    {
      title: 'Product Item',
      render: (record) => record.Product.title,
      width: '40%',
    },
    {
      title: 'Price',
      render: (record) => (
        <span>
          {record.Product.price} {record.Product.Currency.iso_code}
        </span>
      ),
      width: '20%',
    },
    {
      title: 'Extra Info',
      dataIndex: 'extra_info',
      width: '30%',
    },
  ];

  return (
    <div>
      {!order ? (null) : (
        <Card>
          <Descriptions title="Order details">
            <Descriptions.Item label="Order ID">{order.ID}</Descriptions.Item>
            <Descriptions.Item label="Order Status">{order.status}</Descriptions.Item>
            <Descriptions.Item label="Payment">
              {order.Payment.amount} {order.Payment.Currency.iso_code}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Gateway">{order.Payment.gateway}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">{order.Payment.status}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Form form={form} component={false}>
        <Table
          bordered
          rowKey="ID"
          dataSource={data}
          columns={columns}
          pagination={{
            onChange: get,
            total: total,
          }}
        />
      </Form>
    </div>
  );
};

export default OrderDetail;