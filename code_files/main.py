from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)

# Define a root endpoint

@app.get("/")
async def read_root():
    return {"message": "Hello!"}

origins = ["http://localhost:3000"]

# Configure CORS middleware to allow requests from specified origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration and connection

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "270801",
    "database": "history",
}

conn = mysql.connector.connect(**db_config)

cursor = conn.cursor()

# Create table

create_table_query = """
    CREATE TABLE IF NOT EXISTS nfts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        is_bought BOOLEAN NOT NULL,
        is_sold BOOLEAN NOT NULL
    )
"""
cursor.execute(create_table_query)
cursor.close()

def get_db():
    return conn

# Convert the result to a list of dictionaries
def convert_result_to_list(cursor):
    return [dict(zip(cursor.column_names, row)) for row in cursor.fetchall()]

@app.on_event("shutdown")
async def shutdown_db_connection(db: mysql.connector.MySQLConnection = Depends(get_db)):
    db.close()

class CreateNFTRequest(BaseModel):
    name: str
    description: str
    price: float

class NFTResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    is_bought: bool
    is_sold: bool

@app.post("/nfts/", response_model=NFTResponse)
async def create_nft(nft: CreateNFTRequest, db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    insert_query = "INSERT INTO nfts (name, description, price, is_bought, is_sold) VALUES (%s, %s, %s, %s, %s)"
    data = (nft.name, nft.description, nft.price, False, False)
    cursor.execute(insert_query, data)
    db.commit()
    nft_id = cursor.lastrowid
    cursor.close()

    return {
        "id": nft_id,
        **nft.dict(),
        "is_bought": False,
        "is_sold": False
    }

# Endpoint to mark an NFT as bought

@app.post("/buy-nft/{nft_id}")
def buy_nft(nft_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    buy = "NFT bought successfully!"
    try:
        update_query = "UPDATE nfts SET is_bought = TRUE, is_sold = FALSE WHERE id = %s"
        cursor.execute(update_query, (nft_id,))
        db.commit()
    except Exception as e:
        buy = "Oops!"
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
    return {"message": buy}

# Endpoint to mark an NFT as sold

@app.post("/sell-nft/{nft_id}")
def sell_nft(nft_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    sold = "NFT sold successfully!"
    try:
        update_query = "UPDATE nfts SET is_bought = FALSE, is_sold = TRUE WHERE id = %s"
        cursor.execute(update_query, (nft_id,))
        db.commit()
    except Exception as e:
        sold = "Oops!"
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
    return {"message": sold}

# Endpoint to create a new NFT

@app.get("/nfts/", response_model=list[NFTResponse])
async def list_nfts(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    select_query = "SELECT id, name, description, price, is_bought, is_sold FROM nfts"
    cursor.execute(select_query)
    nfts = cursor.fetchall()
    cursor.close()
    return nfts

# Endpoint to read the details of a specific NFT by ID

@app.get("/nfts/{nft_id}", response_model=NFTResponse)
async def read_nft(nft_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    select_query = "SELECT id, name, description, price, is_bought, is_sold FROM nfts WHERE id = %s"
    cursor.execute(select_query, (nft_id,))
    nft = cursor.fetchone()
    cursor.close()
    if nft is None:
        raise HTTPException(status_code=404, detail="NFT not found")
    return nft

# Run the FastAPI app using Uvicorn

if __name__ == "__main":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
