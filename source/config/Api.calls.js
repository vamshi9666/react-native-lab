import axios from "axios";
import { API_URL } from "./Api";
import { retrieveData } from "./Storage";
var token;
const timeout = 10000;
export async function getMethod(route) {
  try {
    token = await retrieveData("AUTH_TOKEN");
    let res = await axios.get(API_URL + route, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function putMethod(route, data) {
  try {
    let res;
    if (data) {
      token = await retrieveData("AUTH_TOKEN");
      res = await axios.put(API_URL + route, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      res = await axios({
        url: `${API_URL}${route}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return res.data;
  } catch (err) {
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function deleteMethod(route, data) {
  try {
    token = await retrieveData("AUTH_TOKEN");
    let res = await axios.delete(API_URL + route, {
      headers: { Authorization: `Bearer ${token}` },
      data: data
    });
    return res.data;
  } catch (err) {
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function putMethodWithoutAccessToken(route, data) {
  try {
    let res;
    if (data) {
      res = await axios.put(API_URL + route, data);
    } else {
      res = await axios.put(API_URL + route);
    }
    return res.data;
  } catch (err) {
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function postMethodWithoutAccessToken(route, data) {
  try {
    let res = await axios.post(API_URL + route, data);
    return res.data;
  } catch (err) {
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function postMethod(route, data, formData = false) {
  try {
    let res;
    token = await retrieveData("AUTH_TOKEN");
    if (formData) {
      res = await axios({
        url: API_URL + route,
        method: "POST",
        config: { headers: { "Content-Type": "multipart/form-data" } },
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: data
      });
    } else {
      res = await axios({
        url: API_URL + route,
        method: "POST",
        data: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        timeout
      });
    }

    return res.data;
  } catch (err) {
    // throw new Error(err);
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}

export async function newPostMethod(route, data, formData = false) {
  try {
    let res;
    token = await retrieveData("AUTH_TOKEN");
    if (formData) {
      res = await axios({
        url: API_URL + route,
        method: "POST",
        config: { headers: { "Content-Type": "multipart/form-data" } },
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: data
      });
    } else {
      res = await axios({
        url: API_URL + route,
        method: "POST",
        data: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        timeout
      });
    }

    return res.data;
  } catch (err) {
    throw new Error(err);
    return err
      ? err.response
        ? err.response.data
          ? err.response.data
          : err
        : err
      : err;
  }
}
