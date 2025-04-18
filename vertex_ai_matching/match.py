import pandas as pd
from vertexai.language_models import TextEmbeddingModel
from sklearn.metrics.pairwise import cosine_similarity
from vertex_ai_matching.utils.load_candidates_from_sheet import load_candidates_from_sheet
import os

# === Load CSV ===
CANDIDATE_CSV_PATH = "vertex_ai_matching/data/candidates.csv"

sheet_id = "your_google_sheet_id_here"
candidates_df = load_candidates_from_sheet(sheet_id)


# === Define Job Post ===
job_text = """
Job Title: Frontend Developer.
Required Skills: JavaScript, React, HTML, CSS.
Experience Required: 1-3 years.
Job Location: Bangalore.
Job Description: We are looking for a React developer to build dynamic UIs for our web apps. 
Experience with REST APIs and responsive design is a plus.
"""

# === Build Text Representation for Each Candidate ===
def build_candidate_text(row):
    # Prioritize skills first, then job title/experience
    return f"""
    Skills: {row['skills']}.
    Preferred Role: {row['preferred_role']}.
    Experience: {row['experience']}.
    Candidate Name: {row['name']}.
    Education: {row['education']}.
    Location: {row['location']}.
    """

# === Prepare Embeddings ===
print("🔍 Getting embeddings from Vertex AI...")
model = TextEmbeddingModel.from_pretrained("text-embedding-005")
job_embedding = model.get_embeddings([job_text])[0].values

candidate_texts = candidates_df.apply(build_candidate_text, axis=1).tolist()
candidate_embeddings = model.get_embeddings(candidate_texts)

# === Compute Similarity Scores ===
similarity_scores = []
for i, cand_emb in enumerate(candidate_embeddings):
    score = cosine_similarity([cand_emb.values], [job_embedding])[0][0]
    similarity_scores.append((candidates_df.iloc[i]['name'], score))

# === Sort and Display ===
ranked = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

print("\n🏆 Ranked Candidates for Job Match:\n")
for i, (name, score) in enumerate(ranked, 1):
    print(f"{i}. {name} → Similarity Score: {score:.4f}")
