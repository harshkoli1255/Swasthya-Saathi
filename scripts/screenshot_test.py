import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5174/doctor/login")
        await page.get_by_label("Username", exact=False).fill("doctor")
        await page.get_by_label("Password", exact=False).fill("password")
        await page.get_by_role("button", name="Sign In", exact=False).click()
        await page.wait_for_timeout(2000)
        await page.goto("http://localhost:5174/doctor/queue")
        await page.wait_for_timeout(1500)
        await page.screenshot(path="queue_screenshot.png")
        await browser.close()

asyncio.run(run())
