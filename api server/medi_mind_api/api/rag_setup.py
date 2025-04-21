
import os
import sys
from dotenv import load_dotenv
from datetime import datetime, timedelta


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'lib')))


load_dotenv()


from api.helper import gemini_api_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever
from langchain_core.messages import AIMessage, HumanMessage



embeddings = gemini_api_embeddings()
index_name = "medi-mind-multi"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-001", 
    temperature=0.2,
    max_tokens=1024,
    timeout=120,
    max_retries=3,
    top_p=0.7,
    top_k=50,
    frequency_penalty=0.2,
    presence_penalty=0.1
)

system_prompt = """
        You are a highly knowledgeable medical assistant specializing in symptom analysis, diagnosis guidance, and treatment recommendations. Your goal is to provide concise, context-aware, and natural responses based on the user's query.

    User has reported: {input}
    medical references: {context}

    Response Rules:
    Determine Query Type:

    Symptom-based Inquiry (User asks for causes/diagnosis) → Use structured analysis (Symptoms, Context, Differential Diagnosis, Next Steps).

    Treatment/Remedy Inquiry (User asks for relief/medication recommendations) → Answer clearly, conversationally, and avoid excessive step-by-step formatting unless necessary.

    Make Responses Feel Natural:

    Avoid rigid sectioning like “Immediate Relief” or “Medications.”

    Smoothly integrate advice instead of listing steps formally.

    Use everyday language (e.g., "safe to take" instead of "not contraindicated").

    Be Direct and Practical:

    Provide only necessary details—don’t over-explain common treatments unless asked.

    Medication suggestions should be general unless the user specifically asks for dosages.

    Follow-up guidance should be straightforward and only included when relevant.
    Important -> Never mention the medical references in the response as "the text" or "the references" given.Eg Do not do this :The text provided suggests several possible causes based on your symptoms:

        Output Format

        Strictly in Markdown: All responses must use Markdown syntax (headings, lists, bold/italic, etc.) for structure and emphasis.

"""

contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", "Given the conversation history, help me understand the user's question better to find relevant medical information. Consider symptoms, conditions, or treatments mentioned previously."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
])

history_aware_retriever_chain = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
])

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever_chain, question_answer_chain)




chat_history_store = {} 
last_interaction_times = {} 
CHAT_TIMEOUT_MINUTES = 15 

def get_chat_history(chat_id):
    """Retrieves and manages chat history for a specific chat_id."""
    global chat_history_store, last_interaction_times
    current_time = datetime.now()

    if chat_id not in chat_history_store:
        chat_history_store[chat_id] = []
        last_interaction_times[chat_id] = current_time
        return []

    
    if current_time - last_interaction_times.get(chat_id, current_time) > timedelta(minutes=CHAT_TIMEOUT_MINUTES):
        print(f"Chat history for {chat_id} cleared due to inactivity.")
        chat_history_store[chat_id] = [] 
    
    last_interaction_times[chat_id] = current_time 
    return chat_history_store[chat_id]

def add_to_chat_history(chat_id, human_message, ai_message):
    """Adds messages to the specific chat's history."""
    global chat_history_store
    if chat_id not in chat_history_store:
        chat_history_store[chat_id] = []
    chat_history_store[chat_id].extend([human_message, ai_message])
    
    
    
    

