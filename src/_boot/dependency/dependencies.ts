
import { SocketManager } from "../../_lib/socket/socketManager";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { useCases } from "../../application/use-Cases";
import { repositories } from "../../infrastructure/repositories";

const dependencies = {} as IDependencies;

dependencies.socketService = {} as any; // Temporary to satisfy type

// ✅ Initialize repositories before assigning to `dependencies`
dependencies.repositories = repositories(dependencies);

// ✅ Initialize use cases after repositories are assigned
dependencies.useCases = useCases(dependencies);   



export { dependencies };

// Function to initialize socketService with HTTP server
export function initializeSocketService(httpServer: any) {
    const socketManager = new SocketManager(httpServer);
    dependencies.socketService = socketManager.getSocketService();
  }