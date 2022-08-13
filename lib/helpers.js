const puppeteer = require('puppeteer')
const expect = require('chai').expect
const { toMatchImageSnapshot } = require('jest-image-snapshot')

module.exports = {
	/////////////////////////////////////////////////////BASICS////////////////////////////////////////////////////////////
	click: async function (page, selector) {
		try {
			await page.waitForSelector(selector)
			await page.click(selector)
		} catch (error) {
			throw new Error(`Could not click on selector of value: ${selector}`)
		}
	},
	typeText: async function (page, selector, text) {
		try {
			await page.waitForSelector(selector)
			await page.type(selector, text)
		} catch (error) {
			throw new Error(`Could not be able to type into selector: ${selector}`)
		}
	},
	waitForText: async function (page, selector, text) {
		// searchs on the whole DOM if there is a match between a selector and a text on it
		//without puppeter's $eval innerText &  chai's  "to.include" and expect)
		try {
			await page.waitForSelector(selector)
			await page.waitForFunction((selector, text) => {
				document.querySelector(selector).innerText.includes(text),
					{},
					selector,
					text
			}) // we need an empty state as 2nd parameter  to actually be able to pass the value  to the browser (this is how node  & the browser communicate with each other)
		} catch (error) {
			throw new Error(`Text: ${text} not found in Selector: ${selector}`)
		}
	},
	shouldNotExist: async function (page, selector) {
		try {
			// This one fails if the webpage is just hidding the element: await page.waitForSelector(() => !document.querySelector(selector))
			await page.waitForSelector(selector, {
				hidden: true,
				timeout: 3000,
			})
		} catch (error) {
			throw new Error(`Selector: ${selector} is visible, but should not be.`)
		}
	},
	/////////////////////////////////////////////////////READ DATA////////////////////////////////////////////////////////////
	getText: async function (page, selector) {
		try {
			await page.waitForSelector(selector)
			return await page.$eval(selector, (element) => element.innerHTML)
		} catch (error) {
			throw new Error(`Cannot get text from selector: ${selector}`)
		}
	},
	getCount: async function (page, selector) {
		try {
			await page.waitForSelector(selector)
			return await page.$$eval(selector, (elements) => elements.length)
		} catch (error) {
			throw new Error(`Cannot get count of selector: ${selector}`)
		}
	},
	/////////////////////////////////////////////////////EMULATE DEVICES ////////////////////////////////////////////////////////////
	emulateDevice: async function (page, device, selector) {
		const newDevice = puppeteer.devices[device] // remember to always save the device into a variable to use it later in the emulate function
		try {
			await page.waitForSelector(selector)
			await page.emulate(newDevice)
			await page.waitForTimeout(1000)
		} catch (error) {
			throw new Error(`Could not emulate the device: ${device} `)
		}
	},
	emulateDesktop: async function (page, selector, width, height) {
		try {
			await page.waitForSelector(selector)
			await page.setViewport({ width: width, height: height }) // simulates the desire resolution
			await page.waitForTimeout(1000)
		} catch (error) {
			throw new Error(
				`Could not emulate the desktop's width: ${width} & height: ${height} `
			)
		}
	},
}
