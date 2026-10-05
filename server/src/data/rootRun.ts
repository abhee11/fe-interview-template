export const trace = {
  id: "1f0529c8-196c-6c5b-84a2-604f11dc8e42",
  inputs: {
    messages: [
      {
        role: "user",
        content: "Traduis ton message en français",
      },
    ],
  },
  outputs: {
    messages: [
      {
        content: "Explique MessagesState",
        additional_kwargs: {},
        response_metadata: {},
        type: "human",
        id: "e9db4aae-bde5-4e69-975b-9ea3454a80df",
        example: false,
      },
      {
        content:
          "MessagesState é um estado pré-construído no LangGraph que facilita o uso de uma lista de mensagens no estado do grafo. Ele é definido com uma única chave chamada `messages`, que é uma lista de objetos do tipo `AnyMessage` do LangChain, e utiliza a função redutora `add_messages` para gerenciar atualizações dessa lista.\n\nPrincipais pontos sobre MessagesState:\n\n- **Estrutura:** Possui apenas a chave `messages`, que armazena uma lista de mensagens (como `HumanMessage`, `AIMessage`, etc.) do LangChain.\n\n- **Função redutora `add_messages`:** Essa função é usada para atualizar a lista de mensagens no estado. Ela permite que novas mensagens sejam adicionadas à lista existente, mas também gerencia atualizações de mensagens já existentes, identificando-as por ID para evitar duplicações ou sobrescritas incorretas.\n\n- **Serialização e desserialização:** A função `add_messages` também cuida da desserialização automática das mensagens recebidas, convertendo dados em formato JSON para objetos de mensagem do LangChain, o que facilita o envio e recebimento de mensagens no estado do grafo.\n\n- **Uso comum:** Como manter uma lista de mensagens é uma necessidade frequente em aplicações de chat e agentes conversacionais, o MessagesState oferece uma forma simples e padronizada de lidar com esse aspecto do estado.\n\n- **Extensibilidade:** Normalmente, o MessagesState é estendido para incluir mais campos no estado, além das mensagens, conforme a necessidade da aplicação.\n\nExemplo simplificado da definição:\n\n```python\nfrom langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    # Pode-se adicionar mais campos aqui\n    pass\n```\n\nAssim, MessagesState é uma base conveniente para gerenciar o histórico de mensagens em grafos LangGraph, garantindo que as mensagens sejam corretamente acumuladas e atualizadas no estado da aplicação[2].",
        additional_kwargs: {},
        response_metadata: {
          finish_reason: "stop",
          model_name: "gpt-4.1-mini-2025-04-14",
          system_fingerprint: "fp_6f2eabb9a5",
          service_tier: "default",
        },
        type: "ai",
        id: "run--383c8d9b-9703-4f2e-a537-eaf6b92fb9a3",
        example: false,
        tool_calls: [],
        invalid_tool_calls: [],
      },
      {
        content: "Traduis ton message en français",
        additional_kwargs: {},
        response_metadata: {},
        type: "human",
        id: "399cbf4f-d539-4564-b94f-3f6061cda6a5",
        example: false,
      },
      {
        content:
          "MessagesState est un état préconstruit dans LangGraph qui facilite l’utilisation d’une liste de messages dans l’état du graphe. Il est défini avec une seule clé appelée `messages`, qui est une liste d’objets de type `AnyMessage` de LangChain, et utilise la fonction réductrice `add_messages` pour gérer les mises à jour de cette liste.\n\nPoints clés concernant MessagesState :\n\n- **Structure :** Il contient uniquement la clé `messages`, qui stocke une liste de messages (comme `HumanMessage`, `AIMessage`, etc.) de LangChain.\n\n- **Fonction réductrice `add_messages` :** Cette fonction est utilisée pour mettre à jour la liste des messages dans l’état. Elle permet d’ajouter de nouveaux messages à la liste existante, mais gère aussi les mises à jour des messages déjà présents en identifiant ceux-ci par leur ID afin d’éviter les doublons ou les écrasements incorrects.\n\n- **Sérialisation et désérialisation :** La fonction `add_messages` s’occupe également de la désérialisation automatique des messages reçus, convertissant les données au format JSON en objets message de LangChain, ce qui facilite l’envoi et la réception des messages dans l’état du graphe.\n\n- **Usage courant :** Comme maintenir une liste de messages est une nécessité fréquente dans les applications de chat et les agents conversationnels, MessagesState offre une manière simple et standardisée de gérer cet aspect de l’état.\n\n- **Extensibilité :** En général, MessagesState est étendu pour inclure d’autres champs dans l’état, en plus des messages, selon les besoins de l’application.\n\nExemple simplifié de définition :\n\n```python\nfrom langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    # On peut ajouter d’autres champs ici\n    pass\n```\n\nAinsi, MessagesState est une base pratique pour gérer l’historique des messages dans les graphes LangGraph, garantissant que les messages sont correctement accumulés et mis à jour dans l’état de l’application[2].",
        additional_kwargs: {},
        response_metadata: {
          finish_reason: "stop",
          model_name: "gpt-4.1-mini-2025-04-14",
          system_fingerprint: "fp_6f2eabb9a5",
          service_tier: "default",
        },
        type: "ai",
        id: "run--429e5a2b-a48f-4f99-8ca9-ca225da387f7",
        example: false,
        tool_calls: [],
        invalid_tool_calls: [],
      },
    ],
    steps: [],
    documents: [
      {
        metadata: {
          source:
            "https://langchain-ai.github.io/langgraph/concepts/low_level/",
          description: "",
          language: "",
          title: "Overview | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          loc: "https://langchain-ai.github.io/langgraph/concepts/low_level/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "319a86c5-83ad-58b0-846e-8d8420b95cf7",
        },
        page_content:
          'class State(TypedDict):\n    foo: int\n    bar: Annotated[list[str], add]\n\nIn this example, we\'ve used the Annotated type to specify a reducer function (operator.add) for the second key (bar). Note that the first key remains unchanged. Let\'s assume the input to the graph is {"foo": 1, "bar": ["hi"]}. Let\'s then assume the first Node returns {"foo": 2}. This is treated as an update to the state. Notice that the Node does not need to return the whole State schema - just an update. After applying this update, the State would then be {"foo": 2, "bar": ["hi"]}. If the second node returns {"bar": ["bye"]} then the State would then be {"foo": 2, "bar": ["hi", "bye"]}. Notice here that the bar key is updated by adding the two lists together.\nWorking with Messages in Graph State¶\nWhy use messages?¶\nMost modern LLM providers have a chat model interface that accepts a list of messages as input. LangChain\'s ChatModel in particular accepts a list of Message objects as inputs. These messages come in a variety of forms such as HumanMessage (user input) or AIMessage (LLM response). To read more about what message objects are, please refer to this conceptual guide.\nUsing Messages in your Graph¶\nIn many cases, it is helpful to store prior conversation history as a list of messages in your graph state. To do so, we can add a key (channel) to the graph state that stores a list of Message objects and annotate it with a reducer function (see messages key in the example below). The reducer function is vital to telling the graph how to update the list of Message objects in the state with each state update (for example, when a node sends an update). If you don\'t specify a reducer, every state update will overwrite the list of messages with the most recently provided value. If you wanted to simply append messages to the existing list, you could use operator.add as a reducer.\nHowever, you might also want to manually update messages in your graph state (e.g. human-in-the-loop). If you were to use operator.add, the manual state updates you send to the graph would be appended to the existing list of messages, instead of updating existing messages. To avoid that, you need a reducer that can keep track of message IDs and overwrite existing messages, if updated. To achieve this, you can use the prebuilt add_messages function. For brand new messages, it will simply append to existing list, but it will also handle the updates for existing messages correctly.\nSerialization¶\nIn addition to keeping track of message IDs, the add_messages function will also try to deserialize messages into LangChain Message objects whenever a state update is received on the messages channel. See more information on LangChain serialization/deserialization here. This allows sending graph inputs / state updates in the following format:\n# this is supported\n{"messages": [HumanMessage(content="message")]}\n\n# and this is also supported\n{"messages": [{"type": "human", "content": "message"}]}\n\nSince the state updates are always deserialized into LangChain Messages when using add_messages, you should use dot notation to access message attributes, like state["messages"][-1].content. Below is an example of a graph that uses add_messages as it\'s reducer function.\nAPI Reference: AnyMessage | add_messages\nfrom langchain_core.messages import AnyMessage\nfrom langgraph.graph.message import add_messages\nfrom typing import Annotated\nfrom typing_extensions import TypedDict\n\nclass GraphState(TypedDict):\n    messages: Annotated[list[AnyMessage], add_messages]\n\nMessagesState¶\nSince having a list of messages in your state is so common, there exists a prebuilt state called MessagesState which makes it easy to use messages. MessagesState is defined with a single messages key which is a list of AnyMessage objects and uses the add_messages reducer. Typically, there is more state to track than just messages, so we see people subclass this state and add more fields, like:\nfrom langgraph.graph import MessagesState',
        type: "Document",
      },
      {
        metadata: {
          source: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/",
          language: "",
          description: "",
          title: "Use the Graph API | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          loc: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "eb85f53b-7544-571d-b454-d8ded1be6503",
        },
        page_content:
          '================================ Human Message =================================\n\nHi\n================================== Ai Message ==================================\n\nHello!\n\nProcess state updates with reducers¶\nEach key in the state can have its own independent reducer function, which controls how updates from nodes are applied. If no reducer function is explicitly specified then it is assumed that all updates to the key should override it.\nFor TypedDict state schemas, we can define reducers by annotating the corresponding field of the state with a reducer function.\nIn the earlier example, our node updated the "messages" key in the state by appending a message to it. Below, we add a reducer to this key, such that updates are automatically appended:\nfrom typing_extensions import Annotated\n\ndef add(left, right):\n    """Can also import `add` from the `operator` built-in."""\n    return left + right\n\nclass State(TypedDict):\n    messages: Annotated[list[AnyMessage], add]\n    extra_field: int\n\nNow our node can be simplified:\ndef node(state: State):\n    new_message = AIMessage("Hello!")\n    return {"messages": [new_message], "extra_field": 10}\n\nAPI Reference: START\nfrom langgraph.graph import START\n\ngraph = StateGraph(State).add_node(node).add_edge(START, "node").compile()\n\nresult = graph.invoke({"messages": [HumanMessage("Hi")]})\n\nfor message in result["messages"]:\n    message.pretty_print()\n\n================================ Human Message =================================\n\nHi\n================================== Ai Message ==================================\n\nHello!\n\nMessagesState¶\nIn practice, there are additional considerations for updating lists of messages:\n\nWe may wish to update an existing message in the state.\nWe may want to accept short-hands for message formats, such as OpenAI format.\n\nLangGraph includes a built-in reducer add_messages that handles these considerations:\nAPI Reference: add_messages\nfrom langgraph.graph.message import add_messages\n\nclass State(TypedDict):\n    messages: Annotated[list[AnyMessage], add_messages]\n    extra_field: int\n\ndef node(state: State):\n    new_message = AIMessage("Hello!")\n    return {"messages": [new_message], "extra_field": 10}\n\ngraph = StateGraph(State).add_node(node).set_entry_point("node").compile()\n\ninput_message = {"role": "user", "content": "Hi"}\n\nresult = graph.invoke({"messages": [input_message]})\n\nfor message in result["messages"]:\n    message.pretty_print()\n\n================================ Human Message =================================\n\nHi\n================================== Ai Message ==================================\n\nHello!\n\nThis is a versatile representation of state for applications involving chat models. LangGraph includes a pre-built MessagesState for convenience, so that we can have:\nfrom langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    extra_field: int\n\nDefine input and output schemas¶\nBy default, StateGraph operates with a single schema, and all nodes are expected to communicate using that schema. However, it\'s also possible to define distinct input and output schemas for a graph.\nWhen distinct schemas are specified, an internal schema will still be used for communication between nodes. The input schema ensures that the provided input matches the expected structure, while the output schema filters the internal data to return only the relevant information according to the defined output schema.\nBelow, we\'ll see how to define distinct input and output schema.\nAPI Reference: StateGraph | START | END\nfrom langgraph.graph import StateGraph, START, END\nfrom typing_extensions import TypedDict\n\n# Define the schema for the input\nclass InputState(TypedDict):\n    question: str\n\n# Define the schema for the output\nclass OutputState(TypedDict):\n    answer: str\n\n# Define the overall schema, combining both input and output\nclass OverallState(InputState, OutputState):\n    pass',
        type: "Document",
      },
      {
        metadata: {
          source: "https://python.langchain.com/docs/how_to/message_history/",
          description:
            "This guide assumes familiarity with the following concepts:",
          language: "en",
          title: "How to add message history | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/how_to/message_history/",
          lastmod: null,
          content_type: null,
          uuid: "43ad36a2-86bf-53f5-af55-03bea9808421",
        },
        page_content:
          'Note that in the below state:\n\n- Updates to the `messages` list will append messages;\n\n- Updates to the `language` string will overwrite the string.\n\n```python\nfrom typing import Sequence\n\nfrom langchain_core.messages import BaseMessage\nfrom langgraph.graph.message import add_messages\nfrom typing_extensions import Annotated, TypedDict\n\nclass State(TypedDict):\n    messages: Annotated[Sequence[BaseMessage], add_messages]\n    language: str\n\nworkflow = StateGraph(state_schema=State)\n\ndef call_model(state: State):\n    response = runnable.invoke(state)\n    # Update message history with response:\n    return {"messages": [response]}\n\nworkflow.add_edge(START, "model")\nworkflow.add_node("model", call_model)\n\nmemory = MemorySaver()\napp = workflow.compile(checkpointer=memory)\n```\n\n**API Reference:**[BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)\n```python\nconfig = {"configurable": {"thread_id": "abc345"}}\n\ninput_dict = {\n    "messages": [HumanMessage("Hi, I\'m Bob.")],\n    "language": "Spanish",\n}\noutput = app.invoke(input_dict, config)\noutput["messages"][-1].pretty_print()\n```\n\n```output\n==================================[1m Ai Message [0m==================================\n\n¡Hola, Bob! Es un placer conocerte.\n```\n\n## Managing message history​\n\nThe message history (and other elements of the application state) can be accessed via `.get_state`:\n\n```python\nstate = app.get_state(config).values\n\nprint(f\'Language: {state["language"]}\')\nfor message in state["messages"]:\n    message.pretty_print()\n```\n\n```output\nLanguage: Spanish\n================================[1m Human Message [0m=================================\n\nHi, I\'m Bob.\n==================================[1m Ai Message [0m==================================\n\n¡Hola, Bob! Es un placer conocerte.\n```\n\nWe can also update the state via `.update_state`. For example, we can manually append a new message:\n\n```python\nfrom langchain_core.messages import HumanMessage\n\n_ = app.update_state(config, {"messages": [HumanMessage("Test")]})\n```\n\n**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)\n```python\nstate = app.get_state(config).values\n\nprint(f\'Language: {state["language"]}\')\nfor message in state["messages"]:\n    message.pretty_print()\n```\n\n```output\nLanguage: Spanish\n================================[1m Human Message [0m=================================\n\nHi, I\'m Bob.\n==================================[1m Ai Message [0m==================================\n\n¡Hola, Bob! Es un placer conocerte.\n================================[1m Human Message [0m=================================\n\nTest\n```\n\nFor details on managing state, including deleting messages, see the LangGraph documentation:\n\n- [How to delete messages](https://langchain-ai.github.io/langgraph/how-tos/memory/delete-messages/)\n\n- [How to view and update past graph state](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/time-travel/)\n\n#### Was this page helpful?\n\n- [Setup](#setup)\n\n- [Example: message inputs](#example-message-inputs)\n\n- [Example: dictionary inputs](#example-dictionary-inputs)\n\n- [Managing message history](#managing-message-history)',
        type: "Document",
      },
      {
        metadata: {
          loc: "https://langchain-ai.github.io/langgraph/cloud/how-tos/use_stream_react/",
          description: "",
          language: "",
          title: "Integrate LangGraph into a React app | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          source:
            "https://langchain-ai.github.io/langgraph/cloud/how-tos/use_stream_react/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "b7d8bf00-7abe-52ac-83b8-eafb3664fcf9",
        },
        page_content:
          'function EditMessage({\n  message,\n  onEdit,\n}: {\n  message: Message;\n  onEdit: (message: Message) => void;\n}) {\n  const [editing, setEditing] = useState(false);\n\n  if (!editing) {\n    return (\n      <button type="button" onClick={() => setEditing(true)}>\n        Edit\n      </button>\n    );\n  }\n\n  return (\n    <form\n      onSubmit={(e) => {\n        e.preventDefault();\n        const form = e.target as HTMLFormElement;\n        const content = new FormData(form).get("content") as string;\n\n        form.reset();\n        onEdit({ type: "human", content });\n        setEditing(false);\n      }}\n    >\n      <input name="content" defaultValue={message.content as string} />\n      <button type="submit">Save</button>\n    </form>\n  );\n}\n\nexport default function App() {\n  const thread = useStream({\n    apiUrl: "http://localhost:2024",\n    assistantId: "agent",\n    messagesKey: "messages",\n  });\n\n  return (\n    <div>\n      <div>\n        {thread.messages.map((message) => {\n          const meta = thread.getMessagesMetadata(message);\n          const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;\n\n          return (\n            <div key={message.id}>\n              <div>{message.content as string}</div>\n\n              {message.type === "human" && (\n                <EditMessage\n                  message={message}\n                  onEdit={(message) =>\n                    thread.submit(\n                      { messages: [message] },\n                      { checkpoint: parentCheckpoint }\n                    )\n                  }\n                />\n              )}\n\n              {message.type === "ai" && (\n                <button\n                  type="button"\n                  onClick={() =>\n                    thread.submit(undefined, { checkpoint: parentCheckpoint })\n                  }\n                >\n                  <span>Regenerate</span>\n                </button>\n              )}\n\n              <BranchSwitcher\n                branch={meta?.branch}\n                branchOptions={meta?.branchOptions}\n                onSelect={(branch) => thread.setBranch(branch)}\n              />\n            </div>\n          );\n        })}\n      </div>\n\n      <form\n        onSubmit={(e) => {\n          e.preventDefault();\n\n          const form = e.target as HTMLFormElement;\n          const message = new FormData(form).get("message") as string;\n\n          form.reset();\n          thread.submit({ messages: [message] });\n        }}\n      >\n        <input type="text" name="message" />\n\n        {thread.isLoading ? (\n          <button key="stop" type="button" onClick={() => thread.stop()}>\n            Stop\n          </button>\n        ) : (\n          <button key="submit" type="submit">\n            Send\n          </button>\n        )}\n      </form>\n    </div>\n  );\n}\n\nFor advanced use cases you can use the experimental_branchTree property to get the tree representation of the thread, which can be used to render branching controls for non-message based graphs.\nOptimistic Updates¶\nYou can optimistically update the client state before performing a network request to the agent, allowing you to provide immediate feedback to the user, such as showing the user message immediately before the agent has seen the request.\nconst stream = useStream({\n  apiUrl: "http://localhost:2024",\n  assistantId: "agent",\n  messagesKey: "messages",\n});\n\nconst handleSubmit = (text: string) => {\n  const newMessage = { type: "human" as const, content: text };\n\n  stream.submit(\n    { messages: [newMessage] },\n    {\n      optimisticValues(prev) {\n        const prevMessages = prev.messages ?? [];\n        const newMessages = [...prevMessages, newMessage];\n        return { ...prev, messages: newMessages };\n      },\n    }\n  );\n};\n\nTypeScript¶\nThe useStream() hook is friendly for apps written in TypeScript and you can specify types for the state to get better type safety and IDE support.\n// Define your types\ntype State = {\n  messages: Message[];\n  context?: Record<string, unknown>;\n};',
        type: "Document",
      },
      {
        metadata: {
          source: "https://langchain-ai.github.io/langgraph/how-tos/memory/",
          language: "",
          description: "",
          title: "Manage memory | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          loc: "https://langchain-ai.github.io/langgraph/how-tos/memory/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "dd76964b-4b2a-54b6-ab51-eaf0005e2c8b",
        },
        page_content:
          '================================== Ai Message ==================================\n\nYour name is Bob, as you mentioned when you first introduced yourself.\n\nSummarize messages¶\nAn effective strategy for handling long conversation history is to summarize earlier messages once they reach a certain threshold:\nAPI Reference: AnyMessage | count_tokens_approximately | StateGraph | START\nfrom typing import Any, TypedDict\n\nfrom langchain_core.messages import AnyMessage\nfrom langchain_core.messages.utils import count_tokens_approximately\nfrom langmem.short_term import SummarizationNode\nfrom langgraph.graph import StateGraph, START, MessagesState\n\nclass State(MessagesState):\n    context: dict[str, Any]  # (1)!\n\nclass LLMInputState(TypedDict):  # (2)!\n    summarized_messages: list[AnyMessage]\n    context: dict[str, Any]\n\nsummarization_node = SummarizationNode(\n    token_counter=count_tokens_approximately,\n    model=summarization_model,\n    max_tokens=512,\n    max_tokens_before_summary=256,\n    max_summary_tokens=256,\n)\n\ndef call_model(state: LLMInputState):  # (3)!\n    response = model.invoke(state["summarized_messages"])\n    return {"messages": [response]}\n\nbuilder = StateGraph(State)\nbuilder.add_node(call_model)\nbuilder.add_node("summarize", summarization_node)\nbuilder.add_edge(START, "summarize")\nbuilder.add_edge("summarize", "call_model")\n...\n\nWe will keep track of our running summary in the context field\n(expected by the SummarizationNode).\nDefine private state that will be used only for filtering\nthe inputs to call_model node.\nWe\'re passing a private input state here to isolate the messages returned by the summarization node\n\nFull example: summarize messages\nfrom typing import Any, TypedDict\n\nfrom langchain.chat_models import init_chat_model\nfrom langchain_core.messages import AnyMessage\nfrom langchain_core.messages.utils import count_tokens_approximately\nfrom langgraph.graph import StateGraph, START, MessagesState\nfrom langgraph.checkpoint.memory import InMemorySaver\nfrom langmem.short_term import SummarizationNode\n\nmodel = init_chat_model("anthropic:claude-3-7-sonnet-latest")\nsummarization_model = model.bind(max_tokens=128)\n\nclass State(MessagesState):\n    context: dict[str, Any]  # (1)!\n\nclass LLMInputState(TypedDict):  # (2)!\n    summarized_messages: list[AnyMessage]\n    context: dict[str, Any]\n\nsummarization_node = SummarizationNode(\n    token_counter=count_tokens_approximately,\n    model=summarization_model,\n    max_tokens=256,\n    max_tokens_before_summary=256,\n    max_summary_tokens=128,\n)\n\ndef call_model(state: LLMInputState):  # (3)!\n    response = model.invoke(state["summarized_messages"])\n    return {"messages": [response]}\n\ncheckpointer = InMemorySaver()\nbuilder = StateGraph(State)\nbuilder.add_node(call_model)\nbuilder.add_node("summarize", summarization_node)\nbuilder.add_edge(START, "summarize")\nbuilder.add_edge("summarize", "call_model")\ngraph = builder.compile(checkpointer=checkpointer)\n\n# Invoke the graph\nconfig = {"configurable": {"thread_id": "1"}}\ngraph.invoke({"messages": "hi, my name is bob"}, config)\ngraph.invoke({"messages": "write a short poem about cats"}, config)\ngraph.invoke({"messages": "now do the same but for dogs"}, config)\nfinal_response = graph.invoke({"messages": "what\'s my name?"}, config)\n\nfinal_response["messages"][-1].pretty_print()\nprint("\\nSummary:", final_response["context"]["running_summary"].summary)\n\nWe will keep track of our running summary in the context field\n(expected by the SummarizationNode).\nDefine private state that will be used only for filtering\nthe inputs to call_model node.\nWe\'re passing a private input state here to isolate the messages returned by the summarization node\n\n================================== Ai Message ==================================\n\nFrom our conversation, I can see that you introduced yourself as Bob. That\'s the name you shared with me when we began talking.',
        type: "Document",
      },
      {
        metadata: {
          loc: "https://langchain-ai.github.io/langgraph/cloud/reference/sdk/js_ts_sdk_ref/",
          description: "",
          language: "",
          title: "SDK (JS/TS) | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          source:
            "https://langchain-ai.github.io/langgraph/cloud/reference/sdk/js_ts_sdk_ref/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "b1300024-6c87-578c-9118-548ceb0b3dba",
        },
        page_content:
          'Defined in: react/stream.tsx:448\nSpecify the key within the state that contains messages.\nDefaults to "messages".\nDefault¶\n"messages"\n\nonCreated()?¶\n\noptional onCreated: (run) => void\n\nDefined in: react/stream.tsx:463\nCallback that is called when a new stream is created.\nParameters¶\nrun¶\n# run_id¶\nstring\n# thread_id¶\nstring\nReturns¶\nvoid\n\nonCustomEvent()?¶\n\noptional onCustomEvent: (data, options) => void\n\nDefined in: react/stream.tsx:475\nCallback that is called when a custom event is received.\nParameters¶\ndata¶\nGetCustomEventType\\<Bag>\noptions¶\n# mutate¶\n(update) => void\nReturns¶\nvoid\n\nonDebugEvent()?¶\n\noptional onDebugEvent: (data) => void\n\nDefined in: react/stream.tsx:499\nInternal\nCallback that is called when a debug event is received.\n This API is experimental and subject to change.\nParameters¶\ndata¶\nunknown\nReturns¶\nvoid\n\nonError()?¶\n\noptional onError: (error) => void\n\nDefined in: react/stream.tsx:453\nCallback that is called when an error occurs.\nParameters¶\nerror¶\nunknown\nReturns¶\nvoid\n\nonFinish()?¶\n\noptional onFinish: (state) => void\n\nDefined in: react/stream.tsx:458\nCallback that is called when the stream is finished.\nParameters¶\nstate¶\nThreadState\\<StateType>\nReturns¶\nvoid\n\nonLangChainEvent()?¶\n\noptional onLangChainEvent: (data) => void\n\nDefined in: react/stream.tsx:493\nCallback that is called when a LangChain event is received.\nParameters¶\ndata¶\n# data¶\nunknown\n# event¶\nstring & object | "on_tool_start" | "on_tool_stream" | "on_tool_end" | "on_chat_model_start" | "on_chat_model_stream" | "on_chat_model_end" | "on_llm_start" | "on_llm_stream" | "on_llm_end" | "on_chain_start" | "on_chain_stream" | "on_chain_end" | "on_retriever_start" | "on_retriever_stream" | "on_retriever_end" | "on_prompt_start" | "on_prompt_stream" | "on_prompt_end"\n# metadata¶\nRecord\\<string, unknown>\n# name¶\nstring\n# parent_ids¶\nstring[]\n# run_id¶\nstring\n# tags¶\nstring[]\nReturns¶\nvoid\nSee¶\nhttps://langchain-ai.github.io/langgraph/cloud/how-tos/stream_events/#stream-graph-in-events-mode for more details.\n\nonMetadataEvent()?¶\n\noptional onMetadataEvent: (data) => void\n\nDefined in: react/stream.tsx:487\nCallback that is called when a metadata event is received.\nParameters¶\ndata¶\n# run_id¶\nstring\n# thread_id¶\nstring\nReturns¶\nvoid\n\nonThreadId()?¶\n\noptional onThreadId: (threadId) => void\n\nDefined in: react/stream.tsx:509\nCallback that is called when the thread ID is updated (ie when a new thread is created).\nParameters¶\nthreadId¶\nstring\nReturns¶\nvoid\n\nonUpdateEvent()?¶\n\noptional onUpdateEvent: (data) => void\n\nDefined in: react/stream.tsx:468\nCallback that is called when an update event is received.\nParameters¶\ndata¶\nReturns¶\nvoid\n\nreconnectOnMount?¶\n\noptional reconnectOnMount: boolean | () => RunMetadataStorage\n\nDefined in: react/stream.tsx:512\nWill reconnect the stream on mount\n\nthreadId?¶\n\noptional threadId: null | string\n\nDefined in: react/stream.tsx:504\nThe ID of the thread to fetch history and current values from.\n\n@langchain/langgraph-sdk\n\n@langchain/langgraph-sdk / MessageMetadata\nType Alias: MessageMetadata\\<StateType>¶\n\nMessageMetadata\\<StateType>: object\n\nDefined in: react/stream.tsx:169\nType Parameters¶\n• StateType extends Record\\<string, unknown>\nType declaration¶\nbranch¶\n\nbranch: string | undefined\n\nThe branch of the message.\nbranchOptions¶\n\nbranchOptions: string[] | undefined\n\nThe list of branches this message is part of.\nThis is useful for displaying branching controls.\nfirstSeenState¶\n\nfirstSeenState: ThreadState\\<StateType> | undefined\n\nThe first thread state the message was seen in.\nmessageId¶\n\nmessageId: string\n\nThe ID of the message used.',
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://python.langchain.com/docs/integrations/document_loaders/docusaurus/",
          description:
            "Docusaurus is a static-site generator which provides out-of-the-box documentation features.",
          language: "en",
          title: "Docusaurus | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/integrations/document_loaders/docusaurus/",
          lastmod: null,
          content_type: null,
          uuid: "8ca8dfbc-51cb-5b5a-9870-a1203e464dfc",
        },
        page_content:
          "of knowledge or computation. This can include Python REPLs, embeddings, search engines, and more. LangChain provides a large collection of common utils to use in your application.\\\\nChains: Chains go beyond just a single LLM call, and are sequences of calls (whether to an LLM or a different utility). LangChain provides a standard interface for chains, lots of integrations with other tools, and end-to-end chains for common applications.\\\\nIndexes: Language models are often more powerful when combined with your own text data - this module covers best practices for doing exactly that.\\\\nAgents: Agents involve an LLM making decisions about which Actions to take, taking that Action, seeing an Observation, and repeating that until done. LangChain provides a standard interface for agents, a selection of agents to choose from, and examples of end to end agents.\\\\nMemory: Memory is the concept of persisting state between calls of a chain/agent. LangChain provides a standard interface for memory, a collection of memory implementations, and examples of chains/agents that use memory.\\\\nChat: Chat models are a variation on Language Models that expose a different API - rather than working with raw text, they work with messages. LangChain provides a standard interface for working with them and doing all the same things as above.\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nUse Cases#\\\\nThe above modules can be used in a variety of ways. LangChain also provides guidance and assistance in this. Below are some of the common use cases LangChain supports.\\\\n\\\\nAgents: Agents are systems that use a language model to interact with other tools. These can be used to do more grounded question/answering, interact with APIs, or even take actions.\\\\nChatbots: Since language models are good at producing text, that makes them ideal for creating chatbots.\\\\nData Augmented Generation: Data Augmented Generation involves specific types of chains that first interact with an external datasource to fetch data to use in the generation step. Examples of this include summarization of long pieces of text and question/answering over specific data sources.\\\\nQuestion Answering: Answering questions over specific documents, only utilizing the information in those documents to construct an answer. A type of Data Augmented Generation.\\\\nSummarization: Summarizing longer documents into shorter, more condensed chunks of information. A type of Data Augmented Generation.\\\\nQuerying Tabular Data: If you want to understand how to use LLMs to query data that is stored in a tabular format (csvs, SQL, dataframes, etc) you should read this page.\\\\nEvaluation: Generative models are notoriously hard to evaluate with traditional metrics. One new way of evaluating them is using language models themselves to do the evaluation. LangChain provides some prompts/chains for assisting in this.\\\\nGenerate similar examples: Generating similar examples to a given input. This is a common use case for many applications, and LangChain provides some prompts/chains for assisting in this.\\\\nCompare models: Experimenting with different prompts, models, and chains is a big part of developing the best possible application. The ModelLaboratory makes it easy to do so.\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nReference Docs#\\\\nAll of LangChain’s reference documentation, in one place. Full documentation on all methods, classes, installation methods, and integration setups for LangChain.\\\\n\\\\nReference Documentation\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nLangChain Ecosystem#\\\\nGuides for how other companies/products can be used with LangChain\\\\n\\\\nLangChain Ecosystem\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nAdditional Resources#\\\\nAdditional collection of resources we think may be useful as you develop your application!\\\\n\\\\nLangChainHub: The LangChainHub is a place to share and explore other prompts, chains, and agents.\\\\nGlossary: A glossary of all related terms, papers, methods, etc. Whether implemented in LangChain or not!\\\\nGallery: A collection of our favorite projects that use LangChain. Useful for",
        type: "Document",
      },
      {
        metadata: {
          loc: null,
          language: "en",
          description: "Documentation for LangSmith",
          title: "langchain | LangSmith - v0.3.33",
          priority: null,
          changefreq: null,
          source:
            "https://docs.smith.langchain.com/reference/js/modules/langchain.html",
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "15c21102-4e3c-5e6c-a5b1-6fdeb6b05fd2",
        },
        page_content:
          "langchain | LangSmith - v0.3.33Preparing search index...The search index is not availableLangSmith - v0.3.33LangSmithlangchainModule langchain ClassesRunnableTraceable FunctionsgetLangchainCallbacksSettingsMember VisibilityProtectedInheritedExternalThemeOSLightDarkOn This PageClassesRunnableTraceableFunctionsgetLangchainCallbacksLangSmith - v0.3.33Loading...Generated using TypeDoc",
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://python.langchain.com/docs/integrations/document_loaders/docusaurus/",
          language: "en",
          description:
            "Docusaurus is a static-site generator which provides out-of-the-box documentation features.",
          title: "Docusaurus | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/integrations/document_loaders/docusaurus/",
          lastmod: null,
          content_type: null,
          uuid: "e1a60685-daa6-5c67-ae41-b5d020b140fa",
        },
        page_content:
          "Below are some of the common use cases LangChain supports.\\\\n\\\\nPersonal Assistants: The main LangChain use case. Personal assistants need to take actions, remember interactions, and have knowledge about your data.\\\\nQuestion Answering: The second big LangChain use case. Answering questions over specific documents, only utilizing the information in those documents to construct an answer.\\\\nChatbots: Since language models are good at producing text, that makes them ideal for creating chatbots.\\\\nQuerying Tabular Data: If you want to understand how to use LLMs to query data that is stored in a tabular format (csvs, SQL, dataframes, etc) you should read this page.\\\\nInteracting with APIs: Enabling LLMs to interact with APIs is extremely powerful in order to give them more up-to-date information and allow them to take actions.\\\\nExtraction: Extract structured information from text.\\\\nSummarization: Summarizing longer documents into shorter, more condensed chunks of information. A type of Data Augmented Generation.\\\\nEvaluation: Generative models are notoriously hard to evaluate with traditional metrics. One new way of evaluating them is using language models themselves to do the evaluation. LangChain provides some prompts/chains for assisting in this.\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nReference Docs#\\\\nAll of LangChain’s reference documentation, in one place. Full documentation on all methods, classes, installation methods, and integration setups for LangChain.\\\\n\\\\nReference Documentation\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nLangChain Ecosystem#\\\\nGuides for how other companies/products can be used with LangChain\\\\n\\\\nLangChain Ecosystem\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nAdditional Resources#\\\\nAdditional collection of resources we think may be useful as you develop your application!\\\\n\\\\nLangChainHub: The LangChainHub is a place to share and explore other prompts, chains, and agents.\\\\nGlossary: A glossary of all related terms, papers, methods, etc. Whether implemented in LangChain or not!\\\\nGallery: A collection of our favorite projects that use LangChain. Useful for finding inspiration or seeing how things were done in other applications.\\\\nDeployments: A collection of instructions, code snippets, and template repositories for deploying LangChain apps.\\\\nTracing: A guide on using tracing in LangChain to visualize the execution of chains and agents.\\\\nModel Laboratory: Experimenting with different prompts, models, and chains is a big part of developing the best possible application. The ModelLaboratory makes it easy to do so.\\\\nDiscord: Join us on our Discord to discuss all things LangChain!\\\\nProduction Support: As you move your LangChains into production, we’d love to offer more comprehensive support. Please fill out this form and we’ll set up a dedicated support Slack channel.\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nnext\\\\nQuickstart Guide\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n Contents\\\\n  \\\\n\\\\n\\\\nGetting Started\\\\nModules\\\\nUse Cases\\\\nReference Docs\\\\nLangChain Ecosystem\\\\nAdditional Resources\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\nBy Harrison Chase\\\\n\\\\n\\\\n\\\\n\\\\n    \\\\n      © Copyright 2023, Harrison Chase.\\\\n      \\\\n\\\\n\\\\n\\\\n\\\\n  Last updated on Mar 27, 2023.\\\\n  \\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\\\n\\', lookup_str=\\'\\', metadata={\\'source\\': \\'https://python.langchain.com/en/latest/\\', \\'loc\\': \\'https://python.langchain.com/en/latest/\\', \\'lastmod\\': \\'2023-03-27T22:50:49.790324+00:00\\', \\'changefreq\\': \\'daily\\', \\'priority\\': \\'0.9\\'}, lookup_index=0)Add custom scraping rules\\u200bThe SitemapLoader uses beautifulsoup4 for the scraping process, and it scrapes every element on the page by default. The SitemapLoader constructor accepts a custom scraping function. This feature can be helpful to tailor the scraping process to your specific needs; for example, you might want to avoid scraping headers or navigation elements. The following example shows how to develop and use a custom function to avoid navigation and header elements.Import the beautifulsoup4 library and define the",
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://python.langchain.com/docs/integrations/document_transformers/",
          description: "",
          language: "en",
          title: "Document transformers | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/integrations/document_transformers/",
          lastmod: null,
          content_type: null,
          uuid: "b033753b-d875-55b7-9ddc-665a567dfc8d",
        },
        page_content:
          "Document transformers | 🦜️🔗 LangChain\n\n[Skip to main content](#__docusaurus_skipToContent_fallback)**We are growing and hiring for multiple roles for LangChain, LangGraph and LangSmith.  Join our team!**# Document transformers",
        type: "Document",
      },
      {
        metadata: {
          loc: null,
          language: "en",
          description: "langgraph",
          title: "How to evaluate a langgraph graph | 🦜️🛠️ LangSmith",
          priority: null,
          changefreq: null,
          source:
            "https://docs.smith.langchain.com/evaluation/how_to_guides/langgraph",
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "b2aa2557-d3fc-55c9-8bc3-49f31ad6a160",
        },
        page_content: "langgraph evaluation docs",
        type: "Document",
      },
      {
        metadata: {
          source: "https://langchain-ai.github.io/langgraph/agents/memory/",
          language: "",
          description: "",
          title: "Memory | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          loc: "https://langchain-ai.github.io/langgraph/agents/memory/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "a3231b0a-f7b5-5a97-814e-aad92b57abf6",
        },
        page_content: "Memory in LangGraph",
        type: "Document",
      },
      {
        metadata: {
          source: "https://langchain-ai.github.io/langgraph/reference/",
          language: "",
          description: "",
          title: "Reference | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          loc: "https://langchain-ai.github.io/langgraph/reference/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "139efcba-0297-58d6-bb11-6b1a7dc1df15",
        },
        page_content:
          "Reference\n\nReference¶\nWelcome to the LangGraph reference docs! These pages detail the core interfaces you will use when building with LangGraph. Each section covers a different part of the ecosystem.\n\nTip\nIf you are just getting started, see LangGraph basics for an introduction to the main concepts and usage patterns.\n\nLangGraph¶\nThe core APIs for the LangGraph opens source library.\n\nGraphs: Main graph abstraction and usage.\nFunctional API: Functional programming interface for graphs.\nPregel: Pregel-inspired computation model.\nCheckpointing: Saving and restoring graph state.\nStorage: Storage backends and options.\nCaching: Caching mechanisms for performance.\nTypes: Type definitions for graph components.\nConfig: Configuration options.\nErrors: Error types and handling.\nConstants: Global constants.\nChannels: Message passing and channels.\n\nPrebuilt components¶\nHigher-level abstractions for common workflows, agents, and other patterns.\n\nAgents: Built-in agent patterns.\nSupervisor: Orchestration and delegation.\nSwarm: Multi-agent collaboration.\nMCP Adapters: Integrations with external systems.\n\nLangGraph Platform¶\nTools for deploying and connecting to the LangGraph Platform.\n\nCLI: Command-line interface for building and deploying LangGraph Platform applications.\nServer API: REST API for the LangGraph Server.\nSDK (Python): Python SDK for interacting with instances of the LangGraph Server.\nSDK (JS/TS): JavaScript/TypeScript SDK for interacting with instances of the LangGraph Server.\nRemoteGraph: Pregel abstraction for connecting to LangGraph Server instances.\nEnvironment variables: Supported configuration variables when deploying with the LangGraph Platform.",
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://docs.smith.langchain.com/evaluation/how_to_guides/langgraph",
          description: "langgraph",
          language: "en",
          title: "How to evaluate a langgraph graph | 🦜️🛠️ LangSmith",
          priority: null,
          changefreq: null,
          loc: null,
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "22cc4953-fe37-5506-bc8f-6f51a9c9c06a",
        },
        page_content: "How to evaluate a langgraph graph | 🦜️🛠️ LangSmith",
        type: "Document",
      },
      {
        metadata: {
          loc: "https://langchain-ai.github.io/langgraph/concepts/faq/",
          description: "",
          language: "",
          title: "FAQ | 🦜🕸️LangGraph",
          priority: null,
          changefreq: null,
          source: "https://langchain-ai.github.io/langgraph/concepts/faq/",
          lastmod: "2025-06-26",
          content_type: null,
          uuid: "e6aac6fd-2b99-5554-8ff8-6beb7bd67a9d",
        },
        page_content:
          "FAQ\n\nFAQ¶\nCommon questions and their answers!\nDo I need to use LangChain to use LangGraph? What’s the difference?¶\nNo. LangGraph is an orchestration framework for complex agentic systems and is more low-level and controllable than LangChain agents. LangChain provides a standard interface to interact with models and other components, useful for straight-forward chains and retrieval flows.\nHow is LangGraph different from other agent frameworks?¶\nOther agentic frameworks can work for simple, generic tasks but fall short for complex tasks bespoke to a company’s needs. LangGraph provides a more expressive framework to handle companies’ unique tasks without restricting users to a single black-box cognitive architecture.\nDoes LangGraph impact the performance of my app?¶\nLangGraph will not add any overhead to your code and is specifically designed with streaming workflows in mind.\nIs LangGraph open source? Is it free?¶\nYes. LangGraph is an MIT-licensed open-source library and is free to use.\nHow are LangGraph and LangGraph Platform different?¶\nLangGraph is a stateful, orchestration framework that brings added control to agent workflows. LangGraph Platform is a service for deploying and scaling LangGraph applications, with an opinionated API for building agent UXs, plus an integrated developer studio.\n\nFeatures\nLangGraph (open source)\nLangGraph Platform\n\nDescription\nStateful orchestration framework for agentic applications\nScalable infrastructure for deploying LangGraph applications\n\nSDKs\nPython and JavaScript\nPython and JavaScript\n\nHTTP APIs\nNone\nYes - useful for retrieving & updating state or long-term memory, or creating a configurable assistant\n\nStreaming\nBasic\nDedicated mode for token-by-token messages\n\nCheckpointer\nCommunity contributed\nSupported out-of-the-box\n\nPersistence Layer\nSelf-managed\nManaged Postgres with efficient storage\n\nDeployment\nSelf-managed\n• Cloud SaaS  • Free self-hosted  • Enterprise (paid self-hosted)\n\nScalability\nSelf-managed\nAuto-scaling of task queues and servers\n\nFault-tolerance\nSelf-managed\nAutomated retries\n\nConcurrency Control\nSimple threading\nSupports double-texting\n\nScheduling\nNone\nCron scheduling\n\nMonitoring\nNone\nIntegrated with LangSmith for observability\n\nIDE integration\nLangGraph Studio\nLangGraph Studio",
        type: "Document",
      },
      {
        metadata: {
          loc: null,
          description:
            "While, in many scenarios, it is sufficient to evaluate the final output of your task, in some cases you might want to evaluate the intermediate steps of your pipeline.",
          language: "en",
          title:
            "How to evaluate an application's intermediate steps | 🦜️🛠️ LangSmith",
          priority: null,
          changefreq: null,
          source:
            "https://docs.smith.langchain.com/evaluation/how_to_guides/evaluate_on_intermediate_steps",
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "7a54d904-6685-504b-8707-2d3f9c7cde16",
        },
        page_content:
          "Related​\n\nEvaluate a langgraph graph\nWas this page helpful?You can leave detailed feedback on GitHub.PreviousAnnotate traces and runs inlineNextHow to version a dataset1. Define your LLM pipeline2. Create a dataset and examples to evaluate the pipeline3. Define your custom evaluators4. Evaluate the pipelineRelatedCommunityTwitterGitHubDocs CodeLangSmith SDKPythonJS/TSMoreHomepageBlogLangChain Python DocsLangChain JS/TS DocsCopyright © 2025 LangChain, Inc.",
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://python.langchain.com/docs/integrations/tools/playwright/",
          description:
            "Playwright is an open-source automation tool developed by Microsoft that allows you to programmatically control and automate web browsers. It is designed for end-to-end testing, scraping, and automating tasks across various web browsers such as Chromium, Firefox, and WebKit.",
          language: "en",
          title: "PlayWright Browser Toolkit | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/integrations/tools/playwright/",
          lastmod: null,
          content_type: null,
          uuid: "e5d01409-101e-5804-a0b2-15bd5d645832",
        },
        page_content:
          'Observation: [31;1m[1;3mLangChain We value your privacy We use cookies to analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Privacy Policy Customize Reject All Accept All Customize Consent Preferences We may use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below. The cookies that are categorized as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site.... Show more Necessary Always Active Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data. Functional Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features. Analytics Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc. Performance Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors. Advertisement Advertisement cookies are used to provide visitors with customized advertisements based on the pages you visited previously and to analyze the effectiveness of the ad campaigns. Uncategorized Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet. Reject All Save My Preferences Accept All Products LangChain LangSmith LangGraph Methods Retrieval Agents Evaluation Resources Blog Case Studies Use Case Inspiration Experts Changelog Docs LangChain Docs LangSmith Docs Company About Careers Pricing Get a demo Sign up LangChain’s suite of products supports developers along each step of the LLM application lifecycle. Applications that can reason. Powered by LangChain. Get a demo Sign up for free From startups to global enterprises, ambitious builders choose LangChain products. Build LangChain is a framework to build with LLMs by chaining interoperable components. LangGraph is the framework for building controllable agentic workflows. Run Deploy your LLM applications at scale with LangGraph Cloud, our infrastructure purpose-built for agents. Manage Debug, collaborate, test, and monitor your LLM app in LangSmith - whether it\'s built with a LangChain framework or not. Build your app with LangChain Build context-aware, reasoning applications with LangChain’s flexible framework that leverages your company’s data and APIs. Future-proof your application by making vendor optionality part of your LLM infrastructure design. Learn more about LangChain Run at scale with LangGraph Cloud Deploy your LangGraph app with LangGraph Cloud for fault-tolerant scalability - including support for async background jobs, built-in persistence, and distributed task queues. Learn more about LangGraph Manage LLM performance with LangSmith Ship faster with LangSmith’s debug, test, deploy, and monitoring workflows. Don’t rely on “vibes” – add engineering rigor to your LLM-development workflow, whether you’re building with LangChain or not. Learn more about LangSmith Hear from our happy customers LangChain, LangGraph, and LangSmith help teams of all sizes, across all industries - from ambitious startups to established enterprises. “LangSmith helped us improve the accuracy and performance of Retool’s fine-tuned models. Not only did we deliver a better product by iterating with LangSmith, but we’re shipping new AI features to our users in a fraction of the time it would have taken without it.” Jamie Cuffe Head of Self-Serve and New Products “By combining the benefits of LangSmith and standing on the shoulders of a gigantic open-source community, we’re',
        type: "Document",
      },
      {
        metadata: {
          loc: "https://python.langchain.com/docs/integrations/chat/groq/",
          language: "en",
          description:
            "This will help you get started with Groq chat models. For detailed documentation of all ChatGroq features and configurations head to the API reference. For a list of all Groq models, visit this link.",
          title: "ChatGroq | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          source: "https://python.langchain.com/docs/integrations/chat/groq/",
          lastmod: null,
          content_type: null,
          uuid: "007f7f75-d3ff-5e09-bc07-52c381379291",
        },
        page_content:
          '```output\nAIMessage(content="J\'aime la programmation.", additional_kwargs={\'reasoning_content\': \'Okay, so I need to translate the sentence "I love programming." into French. Let me think about how to approach this. \\n\\nFirst, I know that "I" in French is "Je." That\\\'s straightforward. Now, the verb "love" in French is "aime" when referring to oneself. So, "I love" would be "J\\\'aime." \\n\\nNext, the word "programming." In French, programming is "la programmation." But wait, in French, when you talk about loving an activity, you often use the definite article. So, it would be "la programmation." \\n\\nPutting it all together, "I love programming" becomes "J\\\'aime la programmation." That sounds right. I think that\\\'s the correct translation. \\n\\nI should double-check to make sure I\\\'m not missing anything. Maybe I can think of similar phrases. For example, "I love reading" is "J\\\'aime lire," but when it\\\'s a noun, like "I love music," it\\\'s "J\\\'aime la musique." So, yes, using "la programmation" makes sense here. \\n\\nI don\\\'t think I need to change anything else. The sentence structure in French is Subject-Verb-Object, just like in English, so "J\\\'aime la programmation" should be correct. \\n\\nI guess another way to say it could be "J\\\'adore la programmation," using "adore" instead of "aime," but "aime" is more commonly used in this context. So, sticking with "J\\\'aime la programmation" is probably the best choice.\\n\'}, response_metadata={\'token_usage\': {\'completion_tokens\': 346, \'prompt_tokens\': 23, \'total_tokens\': 369, \'completion_time\': 1.447541218, \'prompt_time\': 0.000983386, \'queue_time\': 0.009673684, \'total_time\': 1.448524604}, \'model_name\': \'deepseek-r1-distill-llama-70b\', \'system_fingerprint\': \'fp_e98d30d035\', \'finish_reason\': \'stop\', \'logprobs\': None}, id=\'run--5679ae4f-f4e8-4931-bcd5-7304223832c0-0\', usage_metadata={\'input_tokens\': 23, \'output_tokens\': 346, \'total_tokens\': 369})\n```\n\n```python\nprint(ai_msg.content)\n```\n\n```output\nJ\'aime la programmation.\n```\n\n## Chaining​\n\nWe can [chain](/docs/how_to/sequence/) our model with a prompt template like so:\n\n```python\nfrom langchain_core.prompts import ChatPromptTemplate\n\nprompt = ChatPromptTemplate.from_messages(\n    [\n        (\n            "system",\n            "You are a helpful assistant that translates {input_language} to {output_language}.",\n        ),\n        ("human", "{input}"),\n    ]\n)\n\nchain = prompt | llm\nchain.invoke(\n    {\n        "input_language": "English",\n        "output_language": "German",\n        "input": "I love programming.",\n    }\n)\n```',
        type: "Document",
      },
      {
        metadata: {
          loc: null,
          description: "langgraph",
          language: "en",
          title: "How to evaluate a langgraph graph | 🦜️🛠️ LangSmith",
          priority: null,
          changefreq: null,
          source:
            "https://docs.smith.langchain.com/evaluation/how_to_guides/langgraph",
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "3c0a8c82-1bf6-5adb-a5e3-cb1b83fb5031",
        },
        page_content: "Reference code​",
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://docs.smith.langchain.com/evaluation/how_to_guides/multi_turn_simulation",
          description: "- Multi-turn interactions",
          language: "en",
          title: "How to simulate multi-turn interactions | 🦜️🛠️ LangSmith",
          priority: null,
          changefreq: null,
          loc: null,
          lastmod: null,
          content_type: "text/html; charset=utf-8",
          uuid: "f665c73c-6b68-5390-8511-267f15ba0dc5",
        },
        page_content: "Here's an example:",
        type: "Document",
      },
      {
        metadata: {
          loc: "https://python.langchain.com/docs/integrations/chat/qwq/",
          description:
            "This will help you get started with QwQ chat models. For detailed documentation of all ChatQwQ features and configurations head to the API reference.",
          language: "en",
          title: "ChatQwQ | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          source: "https://python.langchain.com/docs/integrations/chat/qwq/",
          lastmod: null,
          content_type: null,
          uuid: "16bcc98c-300d-58c6-b0af-89b28b090e1d",
        },
        page_content:
          '```output\nAIMessage(content="J\'aime la programmation.", additional_kwargs={\'reasoning_content\': \'Okay, the user wants me to translate "I love programming." into French. Let\\\'s start by breaking down the sentence. The subject is "I", which in French is "Je". The verb is "love", which in this context is present tense, so "aime". The object is "programming". Now, "programming" in French can be "la programmation". \\n\\nWait, should it be "programmation" or "programmation"? Let me confirm the spelling. Yes, "programmation" is correct. Now, putting it all together: "Je aime la programmation." Hmm, but in French, there\\\'s a tendency to contract "je" and "aime". Wait, actually, "je" followed by a vowel sound usually takes "j\\\'". So it should be "J\\\'aime la programmation." \\n\\nLet me double-check. "J\\\'aime" is the correct contraction for "I love". The definite article "la" is needed because "programmation" is a feminine noun. Yes, "programmation" is a feminine noun, so "la" is correct. \\n\\nIs there any other way to say it? Maybe "J\\\'adore la programmation" for "I love" in a stronger sense, but the user didn\\\'t specify the intensity. Since the original is straightforward, "J\\\'aime la programmation." is the direct translation. \\n\\nI think that\\\'s it. No mistakes there. So the final translation should be "J\\\'aime la programmation."\'}, response_metadata={\'model_name\': \'qwq-plus\'}, id=\'run-5045cd6a-edbd-4b2f-bf24-b7bdf3777fb9-0\', usage_metadata={\'input_tokens\': 32, \'output_tokens\': 326, \'total_tokens\': 358, \'input_token_details\': {}, \'output_token_details\': {}})\n```\n\n## Chaining​\n\nWe can [chain](/docs/how_to/sequence/) our model with a prompt template like so:\n\n```python\nfrom langchain_core.prompts import ChatPromptTemplate\n\nprompt = ChatPromptTemplate(\n    [\n        (\n            "system",\n            "You are a helpful assistant that translates"\n            "{input_language} to {output_language}.",\n        ),\n        ("human", "{input}"),\n    ]\n)\n\nchain = prompt | llm\nchain.invoke(\n    {\n        "input_language": "English",\n        "output_language": "German",\n        "input": "I love programming.",\n    }\n)\n```',
        type: "Document",
      },
      {
        metadata: {
          source:
            "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          description:
            "markdownify is a Python package that converts HTML documents to Markdown format with customizable options for handling tags (links, images, ...), heading styles and other.",
          language: "en",
          title: "Markdownify | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          loc: "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          lastmod: null,
          content_type: null,
          uuid: "5463127a-20dc-5f9d-bdf9-5069f7a46d06",
        },
        page_content:
          'keys to use, how to handle input)\\\\n\\\\nClarifying question:\\\\nCan you provide more details about the Super Mario game, such as level design, characters, and gameplay mechanics?&#34;\\n  },\\n  {\\n    &#34;role&#34;: &#34;user&#34;,\\n    &#34;content&#34;: &#34;{{There are 10 levels in total. The main character is a plumber named Mario, who can walk and jump. It is a classical platform game just like Super Mario. The main character moves from left to right, trying to get to the destination, where there are many obstacles and attacks from enemies in the process.}}\\\\n\\\\nIs anything else unclear? If yes, only answer in the form:\\\\n{remaining unclear areas} remaining questions.\\\\n{Next question}\\\\nIf everything is sufficiently clear, only answer \\\\&#34;Nothing more to clarify.\\\\&#34;.&#34;\\n  },\\n  {\\n    &#34;role&#34;: &#34;assistant&#34;,\\n    &#34;content&#34;: &#34;Remaining unclear areas: 2 remaining questions.\\\\nCan you provide more information about how the MVC components are split into separate files?&#34;\\n  },\\n  {\\n    &#34;role&#34;: &#34;user&#34;,\\n    &#34;content&#34;: &#34;{{Make your own assumptions and state them explicitly before starting}}&#34;\\n  }\\n]\\n</code></pre><p>Then after these clarification, the agent moved into the code writing mode with a different system message.\\nSystem message:</p>\\n<div class="prompt">\\nYou will get instructions for code to write.\\nYou will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.\\nMake sure that every detail of the architecture is, in the end, implemented as code.\\n<p>Think step by step and reason yourself to the right decisions to make sure we get it right.\\nYou will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.</p>\\n<p>Then you will output the content of each file including ALL code.\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\nFILENAME is the lowercase file name including the file extension,\\nLANG is the markup code block language for the code&rsquo;s language, and CODE is the code:</p>\\n<p>FILENAME</p>\\n<pre tabindex="0"><code class="language-LANG" data-lang="LANG">CODE\\n</code></pre><p>You will start with the &ldquo;entrypoint&rdquo; file, then go to the ones that are imported by that file, and so on.\\nPlease note that the code should be fully functional. No placeholders.</p>\\n<p>Follow a language and framework appropriate best practice file naming convention.\\nMake sure that files contain all imports, types etc. Make sure that code in different files are compatible with each other.\\nEnsure to implement all code, if you are unsure, write a plausible implementation.\\nInclude module dependency or package manager dependency definition file.\\nBefore you finish, double check that all parts of the architecture is present in the files.</p>\\n<p>Useful to know:\\nYou almost always put different classes in different files.\\nFor Python, you always create an appropriate requirements.txt file.\\nFor NodeJS, you always create an appropriate package.json file.\\nYou always add a comment briefly describing the purpose of the function definition.\\nYou try to add comments explaining very complex bits of logic.\\nYou always follow the best practices for the requested languages in terms of describing the code written as a defined\\npackage/project.</p>\\n<p>Python toolbelt preferences:</p>\\n<ul>\\n<li>pytest</li>\\n<li>dataclasses</li>\\n</ul>\\n</div>\\n<p>Conversatin samples:</p>\\n<pre tabindex="0"><code>[\\n  {\\n    &#34;role&#34;: &#34;system&#34;,\\n    &#34;content&#34;: &#34;You will get instructions for code to write.\\\\nYou will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.\\\\nMake sure that every detail of the architecture is, in the end, implemented as code.\\\\n\\\\nThink step by step and reason yourself to the',
        type: "Document",
      },
      {
        metadata: {
          loc: "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          language: "en",
          description:
            "markdownify is a Python package that converts HTML documents to Markdown format with customizable options for handling tags (links, images, ...), heading styles and other.",
          title: "Markdownify | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          source:
            "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          lastmod: null,
          content_type: null,
          uuid: "8af62e09-443d-5cc9-9c24-a8bd13563ed0",
        },
        page_content:
          'will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.\\\\\\\\nMake sure that every detail of the architecture is, in the end, implemented as code.\\\\\\\\n\\\\\\\\nThink step by step and reason yourself to the right decisions to make sure we get it right.\\\\\\\\nYou will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.\\\\\\\\n\\\\\\\\nThen you will output the content of each file including ALL code.\\\\\\\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\\\\\\\nFILENAME is the lowercase file name including the file extension,\\\\\\\\nLANG is the markup code block language for the code\\\'s language, and CODE is the code:\\\\\\\\n\\\\\\\\nFILENAME\\\\\\\\n\\`\\`\\`LANG\\\\\\\\nCODE\\\\\\\\n\\`\\`\\`\\\\\\\\n\\\\\\\\nYou will start with the \\\\\\\\\\\\"entrypoint\\\\\\\\\\\\" file, then go to the ones that are imported by that file, and so on.\\\\\\\\nPlease note that the code should be fully functional. No placeholders.\\\\\\\\n\\\\\\\\nFollow a language and framework appropriate best practice file naming convention.\\\\\\\\nMake sure that files contain all imports, types etc. Make sure that code in different files are compatible with each other.\\\\\\\\nEnsure to implement all code, if you are unsure, write a plausible implementation.\\\\\\\\nInclude module dependency or package manager dependency definition file.\\\\\\\\nBefore you finish, double check that all parts of the architecture is present in the files.\\\\\\\\n\\\\\\\\nUseful to know:\\\\\\\\nYou almost always put different classes in different files.\\\\\\\\nFor Python, you always create an appropriate requirements.txt file.\\\\\\\\nFor NodeJS, you always create an appropriate package.json file.\\\\\\\\nYou always add a comment briefly describing the purpose of the function definition.\\\\\\\\nYou try to add comments explaining very complex bits of logic.\\\\\\\\nYou always follow the best practices for the requested languages in terms of describing the code written as a defined\\\\\\\\npackage/project.\\\\\\\\n\\\\\\\\n\\\\\\\\nPython toolbelt preferences:\\\\\\\\n- pytest\\\\\\\\n- dataclasses\\\\\\\\n\\\\" }, # … same conversation as earlier, ended with \\\\"Make your own assumptions and state them explicitly before starting\\\\". { \\\\"role\\\\": \\\\"assistant\\\\", \\\\"content\\\\": \\\\"Assumptions:\\\\\\\\n1. Model: The model will contain the game\\\'s data, such as level information, character states, and enemy positions.\\\\\\\\n2. View: The view will handle the game\\\'s visuals, including rendering the game objects, backgrounds, and updating the display.\\\\\\\\n3. Controller: The controller will manage user input, such as keyboard controls, and update the model accordingly.\\\\\\\\n\\\\\\\\nWith these assumptions in mind, is there any specific aspect of the keyboard control implementation you would like me to clarify?\\\\" }, { \\\\"role\\\\": \\\\"user\\\\", \\\\"content\\\\": \\\\"Please now remember the steps:\\\\\\\\n\\\\\\\\nThink step by step and reason yourself to the right decisions to make sure we get it right.\\\\\\\\nFirst lay out the names of the core classes, functions, methods that will be necessary, As well as a quick comment on their purpose.\\\\\\\\n\\\\\\\\nThen you will output the content of each file including ALL code.\\\\\\\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\\\\\\\nFILENAME is the lowercase file name including the file extension,\\\\\\\\nLANG is the markup code block language for the code\\\'s language, and CODE is the code:\\\\\\\\n\\\\\\\\nFILENAME\\\\\\\\n\\`\\`\\`LANG\\\\\\\\nCODE\\\\\\\\n\\`\\`\\`\\\\\\\\n\\\\\\\\nPlease note that the code should be fully functional. No placeholders.\\\\\\\\n\\\\\\\\nYou will start with the \\\\\\\\\\\\"entrypoint\\\\\\\\\\\\" file, then go to the ones that are imported by that file, and so on.\\\\\\\\nFollow a language and framework appropriate best practice file naming convention.\\\\\\\\nMake sure that files contain all imports, types etc. The code should be fully functional. Make sure that code in different files',
        type: "Document",
      },
      {
        metadata: {
          loc: "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          description:
            "markdownify is a Python package that converts HTML documents to Markdown format with customizable options for handling tags (links, images, ...), heading styles and other.",
          language: "en",
          title: "Markdownify | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          source:
            "https://python.langchain.com/docs/integrations/document_transformers/markdownify/",
          lastmod: null,
          content_type: null,
          uuid: "7b547e20-3a35-5cb0-881c-341c25231f06",
        },
        page_content:
          "of the architecture is, in the end, implemented as code.\\\\nMake sure that every detail of the architecture is, in the end, implemented as code.\\\\n\\\\nThink step by step and reason yourself to the right decisions to make sure we get it right.\\\\nYou will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.\\\\n\\\\nThen you will output the content of each file including ALL code.\\\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\\\nFILENAME is the lowercase file name including the file extension,\\\\nLANG is the markup code block language for the code&#39;s language, and CODE is the code:\\\\n\\\\nFILENAME\\\\n\\`\\`\\`LANG\\\\nCODE\\\\n\\`\\`\\`\\\\n\\\\nYou will start with the \\\\&#34;entrypoint\\\\&#34; file, then go to the ones that are imported by that file, and so on.\\\\nPlease note that the code should be fully functional. No placeholders.\\\\n\\\\nFollow a language and framework appropriate best practice file naming convention.\\\\nMake sure that files contain all imports, types etc. Make sure that code in different files are compatible with each other.\\\\nEnsure to implement all code, if you are unsure, write a plausible implementation.\\\\nInclude module dependency or package manager dependency definition file.\\\\nBefore you finish, double check that all parts of the architecture is present in the files.\\\\n\\\\nUseful to know:\\\\nYou almost always put different classes in different files.\\\\nFor Python, you always create an appropriate requirements.txt file.\\\\nFor NodeJS, you always create an appropriate package.json file.\\\\nYou always add a comment briefly describing the purpose of the function definition.\\\\nYou try to add comments explaining very complex bits of logic.\\\\nYou always follow the best practices for the requested languages in terms of describing the code written as a defined\\\\npackage/project.\\\\n\\\\n\\\\nPython toolbelt preferences:\\\\n- pytest\\\\n- dataclasses\\\\n&#34;\\n  },\\n #  … same conversation as earlier, ended with &#34;Make your own assumptions and state them explicitly before starting&#34;.\\n  {\\n    &#34;role&#34;: &#34;assistant&#34;,\\n    &#34;content&#34;: &#34;Assumptions:\\\\n1. Model: The model will contain the game&#39;s data, such as level information, character states, and enemy positions.\\\\n2. View: The view will handle the game&#39;s visuals, including rendering the game objects, backgrounds, and updating the display.\\\\n3. Controller: The controller will manage user input, such as keyboard controls, and update the model accordingly.\\\\n\\\\nWith these assumptions in mind, is there any specific aspect of the keyboard control implementation you would like me to clarify?&#34;\\n  },\\n  {\\n    &#34;role&#34;: &#34;user&#34;,\\n    &#34;content&#34;: &#34;Please now remember the steps:\\\\n\\\\nThink step by step and reason yourself to the right decisions to make sure we get it right.\\\\nFirst lay out the names of the core classes, functions, methods that will be necessary, As well as a quick comment on their purpose.\\\\n\\\\nThen you will output the content of each file including ALL code.\\\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\\\nFILENAME is the lowercase file name including the file extension,\\\\nLANG is the markup code block language for the code&#39;s language, and CODE is the code:\\\\n\\\\nFILENAME\\\\n\\`\\`\\`LANG\\\\nCODE\\\\n\\`\\`\\`\\\\n\\\\nPlease note that the code should be fully functional. No placeholders.\\\\n\\\\nYou will start with the \\\\&#34;entrypoint\\\\&#34; file, then go to the ones that are imported by that file, and so on.\\\\nFollow a language and framework appropriate best practice file naming convention.\\\\nMake sure that files contain all imports, types etc. The code should be fully functional. Make sure that code in different files are compatible with each other.\\\\nBefore you finish, double check that all parts of the architecture",
        type: "Document",
      },
      {
        metadata: {
          loc: "https://python.langchain.com/docs/integrations/document_loaders/vsdx/",
          description:
            "A visio file (with extension .vsdx) is associated with Microsoft Visio, a diagram creation software. It stores information about the structure, layout, and graphical elements of a diagram. This format facilitates the creation and sharing of visualizations in areas such as business, engineering, and computer science.",
          language: "en",
          title: "Vsdx | 🦜️🔗 LangChain",
          priority: "0.5",
          changefreq: "weekly",
          source:
            "https://python.langchain.com/docs/integrations/document_loaders/vsdx/",
          lastmod: null,
          content_type: null,
          uuid: "d5d729de-2e73-5bae-8912-dcd1a4dd5969",
        },
        page_content:
          '------ Page 5 ------\nTitle page : next page after previous one\nSource : ./example_data/fake.vsdx\n\n==> CONTENT <== \nCreated by\nCreated the\nModified by\nModified the\nVersion\nTitle\nFlorian MOREL\n2024-01-14\nFLORIAN Morel\nToday\n0.0.0.0.0.1\nThis is a title\nAnother RED arrow wow\nArrow with point but red\nGreen line\nUser\nCaptions\nRed arrow magic !\nSomething white\nSomething Red\nThis a a completly useless diagramm, cool !!\n\nBut this is for example !\nThis diagramm is a base of many pages in this file. But it is editable in file \\"BG WITH CONTENT\\"\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor\n\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0\\u00a0-\\u00a0incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n\nvoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa\n*\n\nqui officia deserunt mollit anim id est laborum.\n\n------ Page 6 ------\nTitle page : Connector Page\nSource : ./example_data/fake.vsdx\n\n==> CONTENT <== \nCreated by\nCreated the\nModified by\nModified the\nVersion\nTitle\nFlorian MOREL\n2024-01-14\nFLORIAN Morel\nToday\n0.0.0.0.0.1\nThis is a title\nSomething white\nSomething Red\nThis a a completly useless diagramm, cool !!\n\nBut this is for example !\nThis diagramm is a base of many pages in this file. But it is editable in file \\"BG WITH CONTENT\\"\n\n------ Page 7 ------\nTitle page : Useful ↔ Useless page\nSource : ./example_data/fake.vsdx\n\n==> CONTENT <== \nCreated by\nCreated the\nModified by\nModified the\nVersion\nTitle\nFlorian MOREL\n2024-01-14\nFLORIAN Morel\nToday\n0.0.0.0.0.1\nThis is a title\nSomething white\nSomething Red\nThis a a completly useless diagramm, cool !!\n\nBut this is for example !\nThis diagramm is a base of many pages in this file. But it is editable in file \\"BG WITH CONTENT\\"\nTitle of this document : BLABLABLA\n\n------ Page 8 ------\nTitle page : Alone page\nSource : ./example_data/fake.vsdx\n\n==> CONTENT <== \nBlack cloud\nUnidirectional traffic primary path\nUnidirectional traffic backup path\nEncapsulation\nUser\nCaptions\nBidirectional traffic\nAlone, sad\nTest of another page\nThis is a \\"bannier\\"\nTests of some exotics characters :\\u00a0\\u00e3\\u00e4\\u00e5\\u0101\\u0103 \\u00fc\\u2554\\u00a0 \\u00a0\\u00bc \\u00c7 \\u25d8\\u25cb\\u2642\\u266b\\u2640\\u00ee\\u2665\nThis is ethernet\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nThis is an empty case\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor\n\\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0 \\u00a0-\\u00a0 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n\n voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa \n*',
        type: "Document",
      },
    ],
    answer:
      "MessagesState est un état préconstruit dans LangGraph qui facilite l’utilisation d’une liste de messages dans l’état du graphe. Il est défini avec une seule clé appelée `messages`, qui est une liste d’objets de type `AnyMessage` de LangChain, et utilise la fonction réductrice `add_messages` pour gérer les mises à jour de cette liste.\n\nPoints clés concernant MessagesState :\n\n- **Structure :** Il contient uniquement la clé `messages`, qui stocke une liste de messages (comme `HumanMessage`, `AIMessage`, etc.) de LangChain.\n\n- **Fonction réductrice `add_messages` :** Cette fonction est utilisée pour mettre à jour la liste des messages dans l’état. Elle permet d’ajouter de nouveaux messages à la liste existante, mais gère aussi les mises à jour des messages déjà présents en identifiant ceux-ci par leur ID afin d’éviter les doublons ou les écrasements incorrects.\n\n- **Sérialisation et désérialisation :** La fonction `add_messages` s’occupe également de la désérialisation automatique des messages reçus, convertissant les données au format JSON en objets message de LangChain, ce qui facilite l’envoi et la réception des messages dans l’état du graphe.\n\n- **Usage courant :** Comme maintenir une liste de messages est une nécessité fréquente dans les applications de chat et les agents conversationnels, MessagesState offre une manière simple et standardisée de gérer cet aspect de l’état.\n\n- **Extensibilité :** En général, MessagesState est étendu pour inclure d’autres champs dans l’état, en plus des messages, selon les besoins de l’application.\n\nExemple simplifié de définition :\n\n```python\nfrom langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    # On peut ajouter d’autres champs ici\n    pass\n```\n\nAinsi, MessagesState est une base pratique pour gérer l’historique des messages dans les graphes LangGraph, garantissant que les messages sont correctement accumulés et mis à jour dans l’état de l’application[2].",
    query: "Traduis ton message en français",
  },
};
