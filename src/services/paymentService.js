import axios from "axios";

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_API_URL,
});

const paymentService = {
  initialize: (data) =>
    paymentApi.post("/payments/initialize", data),

  verify: (reference) =>
    paymentApi.get(`/payments/verify/${reference}`),
};

export default paymentService;