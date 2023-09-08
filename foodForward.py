from telethon import TelegramClient, events, sync
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import InputPeerChannel
import datetime
import os
from dotenv import load_dotenv
load_dotenv()

api_id = os.getenv('APIID')
api_hash = os.getenv('APIHASH')
client = TelegramClient('danielninetyfour', api_id, api_hash)
client.start()
channel_username='Hillview_Foodies' # your channel
for messages in client.get_messages(channel_username, limit=10):
    print(messages.message)
