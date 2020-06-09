import {
  ADD_MEMBERSHIPS_LIST_REQUEST,
  LOADING_MEMBERSHIPS,
  LOAD_MEMBERSHIPS_SUCCESS,
  LOAD_MEMBERSHIPS_FAILURE,
  SET_MEMBERSHIPS_LIST_TOTAL,
  SET_MEMEBERSHIPS_LIST_CURRENT_PAGE,
} from '../constants/memberships';

const initialState = {
  list: { loading: false, ids: [], req: [], items: {}, total: 0 },
};

export default function membershipsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_MEMBERSHIPS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case LOAD_MEMBERSHIPS_SUCCESS: {
      const { list } = state;
      const { items } = action.payload;
      return {
        ...state,
        list: {
          ...list,
          loading: false,
          items: { ...list.items, ...items },
        },
      };
    }
    case SET_MEMBERSHIPS_LIST_TOTAL:
      return {
        ...state,
        list: {
          ...state.list,
          total: action.payload,
        },
      };
    case ADD_MEMBERSHIPS_LIST_REQUEST: {
      const { list } = state;
      return {
        ...state,
        list: {
          ...list,
          req: [...list.req, action.payload],
        },
      };
    }
    case SET_MEMEBERSHIPS_LIST_CURRENT_PAGE:
      const { list } = state;
      return {
        ...state,
        list: {
          ...list,
          ids: action.payload,
        },
      };
    case LOAD_MEMBERSHIPS_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
        },
      };
    default:
      return state;
  }
}
