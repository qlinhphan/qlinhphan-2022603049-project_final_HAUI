from agent_check_input import agent_check_inputs
from agent_recommend_via_rag import agent_recommend_via_rags
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver
from agent_analysist_ad_dis import agent_analytical_ad_dis
from langgraph.graph import END
memory = MemorySaver()

def main():
    agent_check = agent_check_inputs()
    agent_recommend =  agent_recommend_via_rags()
    agent_ana = agent_analytical_ad_dis()

    def C(state):
        if 'check' in state.keys():
            return state

        rs = agent_check.invoke({
            "input": state['ques']
        })

        return {
            "check": rs['output']
        }
    
    def R(state):
        if 'recom' in state.keys():
            return state

        rs = agent_recommend.invoke({
            "input": state['check']
        })
        return {
            "check": state['check'],
            "recom": rs['output']
        }
    
    def route_re(state):
        if state['check'].lower().__contains__("age") and state['check'].lower().__contains__("area") and state['check'].lower().__contains__("name") and state['check'].lower().__contains__("gender"):
            return 'r'
        else:
            return END
        
    def A(state):
        rs = agent_ana.invoke({
            "input": state['recom']
        })
        return {
            "check": state['check'],
            "recom": state['recom'],
            "ana": rs['output']
        }
    
    def route_ana(state):
        user_rep = state.get('rep', '').lower()
        if user_rep.__contains__('có'):
            return 'a'
        else:
            return END

    grap = StateGraph(dict)

    grap.add_node('c', C)
    grap.add_node('r', R)
    grap.add_node('a', A)

    grap.set_entry_point('c')
    grap.add_conditional_edges(
        'c', 
        route_re,
        {
            'r': 'r',
            END: END
        }
    )
    grap.add_conditional_edges(
        'r',
        route_ana,
        {
            'a': 'a',
            END: END
        }
    )


    app = grap.compile(checkpointer=memory)

    while True:
        ques = input("Bạn: ")
        if ques == 'bye':
            print("AI: ", 'ok bye!')
            break

        rs = app.invoke({"ques": ques}, config={"configurable": {"thread_id": 2}})

        if 'recom' not in rs.keys():
            print("AI: ", rs['check'])

        if 'recom' in rs.keys() and 'ana' not in rs.keys():
            print("AI: ", rs['recom'])
            
            quest = input("Bạn có muốn phân tích ưu điểm, nhược điểm của các phương pháp này?(có/không)")

            rs1 = app.invoke({"ques": ques, 'rep': quest, 'check':rs['check'], 'recom':  rs['recom']}, config={"configurable": {"thread_id": 2}})
            if 'ana' in rs1.keys():
                print("AI: ", rs1['ana'])


if __name__ == '__main__':
    main()

# python main_different.py

# Bệnh nhân 99 tuổi mắc khối u glioma, giới tính nữ và diện tích khối u là 10000