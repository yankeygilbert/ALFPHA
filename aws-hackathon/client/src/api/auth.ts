import axios from "axios";
import config from '../config'
import { ResetPasswordModule } from "../interfaces/ResetPassword";
axios.defaults.withCredentials = true;

let serverPort: number | string;
config.NODE_ENV === "production" ? (serverPort = "") : (serverPort = `:${config.SERVER_PORT}`!);

export async function onRegister(registrationData: {}) {
  return await axios.post(`${config.HOST}${serverPort}/api/register`, registrationData);
}

export async function onLogin(loginData: {}) {
  return await axios.post(`${config.HOST}${serverPort}/api/login`, loginData);
}

export async function onLogout() {
  return await axios.get(`${config.HOST}${serverPort}/api/logout`);
}

interface Email{
  email: string;
}
export async function onResetpasswordRequest(email: Email) {
  return await axios.post(`${config.HOST}${serverPort}/api/requestpasswordreset`, email)
}

export async function onResetPassword(data: ResetPasswordModule) {
  return await axios.post(`${config.HOST}${serverPort}/api/resetpassword`, data)
}

/* export async function fetchCurrentUser() {
  return await axios.get(`${config.HOST}${serverPort}/api/currentuser`);
} */

/* export async function fetchDocuments() {
  return await axios.get(`${config.HOST}${serverPort}/api/documents`);
} */
