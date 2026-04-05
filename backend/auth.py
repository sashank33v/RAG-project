from jose import jwt
from fastapi import Header, HTTPException

def verify_token(auth_header: str):
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.get_unverified_claims(token)
        return payload["sub"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
