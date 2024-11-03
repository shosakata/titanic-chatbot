import os

from langchain_community.utilities import SQLDatabase
# from langchain.agents import create_sql_agent
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_openai import ChatOpenAI

from langdetect import detect

def get_sql_response(engine, new_text, db_uri, api_key):

    os.environ["OPENAI_API_KEY"] = api_key

    db = SQLDatabase.from_uri(db_uri)
    llm = ChatOpenAI(model=engine, temperature=0)
    # agent_executor = create_sql_agent(llm, db=db, verbose=True,agent_executor_kwargs = {"return_intermediate_steps": True})
    # response  = agent_executor.invoke({"input": new_text})
    agent_executor = create_sql_agent(llm, db=db, verbose=True)
    response  = agent_executor.invoke(new_text)["output"]
    final_response = translate_language(new_text, response, llm)

    return final_response

def translate_language(input_text, output_text, llm):
    # check the difference of language
    try:
        if detect(input_text) != detect(output_text):
            messages = [
                {"role": "system", "content": f"You are a helpful assistant that translates {detect(output_text)} to {detect(input_text)}. Translate the user sentence."},
                {"role": "user", "content": output_text}
            ]
            translated_msg = llm.invoke(messages)
            return_val = translated_msg.content
        else:
            return_val = output_text
    except:
        return_val = output_text

    return return_val
        

