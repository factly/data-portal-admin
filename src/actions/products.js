import axios from '../utils/axios';
import {
  ADD_PRODUCT,
  ADD_PRODUCTS,
  SET_PRODUCT_LOADING,
  SET_PRODUCT_REQUEST,
  SET_PRODUCT_IDS,
  RESET_PRODUCT,
  PRODUCT_API,
} from '../constants/products';
import { addCurrencies } from './currencies';
import { addTags } from './tags';
import { getIds, getValues, deleteKeys, buildObjectOfItems } from '../utils/objects';

export const loadProducts = (page = 1, limit = 5) => {
  return async (dispatch, getState) => {
    const {
      products: { req },
    } = getState();

    let ids;
    for (let item of req) {
      if (item.page === page && item.limit === limit) {
        ids = [...item.ids];
      }
    }

    if (ids) {
      dispatch(setProductIds(ids));
      return;
    }

    dispatch(setLoading(true));

    const response = await axios({
      url: `${PRODUCT_API}?page=${page}&limit=${limit}`,
      method: 'get',
    });

    const { nodes, total } = response.data;
    const currentPageIds = getIds(nodes);
    const currentReq = { page: page, limit: limit, ids: currentPageIds };
    dispatch(addProducts(nodes));
    dispatch(setProductIds(currentPageIds));
    dispatch(setProductRequest(currentReq, total));

    dispatch(setLoading(false));
  };
};

export const createProduct = (data) => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));

    await axios({
      url: PRODUCT_API,
      method: 'post',
      data: data,
    });

    dispatch(resetProduct());
    dispatch(setLoading(false));
  };
};

export const updateProduct = (id, data) => {
  return async (dispatch, getState) => {
    let url = `${PRODUCT_API}/${id}`;

    dispatch(setLoading(true));

    const response = await axios({
      url: url,
      method: 'put',
      data: data,
    });

    dispatch(addProduct(response.data));
    dispatch(setLoading(false));
  };
};

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    let url = `${PRODUCT_API}/${id}`;

    dispatch(setLoading(true));

    await axios({
      url: url,
      method: 'delete',
    });

    dispatch(resetProduct());
    dispatch(setLoading(false));
  };
};

export const getProduct = (id) => {
  return async (dispatch, getState) => {
    const {
      products: { items },
    } = getState();

    if (items[id]) {
      return;
    }

    dispatch(setLoading(true));

    const response = await axios({
      url: `${PRODUCT_API}/${id}`,
      method: 'get',
    });
    dispatch(addProduct(response.data));

    dispatch(setLoading(false));
  };
};

const setLoading = (loading) => {
  return {
    type: SET_PRODUCT_LOADING,
    payload: { loading },
  };
};

const addProduct = (product) => (dispatch) => {
  const currencies = getValues([product], 'currency');
  dispatch(addCurrencies(currencies));

  const tags = getValues([product], 'tags');
  dispatch(addTags(tags));

  product.tags = getIds(product.tags);
  dispatch({
    type: ADD_PRODUCT,
    payload: { product: deleteKeys([product], ['currency'])[0] },
  });
};

export const addProducts = (products) => (dispatch) => {
  const currencies = getValues(products, 'currency');
  dispatch(addCurrencies(currencies));

  const tags = getValues(products, 'tags');
  dispatch(addTags(tags));

  products.forEach((product) => {
    product.tags = getIds(product.tags);
  });

  dispatch({
    type: ADD_PRODUCTS,
    payload: {
      products: buildObjectOfItems(deleteKeys(products, ['currency'])),
    },
  });
};

const setProductRequest = (req, total) => {
  return {
    type: SET_PRODUCT_REQUEST,
    payload: { req, total },
  };
};

const setProductIds = (ids) => {
  return {
    type: SET_PRODUCT_IDS,
    payload: { ids },
  };
};

const resetProduct = () => {
  return {
    type: RESET_PRODUCT,
  };
};
