from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

import pandas as pd
import numpy as np

from sentence_transformers import SentenceTransformer
import torch
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

### recommendation code ###
df = pd.read_csv("netflix_titles.csv")
df.drop(columns=['show_id', 'date_added'], axis=1, inplace=True)
df.rename(columns={"type":"Type", "title":"Title", "director":"Director Name",
                  "cast":"Cast", "country":"Country", "release_year": "Release Year", "rating":"Rating",
                  "duration":"Duration", "listed_in":"Genre", "description":"Description"}, inplace=True)
df.fillna('', inplace = True)
df["Combined Text"] = df["Type"] + " " + df["Title"] + " " + df["Director Name"] + " " + df["Cast"] + " " + df["Country"] + " " + df["Release Year"].astype(str) + " " + df["Rating"] + " " + df["Duration"] + " " + df["Genre"] + " " + df["Description"]
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['Combined Text']) #returns tfidf-weighted document-term matrix
# create matrix to determine the correlation of the movies
cosine_sim = cosine_similarity(tfidf_matrix)
indices = pd.Series(df.index,index=df['Title'].str.lower())
model = SentenceTransformer('paraphrase-distilroberta-base-v1')
des_embeddings = np.load('description_embeddings.npy')
### recommendation code ###

# q = movie title
@app.get("/search")
def get_recommendations(q: Union[str, None] = None):
    #Compute cosine-similarities with all embeddings 
    query = df.loc[df['Title'].str.lower() == q]['Description'].to_list()[0]
    query_embedd = model.encode(query)
    cosine_scores = util.pytorch_cos_sim(query_embedd, des_embeddings)
    top10_matches = torch.argsort(cosine_scores, dim=-1, descending=True).tolist()[0][1:11]
    results = []
    for i in top10_matches:
        results.append({"Title": df['Title'].iloc[i], 
                        "Genre": df['Genre'].iloc[i], 
                        "Description": df['Description'].iloc[i]})
    return results
    # return df.loc[top10_matches, ['Title', 'Description', 'Genre']]



    # idx = indices[q]
    # sim_scores = list(enumerate(cosine_sim[idx]))
    # sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # sim_scores = sim_scores[1:11]
    # movie_indices = [i[0] for i in sim_scores]
    # results = []
    # for i in movie_indices:
    #     results.append({"Title": df['Title'].iloc[i], 
    #                     "Genre": df['Genre'].iloc[i], 
    #                     "Description": df['Description'].iloc[i]})
    # return results
