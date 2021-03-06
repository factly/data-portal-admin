import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Descriptions, List, Card, Popconfirm, Empty, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import '../../styles.css';
import { loadDatasets, deleteDataset } from '../../../actions/datasets';
const cardBody = {
  height: 220,
  overflow: 'auto',
};
const DatasetItem = ({ dataset }) => {
  return (
    <Descriptions layout="horizontal" column={1}>
      <Descriptions.Item label="Contact email">{dataset.contact_email}</Descriptions.Item>
      <Descriptions.Item label="Contact name">{dataset.contact_name}</Descriptions.Item>
      <Descriptions.Item label="License">{dataset.license}</Descriptions.Item>
      <Descriptions.Item label="Source">{dataset.source}</Descriptions.Item>
    </Descriptions>
  );
};

const DatasetsList = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });

  const history = useHistory();
  const dispatch = useDispatch();
  const { data, total } = useSelector(({ datasets }) => {
    const { ids, items, total } = datasets;
    return {
      data: ids.map((id) => items[id]),
      total,
    };
  });

  React.useEffect(() => {
    dispatch(loadDatasets(pagination));
  }, [pagination]);

  const remove = (key) => {
    dispatch(deleteDataset(key))
      .then(() => {
        notification.success({
          message: 'Success',
        });
        dispatch(loadDatasets(pagination));
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Something went wrong',
        });
      });
  };

  const actions = (id) => [
    <EditOutlined key="edit" onClick={() => history.push(`/datasets/${id}/edit`)} />,
    <Popconfirm title="Sure to delete?" onConfirm={() => remove(id)}>
      <DeleteOutlined key="delete" />
    </Popconfirm>,
  ];

  return !data ? (
    <Card>
      <Empty />
    </Card>
  ) : (
    <List
      dataSource={data}
      grid={{ gutter: 16, column: 4 }}
      pagination={{
        current: pagination.page,
        defaultPageSize: 20,
        pageSize: pagination.limit,
        total,
        onChange: (page, limit) => setPagination({ page, limit }),
      }}
      renderItem={(dataset) => (
        <List.Item key={dataset.id}>
          <Card
            hoverable
            actions={actions(dataset.id)}
            title={<Link to={`/datasets/${dataset.id}`}>{dataset.title}</Link>}
            bordered={false}
            bodyStyle={cardBody}
            // cover={
            //   <img
            //     className="photo"
            //     alt={dataset.featured_media?.alt_text || 'No image added'}
            //     src={dataset.featured_media?.url}
            //   />
            // }
          >
            <DatasetItem dataset={dataset} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default DatasetsList;
