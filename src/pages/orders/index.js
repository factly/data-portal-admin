import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Form, Button } from 'antd';
import moment from 'moment';

import { loadOrders } from '../../actions/orders';

const Orders = (props) => {
  const [form] = Form.useForm();
  const { data, currencies, payments, total, load } = props;
  const [pagination, setPagination] = useState({
    current: 1,
    defaultPageSize: 5,
    pageSize: 5,
    total,
  });

  React.useEffect(() => {
    handleTableChange(pagination);
  }, [total]);

  const handleTableChange = ({ current, pageSize }) => {
    load(current, pageSize);
    setPagination({ ...pagination, current, pageSize, total });
  };

  const columns = [
    {
      title: 'Cart',
      dataIndex: 'cart_id',
      width: '20%',
    },
    {
      title: 'Amount',
      render: (record) => {
        const payment = payments[record.payment_id];
        const currency = currencies[payment.currency_id];
        return <span>{`${payment.amount} ${currency.iso_code}`}</span>;
      },
      width: '20%',
    },
    {
      title: 'User',
      dataIndex: 'user_id',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '20%',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      width: '20%',
      render: (_, record) => {
        return <span title={record.created_at}>{moment(record.created_at).fromNow()}</span>;
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
            <Button
              type="primary"
              onClick={() => props.history.push(`/orders/${record.id}`)}
              style={{
                marginRight: 8,
              }}
            >
              Details
            </Button>
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          bordered
          rowKey="id"
          onChange={handleTableChange}
          dataSource={data}
          columns={columns}
          pagination={pagination}
        />
      </Form>
    </div>
  );
};

Orders.propTypes = {
  data: PropTypes.array.isRequired,
  payments: PropTypes.object.isRequired,
  currencies: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  load: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { list } = state.orders;
  const { ids } = list;

  return {
    data: ids.map((id) => list.items[id]),
    payments: state.payments.items,
    currencies: state.currencies.items,
    total: list.total,
  };
};

const mapDispatchToProps = (dispatch) => ({
  load: (page, limit) => dispatch(loadOrders(page, limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
