import request from "@/utils/request";

export const login = (data) =>
  request({
    method: "POST",
    url: "/v1_0/authorizations",
    data,
  });

export const getSmsCode = (mobile) =>
  request({
    url: `/v1_0/sms/codes/${mobile}`,
  });
