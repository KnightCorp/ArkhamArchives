import httpx
import asyncio
import json

async def test_react_generation():
    async with httpx.AsyncClient() as client:
        try:
            print("Sending request to generate React learning path...")
            response = await client.post(
                'http://localhost:8000/generate-learning-path/',
                json={'language': 'react', 'completed_ids': []},
                timeout=120.0
            )
            print("Status Code:", response.status_code)
            print("Response:")
            print(json.dumps(response.json(), indent=2))
        except httpx.ConnectError as e:
            print(f"Connection Error: {e}")
            print("Make sure the backend server is running on http://localhost:8000")
        except httpx.TimeoutException as e:
            print(f"Timeout Error: {e}")
        except Exception as e:
            print(f"Unexpected Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_react_generation()) 