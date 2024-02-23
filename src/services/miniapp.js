import config from '../config';

const base = config.BASE_URL;
let token = null; // Khởi tạo token với giá trị null

// Hàm lưu token
export const saveToken = (value) => {
  token = value;
};

// Hàm tạo và thực hiện request
export const request = async (method, path, data) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // Chờ đợi token có giá trị
  while (!token) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Thêm token vào header
  headers.set('Authorization', `Bearer ${token}`);
  const url = new URL(`${base}/${path}`);

  // Đối với method GET, thêm data vào URLSearchParams
  if (method === 'GET' && data) {
    url.search = new URLSearchParams(data).toString();
  }

  const options = {
    method,
    headers,
  };

  // Thêm body cho request nếu không phải GET
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url.toString(), options);
};

// Hàm lấy thông tin ứng dụng dựa trên từ khóa
export const getAppsByKeyword = async (keyword) => {
  try {
    const response = await request('GET', 'mini-store/search-app', { keyword });
    const responseData = await response.json();

    if (!responseData.err) {
      return responseData.data.appsInfo;
    } else {
      throw new Error(responseData.msg);
    }
  } catch (error) {
    console.error('Error fetching apps by keyword. Details: ', error);
  }
};