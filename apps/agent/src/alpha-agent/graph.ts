import { AIMessage } from '@langchain/core/messages'
import { RunnableConfig } from '@langchain/core/runnables'
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'

import { ConfigurationSchema, ensureConfiguration } from './configuration.js'
import { TOOLS } from './tools.js'
import { loadChatModel } from './utils.js'

async function callModel(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig
): Promise<typeof MessagesAnnotation.Update> {
  const configuration = ensureConfiguration(config)

  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS)

  const response = await model.invoke([
    {
      role: 'system',
      content: configuration.systemPromptTemplate.replace(
        '{system_time}',
        new Date().toISOString()
      ),
    },
    ...state.messages,
  ])

  return { messages: [response] }
}

function routeModelOutput(state: typeof MessagesAnnotation.State): string {
  const messages = state.messages
  const lastMessage = messages[messages.length - 1]
  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return 'tools'
  } else {
    return '__end__'
  }
}

const workflow = new StateGraph(MessagesAnnotation, ConfigurationSchema)
  .addNode('callModel', callModel)
  .addNode('tools', new ToolNode(TOOLS))
  .addEdge('__start__', 'callModel')
  .addConditionalEdges('callModel', routeModelOutput)
  .addEdge('tools', 'callModel')

export const graph = workflow.compile({
  interruptBefore: [],
  interruptAfter: [],
})
