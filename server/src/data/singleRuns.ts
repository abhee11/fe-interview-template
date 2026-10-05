import { trace as createResearchPlanChatOpenAI } from "./createResearchPlanChatOpenAI";
import { trace as firstVectorStoreRetriever } from "./firstVectorStoreRetriever";
import { trace as rootRun } from "./rootRun";

export const singleRuns = {
  "1f0529c8-196c-6c5b-84a2-604f11dc8e42": rootRun,
  "b9ae5860-0e6b-4963-9471-e742d8078cba": firstVectorStoreRetriever,
  "4b2b3d6e-a758-4ee9-97d6-21b3e2578565": createResearchPlanChatOpenAI,
};
