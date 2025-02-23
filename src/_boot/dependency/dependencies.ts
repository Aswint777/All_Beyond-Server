
import { IDependencies } from "../../application/interfaces/IDependencies";
import { useCases } from "../../application/use-Cases";
import { repositories } from "../../infrastructure/repositories";

const dependencies = {} as IDependencies;

// ✅ Initialize repositories before assigning to `dependencies`
dependencies.repositories = repositories(dependencies);

// ✅ Initialize use cases after repositories are assigned
dependencies.useCases = useCases(dependencies);   

export { dependencies };



// // import { IDependencies } from "../../application/interfaces/IDependencies";
// // import { repositories } from "../../infrastructure/repositories";
// // import { useCases } from "../../application/use-Cases";

// import { IDependencies } from "../../application/interfaces/IDependencies";
// import { useCases } from "../../application/use-Cases";
// import { repositories } from "../../infrastructure/repositories";

// // ✅ Initialize repositories first
// const repoInstances = repositories();

// // ✅ Initialize use cases **after** repositories are created
// const useCaseInstances = useCases({ repositories: repoInstances });

// export const dependencies: IDependencies = {
//   repositories: repoInstances,
//   useCases: useCaseInstances,
// };


//////////////////////////////////////////////////////////////////////////////////////////////


// import { IDependencies } from "../../application/interfaces/IDependencies";
// import * as repositories from "../../infrastructure/repositories";
// import * as useCases from "../../application/use-Cases"

// export const dependencies:IDependencies = {
//      repositories,
//      useCases  
// }   