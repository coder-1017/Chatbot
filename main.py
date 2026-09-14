from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from schemas import UserMessage
from google import genai
from dotenv import load_dotenv
import os 

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "Gemini key not found"
    )

client = genai.Client(
    api_key=api_key
)

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

chats = client.chats.create(
    model="gemini-3.6-flash"
)

@app.get("/", include_in_schema=False)
def home(request: Request):

    return templates.TemplateResponse(
        request,
        "index.html",
        {"title": "Gemini-ChatBot"}
    )

@app.post("/api/chat")
def chat_with_gemini(data: UserMessage):
    try:
        response = chats.send_message(
            message=data.message
        )

        return {
            "response": response.text
        }

    except Exception as e:
        return {
            "response" : "Sorry something went wrong",
            "error" : str(e)
        }



