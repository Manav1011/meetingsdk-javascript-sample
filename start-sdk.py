import asyncio
import json
import base64
import os
import json
import docker

client = docker.from_env()
class EchoServerProtocol(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport
        peername = transport.get_extra_info('peername')
        print(f"🔗 Connection established with {peername}")

    def data_received(self, data):
        try:
            message = data.decode()
            data = json.loads(message)
            if data['action'] == 'start_sdk':
                join_url = data['join_url']
                meeting_id = data['meeting_id']
                # Run a new container in detached mode
                container = client.containers.run(
                    "meetingsdk-headless-linux-sample-zoomsdk",  # Image name
                    detach=True,  # Run in background (like -d flag)
                    auto_remove=True,
                    name=f"zoomsdk_{meeting_id}",  # Container name
                    volumes={
                        "/home/web-h-004/Documents/meetingsdk-headless-linux-sample": {
                            "bind": "/tmp/meeting-sdk-linux-sample",
                            "mode": "rw",  # Read-write mode
                        }
                    },
                    command=["--join-url", join_url],
                )

                print(f"🚀 Started container {container.short_id}")
        except Exception as e:
            print(f"❌ Error decoding message: {e}")

async def main():
    loop = asyncio.get_running_loop()
    server = await loop.create_server(lambda: EchoServerProtocol(), '0.0.0.0', 9001)
    print("🚀 Server is running on 0.0.0.0:8080")
    async with server:
        await server.serve_forever()

asyncio.run(main())
