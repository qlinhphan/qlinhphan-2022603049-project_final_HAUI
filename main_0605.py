from agent_check_input import agent_check_inputs
from agent_recommend_via_rag import agent_recommend_via_rags
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver
from agent_analysist_ad_dis import agent_analytical_ad_dis
from langgraph.graph import END
memory = MemorySaver()

def actions():
    agent_check = agent_check_inputs()
    agent_rag = agent_recommend_via_rags()
    agent_ana = agent_analytical_ad_dis()

    def C(state):
        if state['ques'] == 'co':
            print('bo qua node check')
            return {
                "ques": state['ques'],
                "check": state['check'],
                'rag': state['rag']
            }

        ag = agent_check.invoke({
            "input": state['ques']
        })

        return {
            "ques": state['ques'],
            "check": ag['output']
        }
    
    def R(state):
        if state['ques'] == 'co':
            print('bo qua node recomm')
            return {
                'ques': state['ques'],
                "check": state['check'],
                'rag': state['rag']
            }
        ag = agent_rag.invoke({
            "input": state['check']
        })
        return {
            'ques': state['ques'],
            "check": state['check'],
            'rag': ag['output']
        }
    
    def routeRag(state):
        if state['check'].__contains__("age"):
            return 'r'
        else:
            return END
        
    def A(state):
        ag = agent_ana.invoke({
            "input": state['rag']
        })
        return {
            'ques': state['ques'],
            "check": state['check'],
            'rag': state['rag'],
            "ana": ag['output']
        }

    def routeA(state):
        if state['ques'] == 'co':
            return 'a'
        else:
            return END
    
    graph = StateGraph(dict)
    
    graph.add_node('c', C)
    graph.add_node('r', R)
    graph.add_node('a', A)

    graph.set_entry_point('c')
    graph.add_conditional_edges(
        'c',
        routeRag,
        {
            'r': 'r',
            END: END
        }
    )
    graph.add_conditional_edges(
        'r',
        routeA,
        {
            'a': 'a',
            END: END
        }
    )
    # graph.add_conditional_edges(
    #     'r',
    #     routeA,
    #     {
    #         'a': 'a',
    #         END: END
    #     }
    # )

    app = graph.compile(checkpointer=memory)

    while True:
        inp = input("YOU: ")

        if inp == "ok": break

        rs = app.invoke({"ques": inp}, config={'configurable': {'thread_id': '3'}})

        print('KEYS: ', rs.keys())
        print(rs)

        if 'rag' in rs.keys():
            us = input("Ban co muon phan tich uu/nhuoc cua cac phuong phap nay? ")
            if us == "co":
                rs = app.invoke({"ques": us, 'check': rs['check'], 'rag': rs['rag']}, config={'configurable': {'thread_id': '3'}})
                print(rs)
            else: END
            


if __name__ == "__main__":
    actions()


# python main_0605.py
# Bệnh nhân giới tính nữ, 98 tuổi. Mắc khối u glioma, diện tích 9000

