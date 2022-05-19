
from telethon import TelegramClient, events, sync
from telethon.tl.functions.messages import GetDialogsRequest, GetHistoryRequest
from telethon.tl.functions.channels import GetChannelsRequest, GetMessagesRequest
from telethon.tl.types import InputPeerEmpty, PhoneCallDiscardReasonDisconnect
import os
from dotenv import load_dotenv
load_dotenv()

api_id = os.getenv('APIID')
api_hash = os.getenv('APIHASH')
client = TelegramClient('danielninetyfour', api_id, api_hash)
client.start()

async def main():
    channel_username = 777000
    channel_entity = await client.get_entity(channel_username)
    posts = await client(GetHistoryRequest(
        peer=channel_entity,
        limit=10,
        offset_date=None,
        offset_id=0,
        max_id=0,
        min_id=0,
        add_offset=0,
        hash=0))
    getTelegramCode = str(posts.messages[0].message)
    print(getTelegramCode)


with client:
    client.loop.run_until_complete(main())
