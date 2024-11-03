import os

from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_csv_agent


from langdetect import detect

def get_csv_response(engine, new_text, csv_file, api_key):

    os.environ["OPENAI_API_KEY"] = api_key

    llm = ChatOpenAI(model=engine, temperature=0)
    agent_executor = create_csv_agent(llm, csv_file, verbose=True, allow_dangerous_code=True)
    response  = agent_executor.run(new_text)
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
        

