import { SocketServiceImpl } from "../../_lib/socket/socketServiceImpl";
import { IRepositories } from "./IRepositories";
import { IUseCases } from "./IUseCases";

export interface IDependencies {
  repositories: IRepositories;
  useCases: IUseCases;
  socketService: SocketServiceImpl;
}
