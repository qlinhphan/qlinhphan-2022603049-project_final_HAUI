from agent_check_input import agent_check_inputs
from agent_recommend_via_rag import agent_recommend_via_rags
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()

def main():
    agent_check_inp = agent_check_inputs()
    agent_rag = agent_recommend_via_rags()

    def I(state):
        ag = agent_check_inp.invoke({
            "input": state["question"]
        })

        return {
            "check_inp": ag['output']
        }

        # state['check_inp'] = ag['output']
        # return state

    def R(state):
        ag = agent_rag.invoke({
            "input": state["check_inp"]
        })

        return {
            "recommend_rag": ag["output"]
        }
        # state["recommend_rag"] = ag["output"]
        # return state
    
    graph = StateGraph(dict)

    graph.add_node('i', I)
    graph.add_node('r', R)

    graph.set_entry_point('i')
    graph.add_edge('i', 'r')
    graph.set_finish_point('r')

    app = graph.compile(checkpointer=memory)

    while True:
        inp_user = input("Bạn: ")

        if inp_user == "bye":
            print("ok bye!")
            break

        rs = app.invoke({"question": inp_user}, config={"configurable": {"thread_id": "1"}})
        print("AI ASSISTANT: ", rs['recommend_rag'])

main()

# python main.py