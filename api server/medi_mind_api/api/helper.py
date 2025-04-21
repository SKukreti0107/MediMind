from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_google_genai import GoogleGenerativeAIEmbeddings


def load_pdf_file():
    try:
        print("Starting PDF loading...")
        loader = PyPDFLoader("Data/Med_Book.pdf")
        documents = loader.load()
        print(f"Successfully loaded PDF with {len(documents)} pages")
        return documents
    except KeyboardInterrupt:
        print("\nPDF loading interrupted by user. Please wait for cleanup...")
        raise
    except Exception as e:
        print(f"Error loading PDF: {str(e)}")
        raise


def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=150)
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks







def gemini_api_embeddings():
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    return embeddings
