from agent_check_input import agent_check_inputs
from agent_recommend_via_rag import agent_recommend_via_rags
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver
from agent_analysist_ad_dis import agent_analytical_ad_dis
from langgraph.graph import END
memory = MemorySaver()

def main():
    agent_check_inp = agent_check_inputs()
    agent_rag = agent_recommend_via_rags()
    agent_ana = agent_analytical_ad_dis()

    def I(state):
        ag = agent_check_inp.invoke({
            "input": state["question"]
        })

        return {
            "check_inp": ag['output'],
            "dif": state.get("dif", "")
        }

        # state['check_inp'] = ag['output']
        # return state

    def R(state):
        text = state['check_inp'].lower()

        if any(k not in text for k in ['name','age','gender','area']):
            return {
                "check_inp": state['check_inp'],
                "recommend_rag": "no rag"
            }

        ag = agent_rag.invoke({
            "input": state["check_inp"],
        })

        return {
            "check_inp": state['check_inp'],
            "recommend_rag": ag["output"],
            "dif": state.get("dif", "")
        }
    
    def route(state):
        dif = state.get('dif') or ""

        if "có" in dif.lower():
            return "a"
        return END

    def A(state):
        ag = agent_ana.invoke({
            "input": state["recommend_rag"]
        })

        return {
            "ana": ag["output"]
        }
    
    graph = StateGraph(dict)

    graph.add_node('i', I)
    graph.add_node('r', R)
    graph.add_node('a', A)


    graph.set_entry_point('i')
    graph.add_edge('i', 'r')

    graph.add_conditional_edges(
        "r",
        route,
        {
            "a": "a",
            END: END
        }

    )
    # graph.add_edge('r', 'recom')
    # graph.set_finish_point('recom')

    app = graph.compile(checkpointer=memory)

    while True:
        inp_user = input("Bạn: ")

        if inp_user == "bye":
            print("ok bye!")
            break

        rs = app.invoke({"question": inp_user}, config={"configurable": {"thread_id": "2"}})
        # print("AI ASSISTANT: ", rs['recommend_rag'])

        print("=======================================================")
        print("OK: ", rs)
        print("=======================================================")

        if rs['recommend_rag'] == 'no rag':
            print("AI ASSISTANT: ", rs['check_inp'])
        # else rs['recommend_rag'] != 'no rag':
        else:
            print("AI ASSISTANT: ", rs['recommend_rag'])
            dif = input("Bạn có muốn phân tích ưu/nhược của các phương pháp này không (có/không)?")
            rs = app.invoke({"question": inp_user, "dif": dif}, config={"configurable": {"thread_id": "2"}})
            if "ana" in rs:
                print("AI ASSISTANT: ", rs['ana'])


if __name__ == "__main__":
    main()

# python main.py