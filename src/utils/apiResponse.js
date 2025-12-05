const successResponse = (data, message) => {
  const payload = { success: true, data };
  if (message) {
    payload.message = message;
  }
  return payload;
};

const errorResponse = (message, data) => {
  const payload = { success: false, message };
  if (data) {
    payload.data = data;
  }
  return payload;
};

module.exports = {
  successResponse,
  errorResponse,
};
