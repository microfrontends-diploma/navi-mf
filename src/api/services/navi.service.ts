import { AxiosRequestConfig } from "axios";
import { NetworkService } from "./network.service";
import { CoordinatesServerResponse } from "../dto/navi.dto";

export class NaviService extends NetworkService {
  getCoordinates = (data: FormData, config?: AxiosRequestConfig) => {
    return this.post<FormData, CoordinatesServerResponse>("/coordinates", data, config);
  };
}
