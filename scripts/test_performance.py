import asyncio
import time
import httpx
import statistics

CONCURRENCY = 50
REQUESTS_PER_USER = 5
BASE_URL = "http://localhost:8000"

async def simulate_user(client, user_id):
    latencies = []
    errors = 0
    for _ in range(REQUESTS_PER_USER):
        start = time.time()
        try:
            # We hit a fast endpoint to test framework/db overhead
            response = await client.get("/api/v1/health")
            if response.status_code != 200:
                errors += 1
        except Exception:
            errors += 1
        finally:
            end = time.time()
            latencies.append(end - start)
    return latencies, errors

async def run_load_test():
    print(f"Starting performance test with {CONCURRENCY} concurrent users...")
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
        start_time = time.time()
        tasks = [simulate_user(client, i) for i in range(CONCURRENCY)]
        results = await asyncio.gather(*tasks)
        total_time = time.time() - start_time
        
    all_latencies = []
    total_errors = 0
    for lats, errs in results:
        all_latencies.extend(lats)
        total_errors += errs
        
    if all_latencies:
        p50 = statistics.median(all_latencies)
        # simplistic p95
        all_latencies.sort()
        p95_idx = int(len(all_latencies) * 0.95)
        p95 = all_latencies[p95_idx]
        
        print("\n--- Synthetic Performance Baseline ---")
        print(f"Concurrency: {CONCURRENCY}")
        print(f"Total Requests: {len(all_latencies)}")
        print(f"Errors: {total_errors}")
        print(f"Error Rate: {(total_errors / len(all_latencies)) * 100:.2f}%")
        print(f"Throughput: {len(all_latencies) / total_time:.2f} req/s")
        print(f"P50 Latency: {p50*1000:.2f} ms")
        print(f"P95 Latency: {p95*1000:.2f} ms")
        print("Note: This is a BASELINE test on a simulated environment, not a production capacity guarantee.")

if __name__ == "__main__":
    asyncio.run(run_load_test())
