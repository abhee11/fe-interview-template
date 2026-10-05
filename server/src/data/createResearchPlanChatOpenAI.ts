export const trace = {
  id: "4b2b3d6e-a758-4ee9-97d6-21b3e2578565",
  inputs: {
    messages: [
      [
        {
          lc: 1,
          type: "constructor",
          id: ["langchain", "schema", "messages", "SystemMessage"],
          kwargs: {
            content:
              "You are a LangChain expert and a world-class researcher, here to assist with any and all questions or issues with LangChain, LangGraph, LangSmith, or any related functionality. Users may come to you with questions or issues.\n\nBased on the conversation below, generate a plan for how you will research the answer to their question.\n\nThe plan should generally not be more than 3 steps long, it can be as short as one. The length of the plan depends on the question.\n\nYou have access to the following documentation sources:\n- Conceptual docs\n- Integration docs\n- How-to guides\n\nYou do not need to specify where you want to research for all steps of the plan, but it's sometimes helpful.",
            type: "system",
          },
        },
        {
          lc: 1,
          type: "constructor",
          id: ["langchain", "schema", "messages", "HumanMessage"],
          kwargs: {
            content: "Explique MessagesState",
            type: "human",
            id: "e9db4aae-bde5-4e69-975b-9ea3454a80df",
          },
        },
        {
          lc: 1,
          type: "constructor",
          id: ["langchain", "schema", "messages", "AIMessage"],
          kwargs: {
            content:
              "MessagesState é um estado pré-construído no LangGraph que facilita o uso de uma lista de mensagens no estado do grafo. Ele é definido com uma única chave chamada `messages`, que é uma lista de objetos do tipo `AnyMessage` do LangChain, e utiliza a função redutora `add_messages` para gerenciar atualizações dessa lista.\n\nPrincipais pontos sobre MessagesState:\n\n- **Estrutura:** Possui apenas a chave `messages`, que armazena uma lista de mensagens (como `HumanMessage`, `AIMessage`, etc.) do LangChain.\n\n- **Função redutora `add_messages`:** Essa função é usada para atualizar a lista de mensagens no estado. Ela permite que novas mensagens sejam adicionadas à lista existente, mas também gerencia atualizações de mensagens já existentes, identificando-as por ID para evitar duplicações ou sobrescritas incorretas.\n\n- **Serialização e desserialização:** A função `add_messages` também cuida da desserialização automática das mensagens recebidas, convertendo dados em formato JSON para objetos de mensagem do LangChain, o que facilita o envio e recebimento de mensagens no estado do grafo.\n\n- **Uso comum:** Como manter uma lista de mensagens é uma necessidade frequente em aplicações de chat e agentes conversacionais, o MessagesState oferece uma forma simples e padronizada de lidar com esse aspecto do estado.\n\n- **Extensibilidade:** Normalmente, o MessagesState é estendido para incluir mais campos no estado, além das mensagens, conforme a necessidade da aplicação.\n\nExemplo simplificado da definição:\n\n```python\nfrom langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    # Pode-se adicionar mais campos aqui\n    pass\n```\n\nAssim, MessagesState é uma base conveniente para gerenciar o histórico de mensagens em grafos LangGraph, garantindo que as mensagens sejam corretamente acumuladas e atualizadas no estado da aplicação[2].",
            response_metadata: {
              finish_reason: "stop",
              model_name: "gpt-4.1-mini-2025-04-14",
              system_fingerprint: "fp_6f2eabb9a5",
              service_tier: "default",
            },
            type: "ai",
            id: "run--383c8d9b-9703-4f2e-a537-eaf6b92fb9a3",
            tool_calls: [],
            invalid_tool_calls: [],
          },
        },
        {
          lc: 1,
          type: "constructor",
          id: ["langchain", "schema", "messages", "HumanMessage"],
          kwargs: {
            content: "Traduis ton message en français",
            type: "human",
            id: "399cbf4f-d539-4564-b94f-3f6061cda6a5",
          },
        },
      ],
    ],
  },
  outputs: {
    generations: [
      [
        {
          text: "",
          generation_info: {
            finish_reason: "stop",
            model_name: "gpt-4.1-mini-2025-04-14",
            system_fingerprint: "fp_6f2eabb9a5",
            service_tier: "default",
          },
          type: "ChatGeneration",
          message: {
            lc: 1,
            type: "constructor",
            id: ["langchain", "schema", "messages", "AIMessage"],
            kwargs: {
              content: "",
              additional_kwargs: {
                tool_calls: [
                  {
                    index: 0,
                    id: "call_Rtwip6XWS7RFjImASWbpDdBx",
                    function: {
                      arguments:
                        '{"steps":["Traduire l\'explication de MessagesState en français en conservant les détails techniques et la clarté.","Vérifier la terminologie spécifique à LangChain et LangGraph pour assurer une traduction précise.","Fournir un exemple de code simplifié en français si nécessaire."]}',
                      name: "Plan",
                    },
                    type: "function",
                  },
                ],
              },
              response_metadata: {
                finish_reason: "stop",
                model_name: "gpt-4.1-mini-2025-04-14",
                system_fingerprint: "fp_6f2eabb9a5",
                service_tier: "default",
              },
              type: "ai",
              id: "run--4b2b3d6e-a758-4ee9-97d6-21b3e2578565",
              tool_calls: [
                {
                  name: "Plan",
                  args: {
                    steps: [
                      "Traduire l'explication de MessagesState en français en conservant les détails techniques et la clarté.",
                      "Vérifier la terminologie spécifique à LangChain et LangGraph pour assurer une traduction précise.",
                      "Fournir un exemple de code simplifié en français si nécessaire.",
                    ],
                  },
                  id: "call_Rtwip6XWS7RFjImASWbpDdBx",
                  type: "tool_call",
                },
              ],
              invalid_tool_calls: [],
            },
          },
        },
      ],
    ],
    llm_output: null,
    run: null,
    type: "LLMResult",
  },
};
