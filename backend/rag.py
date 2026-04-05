import chromadb
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENAI_KEY")

chroma = chromadb.Client()
collection = chroma.get_or_create_collection(name="docs")


def embed_text(text):
    res = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return res.data[0].embedding


def add_to_vector_db(doc_id, text, user_id):
    embedding = embed_text(text)

    collection.add(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[{"user_id": user_id}]
    )


def query_docs(query, user_id):
    query_embedding = embed_text(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    docs = []
    for i, meta in enumerate(results["metadatas"][0]):
        if meta["user_id"] == user_id:
            docs.append(results["documents"][0][i])

    return docs


def generate_answer(question, context_docs):
    context = "\n\n".join(context_docs)

    prompt = f"""
    You are an AI assistant.

    Use the context below to answer.

    Context:
    {context}

    Question:
    {question}
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content
