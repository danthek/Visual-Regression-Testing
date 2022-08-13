const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot }) // to use jests function with mocha's expect

describe('Visual Regression Testing', () => {
	let browser
	let page
	beforeAll(async function () {
		// we use beforeAll, afterAll and "test""because is jest and not mocha and chai"
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

	test('Single Element Snapshot', async function () {
		await page.goto('https://example.com/')
		const h1 = await page.waitForSelector('h1')
		const image = await h1.screenshot() // we are targeting the  area of the h1 instead of the entire page.
		expect(image).toMatchImageSnapshot({
			failureThresholdType: 'percent',
			failureThreshold: '0.01', // if the percentage of the pixel is more than this, it will throw an error
		})
	})

	test('Mobile Snapshot', async function () {
		const mobile = puppeteer.devices['iPhone X'] // remember to always save the device into a variable to use it later in the emulate function
		await page.goto('https://example.com/')
		await page.waitForSelector('h1') // just to validate if we are in the correct screen that we want
		await page.emulate(mobile)
		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot({
			failureThresholdType: 'percent',
			failureThreshold: '0.01',
		})
	})
	test('Tablet Snapshot', async function () {
		const tablet = puppeteer.devices['iPad landscape']
		await page.goto('https://example.com/')
		await page.waitForSelector('h1') // just to validate if we are in the correct screen that we want
		await page.emulate(tablet)
		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot({
			failureThresholdType: 'percent',
			failureThreshold: '0.01',
		})
	})
	test('Remove Element Before Snapshot', async function () {
		//".only"  iS A HOOK to run only a desire test inside the describe function
		await page.goto('https://example.com/')
		await page.evaluate(() => {
			;(document.querySelectorAll('a') || []).forEach((element) =>
				element.remove()
			) // removes all <a></a> elements from the snapshot or if there is nothing just tarjet and empty array/nothing (we call remove function for each h1 element found by the queryselector)
		})
		await page.waitForTimeout(3000)
		const image = await page.screenshot({ path: 'page.png', fullPage: 'true' }) // scrrenshot func is puppeteer native
		expect(image).toMatchImageSnapshot({
			//expect + tomatch.. (jest native function)
			failureThresholdType: 'pixel',
			failureThreshold: 500, // if its 500 or more pixels , the test will fail
		})
	})
})
