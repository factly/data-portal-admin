import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import { useDispatch, Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Table } from 'antd';

import '../../../matchMedia.mock';
import MembershipList from './MembershipsList';
import { loadMemberships } from '../../../actions/memberships';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('../../../actions/memberships', () => ({
  loadMemberships: jest.fn(),
  deleteMembership: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

describe('Memberships List component', () => {
  let store;
  let mockedDispatch;
  const membership = {
    id: 1,
    payment_id: 1,
    plan_id: 1,
    user_id: 1,
    status: 'status',
    created_at: '2020-12-12',
  };

  describe('snapshot testing', () => {
    beforeEach(() => {
      store = mockStore({
        memberships: {
          loading: false,
          ids: [1],
          req: [
            {
              page: 1,
              limit: 5,
              ids: [1],
            },
          ],
          items: {
            1: {
              id: 1,
              payment_id: 1,
              plan_id: 1,
              user_id: 1,
              status: 'status',
              created_at: '2020-12-12',
            },
          },
          total: 1,
        },
        plans: {
          loading: false,
          items: {
            1: {
              id: 1,
            },
          },
        },
        users: {
          loading: false,
          items: {
            1: {
              id: 1,
            },
          },
        },
      });
      store.dispatch = jest.fn(() => ({}));
      mockedDispatch = jest.fn();
      useDispatch.mockReturnValue(mockedDispatch);
    });
    it('should render the component', () => {
      const tree = renderer
        .create(
          <Provider store={store}>
            <MembershipList />
          </Provider>,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('should match component when loading', () => {
      store = mockStore({
        memberships: {
          ids: [],
          loading: true,
          req: [],
          items: {},
          total: 0,
        },
        plans: {
          items: {
            1: {
              id: 1,
            },
          },
        },
        users: {
          items: {
            1: {
              id: 1,
            },
          },
        },
      });
      const tree = renderer
        .create(
          <Provider store={store}>
            <MembershipList />
          </Provider>,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('should match component with memberships', () => {
      loadMemberships.mockReset();
      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Router>
              <MembershipList />
            </Router>
          </Provider>,
        );
      });
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(loadMemberships).toHaveBeenCalledWith(1, 5);
    });
  });
  describe('component testing', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      store = mockStore({
        memberships: {
          ids: [1],
          req: [
            {
              page: 1,
              limit: 5,
              ids: [1],
            },
          ],
          items: {
            1: {
              id: 1,
              payment_id: 1,
              plan_id: 1,
              user_id: 1,
              status: 'status',
              created_at: '2020-12-12',
            },
          },
          total: 1,
        },
        plans: {
          items: {
            1: {
              id: 1,
            },
          },
        },
        users: {
          items: {
            1: {
              id: 1,
            },
          },
        },
      });
      store.dispatch = jest.fn(() => ({}));
      mockedDispatch = jest.fn(() => new Promise((resolve) => resolve(true)));
      useDispatch.mockReturnValue(mockedDispatch);
    });
    it('should change the page', () => {
      const wrapper = mount(
        <Provider store={store}>
          <MembershipList />
        </Provider>,
      );
      const table = wrapper.find(Table);
      table.props().pagination.onChange(2);
      wrapper.update();
      const updatedTable = wrapper.find(Table);
      expect(updatedTable.props().pagination.current).toEqual(2);
    });
  });
});
