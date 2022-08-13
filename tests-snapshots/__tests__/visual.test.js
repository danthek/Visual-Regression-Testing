const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot }) // to use jests function with mocha's expect

describe('Visual Regression Testing', () => {
	let browser
	let page
	beforeAll(async function () {
		browser = await puppeteer.launch({
			headless: false,
			slowMo: 0,
			devtools: false,
		})
		page = await browser.newPage()
		await page.setDefaultTimeout(10000)
		await page.setDefaultNavigationTimeout(10000)
	})
	afterAll(async function () {
		await browser.close()
	})

	test('Full Page Snapshot', async function () {
		await page.goto('https://example.com/')
		await page.waitForSelector('h1')
		const image = await page.screenshot({ path: 'page.png', fullPage: 'true' }) // scrrenshot func is puppeteer native
		expect(image).toMatchImageSnapshot({
			//expect + tomatch.. (jest native function)
			failureThresholdType: 'pixel',
			failureThreshold: 500, // if its 500 or more pixels , the test will fail
		})
	})
})
