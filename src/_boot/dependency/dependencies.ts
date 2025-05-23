import { SocketManager } from "../../_lib/socket/socketManager";
import { SocketServiceImpl } from "../../_lib/socket/socketServiceImpl";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { useCases } from "../../application/use-Cases";
import { repositories } from "../../infrastructure/repositories";

const dependencies = {} as IDependencies;

dependencies.socketService = {} as any; 

//  Initialize repositories before assigning to `dependencies`
dependencies.repositories = repositories(dependencies);

// Initialize use cases after repositories are assigned
dependencies.useCases = useCases(dependencies);    

export { dependencies };



  //  const dependencies: IDependencies = {
  //    socketService: null as unknown as SocketServiceImpl, 
  //    repositories: repositories({} as IDependencies),
  //    useCases: useCases({} as IDependencies),
  //  };

  //  export { dependencies };

export function initializeSocketService(httpServer: any) {
    const socketManager = new SocketManager(httpServer);
    dependencies.socketService = socketManager.getSocketService();
  }