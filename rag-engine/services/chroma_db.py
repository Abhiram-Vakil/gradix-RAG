import chromadb
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection
from fastapi import Depends
from dotenv import load_dotenv
import os

load_dotenv()

_client: ClientAPI | None = None
_collection: Collection | None = None

def get_chroma_client() -> ClientAPI:
    global _client
    if _client is None:
        try:
            _client = chromadb.CloudClient(
                api_key=os.getenv("CHROMA_API_KEY"),
                tenant=os.getenv("CHROMA_TENANT"),
                database=os.getenv("CHROMA_DATABASE")
            )
        except Exception as e:
            print(f"❌ Error initializing Chroma Client: {e}")
            raise e
    return _client

def get_chroma_collection(client: ClientAPI = None) -> Collection:
    global _collection
    if _collection is None:
        if client is None:
            client = get_chroma_client()
        try:
            _collection = client.get_or_create_collection(
                name="gradix_knowledge_base",
            )
        except Exception as e:
            print(f"❌ Error getting collection: {e}")
            raise e
    return _collection

def check_db_connection():
    """
    Simple heartbeat check to verify connection on startup.
    """
    try:
        print("🔄 Connecting to ChromaDB...")
        client = get_chroma_client()
        client.heartbeat() # Most clients support this or list_collections
        print("✅ ChromaDB Connected Successfully!")
        return True
    except Exception as e:
        print(f"❌ ChromaDB Connection Failed: {e}")
        return False

def upsert_documents(documents: list[str], metadatas: list[dict], ids: list[str]):
    """
    Upserts documents into the ChromaDB collection.
    """
    collection = get_chroma_collection()
    try:
        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"✅ Upserted {len(documents)} documents successfully.")
    except Exception as e:
        print(f"❌ Error upserting documents: {e}")
        raise e

def query_knowledge_base(query_text: str, n_results: int = 5):
    """
    Queries the knowledge base for relevant documents.
    """
    collection = get_chroma_collection()
    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results
    except Exception as e:
        print(f"❌ Error querying knowledge base: {e}")
        return None
