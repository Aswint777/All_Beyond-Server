
import { IDependencies } from "../../application/interfaces/IDependencies";
import { useCases } from "../../application/use-Cases";
import { repositories } from "../../infrastructure/repositories";

const dependencies = {} as IDependencies;

// ✅ Initialize repositories before assigning to `dependencies`
dependencies.repositories = repositories(dependencies);

// ✅ Initialize use cases after repositories are assigned
dependencies.useCases = useCases(dependencies);   

export { dependencies };

