import axios from "axios";
import NaviService from "./services";

// FIXME: эта штука создается где?
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "https://services.simurg.space/navi/navi",
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

export class Api {
  naviService: NaviService | null = null;

  constructor() {
    this.naviService = new NaviService(axiosInstance);
  }
}

export default Api;
