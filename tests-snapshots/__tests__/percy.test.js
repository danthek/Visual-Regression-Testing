const puppeteer = require('puppeteer')
const percySnapshot = require('@percy/puppeteer')

describe('Percy Visual Test', () => {
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
	it('Full Page Percy Snapshot', async function () {
		await page.goto(
			'https://app.dev.cymatic.info/organizations/60b0eb2e-bc5d-4bce-8e5b-b45249f7207b/companies'
		)

		await page.waitForTimeout(3000)
		await percySnapshot(page, 'Homepage responsive test', {
			widths: [768, 992, 1200],
		}) // we give the page and the name of the snapshot
	})
})
