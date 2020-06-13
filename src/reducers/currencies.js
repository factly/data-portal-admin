import {
  ADD_CURRENCIES_LIST_REQUEST,
  SET_CURRENCIES_LIST_CURRENT_PAGE,
  LOADING_CURRENCIES,
  LOAD_CURRENCIES_SUCCESS,
  SET_CURRENCIES_LIST_TOTAL,
  LOAD_CURRENCIES_FAILURE,
  CREATING_CURRENCY,
  CREATE_CURRENCY_SUCCESS,
  CREATE_CURRENCY_FAILURE,
  UPDATE_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_FAILURE,
  DELETE_CURRENCY_SUCCESS,
  DELETE_CURRENCY_FAILURE,
} from '../constants/currencies';
import { unique } from '../utils/objects';

const initialState = {
  list: { loading: false, ids: [], req: [], items: {}, total: 0 },
};

export default function currenciesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_CURRENCIES:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case LOAD_CURRENCIES_SUCCESS: {
      const { ids, items } = action.payload;
      const { list } = state;
      return {
        ...state,
        list: {
          ...list,
          loading: false,
          items: { ...list.items, ...items },
        },
      };
    }
    case SET_CURRENCIES_LIST_TOTAL:
      return {
        ...state,
        list: {
          ...state.list,
          total: action.payload,
        },
      };
    case ADD_CURRENCIES_LIST_REQUEST: {
      const { list } = state;
      return {
        ...state,
        list: {
          ...list,
          req: [...list.req, action.payload],
        },
      };
    }
    case SET_CURRENCIES_LIST_CURRENT_PAGE:
      const { list } = state;
      return {
        ...state,
        list: {
          ...list,
          ids: action.payload,
        },
      };
    case LOAD_CURRENCIES_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
        },
      };
    case CREATING_CURRENCY:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case CREATE_CURRENCY_SUCCESS: {
      const { list } = state;
      const currency = action.payload;
      return {
        ...state,
        list: {
          ...list,
          loading: false,
          req: [],
          items: { ...list.items, [currency.id]: currency },
          total: list.total + 1,
        },
      };
    }
    case CREATE_CURRENCY_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
        },
      };
    case UPDATE_CURRENCY_SUCCESS: {
      const currency = action.payload;
      const { list } = state;

      return {
        ...state,
        list: {
          ...list,
          loading: false,
          items: { ...list.items, [currency.id]: currency },
        },
      };
    }
    case UPDATE_CURRENCY_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
        },
      };
    case DELETE_CURRENCY_SUCCESS: {
      const { list } = state;
      const id = action.payload;
      const newItems = { ...list.items };
      delete newItems[id];
      return {
        ...state,
        list: {
          ...list,
          loading: false,
          req: [],
          ids: [],
          items: newItems,
          total: list.total - 1,
        },
      };
    }
    case DELETE_CURRENCY_FAILURE:
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
