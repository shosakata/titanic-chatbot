import os


def generate_text_only(new_text, done_list):
    conversation = [{"role": "system", "content": "You are a helpful assistant."}]
    for i, text in enumerate(done_list):
        if i % 2 == 0:
            conversation.append({"role": "user", "content": text})
        elif i % 2 == 1:
            conversation.append({"role": "assistant", "content": text})
    conversation.append({"role": "user", "content": new_text})
    return conversation

def get_text_response(engine, new_text, done_list, api_key):

    os.environ["OPENAI_API_KEY"] = api_key
    from openai import OpenAI
    client = OpenAI()

    conversation = generate_text_only(new_text, done_list)
    try:
        # Make a request to the API using the chat-based endpoint with conversation context
        # generated_text = openai.ChatCompletion.create(model=engine, messages=conversation)
        generated_text = client.chat.completions.create(
            model=engine,
            temperature=0,
            messages=conversation
            )
        # Extract the response
        response = generated_text.choices[0].message.content
        
        # Return the response
        return response
    except Exception as e:
        print(f"Error Generating Response: {e}")
        return None
