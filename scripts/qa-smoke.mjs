import { chromium } from 'playwright'

const baseUrl = process.env.QA_BASE_URL ?? 'http://127.0.0.1:5173'

const routes = [
  '/',
  '/planner',
  '/recommended',
  '/route',
  '/stops/greenhouse-route',
  '/map',
  '/catalog',
  '/peppers/lemon-drop',
  '/compare',
  '/my-visit',
  '/finish',
  '/ai',
  '/help',
]

const viewports = [
  { label: 'mobile', width: 390, height: 844 },
  { label: 'desktop', width: 1366, height: 900 },
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function assertServerReady() {
  try {
    const response = await fetch(baseUrl)
    assert(response.ok, `Local app returned HTTP ${response.status}`)
  } catch (error) {
    throw new Error(`Cannot reach ${baseUrl}. Start the dev server with "npm run dev" before running qa:smoke. ${error.message}`)
  }
}

async function clearVisit(page) {
  await page.goto(`${baseUrl}/?resetVisit=1`, { waitUntil: 'networkidle' })
}

async function waitHeading(page, name) {
  const heading = page.getByRole('heading', { name }).first()
  await heading.waitFor({ state: 'visible', timeout: 10000 })
  return heading.textContent()
}

async function pageMetrics(page, path) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(150)

  return page.evaluate(() => {
    const width = window.innerWidth
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
    const brokenImages = Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.alt || image.currentSrc || image.src || '(image)')

    return {
      path: window.location.pathname,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      overflowX: documentWidth > width + 2,
      scrollWidth: documentWidth,
      clientWidth: width,
      brokenImages,
      hasMain: Boolean(document.querySelector('main')),
    }
  })
}

async function auditRoutes(browser) {
  const routeAudit = []
  const consoleIssues = []

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    })
    const page = await context.newPage()

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleIssues.push(`${viewport.label}: ${message.text()}`)
      }
    })

    await clearVisit(page)

    for (const path of routes) {
      routeAudit.push({ viewport: viewport.label, ...(await pageMetrics(page, path)) })
    }

    await context.close()
  }

  const failures = {
    mobileOverflowRoutes: routeAudit
      .filter((result) => result.viewport === 'mobile' && result.overflowX)
      .map((result) => `${result.path} (${result.scrollWidth}/${result.clientWidth})`),
    desktopOverflowRoutes: routeAudit
      .filter((result) => result.viewport === 'desktop' && result.overflowX)
      .map((result) => `${result.path} (${result.scrollWidth}/${result.clientWidth})`),
    brokenImageRoutes: routeAudit
      .filter((result) => result.brokenImages.length)
      .map((result) => ({ viewport: result.viewport, path: result.path, brokenImages: result.brokenImages })),
    missingMainRoutes: routeAudit
      .filter((result) => !result.hasMain)
      .map((result) => `${result.viewport}:${result.path}`),
    consoleIssues,
  }

  assert(!failures.mobileOverflowRoutes.length, `Mobile overflow: ${failures.mobileOverflowRoutes.join(', ')}`)
  assert(!failures.desktopOverflowRoutes.length, `Desktop overflow: ${failures.desktopOverflowRoutes.join(', ')}`)
  assert(!failures.brokenImageRoutes.length, `Broken images: ${JSON.stringify(failures.brokenImageRoutes)}`)
  assert(!failures.missingMainRoutes.length, `Missing main element: ${failures.missingMainRoutes.join(', ')}`)
  assert(!failures.consoleIssues.length, `Console errors: ${failures.consoleIssues.join(' | ')}`)

  return failures
}

async function runMainFlow(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const steps = []

  await clearVisit(page)
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  steps.push({ step: 'Home', h1: await waitHeading(page, /Explore the farm/) })

  await page.getByRole('link', { name: /Start Visit/i }).first().click()
  await page.waitForURL('**/planner')
  steps.push({ step: 'Planner', h1: await waitHeading(page, /Plan Your Visit/), scrollY: await page.evaluate(() => window.scrollY) })

  await page.getByRole('button', { name: /Generate My Route/i }).click()
  await page.waitForURL('**/recommended')
  await page.getByText(/Why this route|Avoids staff-only|family-friendly/i).first().waitFor({ state: 'visible', timeout: 10000 })
  const aiReasonCount = await page.getByText(/Why this route|Avoids staff-only|family-friendly/i).count()
  assert(aiReasonCount > 0, 'Recommended Route did not show AI explanation reasons')
  steps.push({
    step: 'Recommended',
    h1: await waitHeading(page, /Balanced Mild Route/),
    aiReasonCount,
    scrollY: await page.evaluate(() => window.scrollY),
  })

  await page.getByRole('button', { name: /Accept Route/i }).first().click()
  await page.waitForURL('**/route')
  const routeText = await page.locator('body').innerText()
  assert(/Stop 1 of 5/.test(routeText), 'Live Route did not start at Stop 1 of 5')
  steps.push({ step: 'Live Route', h1: await waitHeading(page, /Follow your visit/), progress: 'Stop 1 of 5' })

  await page.getByRole('button', { name: /^Open Map$/i }).first().click()
  await page.getByRole('dialog', { name: /Farm Map/i }).waitFor({ state: 'visible' })
  const overlayOverflow = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    return dialog ? dialog.scrollWidth > window.innerWidth + 2 : true
  })
  assert(!overlayOverflow, 'Map overlay has horizontal overflow on mobile')

  await page.getByRole('button', { name: /Close map/i }).click()
  await page.getByRole('button', { name: /Continue to/i }).first().click()
  await page.waitForTimeout(200)
  const afterContinueText = await page.locator('body').innerText()
  assert(/Stop 2 of 5/.test(afterContinueText), 'Continue did not advance route progress to Stop 2 of 5')
  steps.push({ step: 'Continue route', progress: 'Stop 2 of 5', overlayOverflow })

  await context.close()
  return steps
}

async function runAdaptiveFlow(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()

  await clearVisit(page)
  await page.goto(`${baseUrl}/planner`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /60 min/i }).click()
  await page.getByRole('button', { name: /Explore/i }).click()
  await page.getByRole('button', { name: /^Hot$/i }).click()
  await page.getByRole('button', { name: /Generate My Route/i }).click()
  await page.waitForURL('**/recommended')
  await waitHeading(page, /Pepper Enthusiast Route/)
  await page.getByText(/Hot tasting|Tasting 3-4/i).first().waitFor({ state: 'visible', timeout: 10000 })
  await page.getByText(/Seedling Nursery|Color Pepper Row|deeper greenhouse learning/i).first().waitFor({ state: 'visible', timeout: 10000 })

  const recommendedText = await page.locator('body').innerText()
  assert(/Tasting GH 3-4|Hot tasting/i.test(recommendedText), 'Hot route did not include hot tasting logic')
  assert(/Seedling Nursery|Color Pepper Row|deeper greenhouse learning/i.test(recommendedText), 'Explore route did not include learning logic')

  await page.getByRole('button', { name: /Open full farm map|Open Map/i }).first().click()
  await page.getByRole('dialog', { name: /Farm Map/i }).waitFor({ state: 'visible' })
  await page.getByRole('button', { name: /Close map/i }).click()
  await page.getByRole('button', { name: /Add Shade Rest Area to route/i }).click()
  await page.waitForTimeout(250)

  const routeState = await page.evaluate(() => JSON.parse(window.localStorage.getItem('prigan-guide-visit') || '{}'))
  assert(routeState.customRouteStopIds?.includes('shade-rest-area'), 'Optional stop was not added to custom route')

  await context.close()
  return {
    route: 'Pepper Enthusiast Route',
    addedOptionalStop: 'shade-rest-area',
    customRouteStopIds: routeState.customRouteStopIds,
  }
}

async function runPepperFlow(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()

  await clearVisit(page)
  await page.goto(`${baseUrl}/catalog`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Save Lemon Drop to My Visit/i }).click()
  await page.getByRole('button', { name: /Compare Lemon Drop/i }).click()
  await page.getByRole('button', { name: /Compare Jalape/i }).click()

  const state = await page.evaluate(() => JSON.parse(window.localStorage.getItem('prigan-guide-visit') || '{}'))
  assert(state.savedPepperIds?.includes('lemon-drop'), 'Saved pepper did not persist')
  assert(state.comparedPepperIds?.includes('lemon-drop'), 'Lemon Drop compare state did not persist')
  assert(state.comparedPepperIds?.includes('jalapeno'), 'Jalapeno compare state did not persist')

  await page.getByRole('link', { name: /Open Compare/i }).click()
  await page.waitForURL('**/compare')
  const compareText = await page.locator('body').innerText()
  assert(/Lemon Drop/.test(compareText), 'Compare page does not show Lemon Drop')
  assert(/Jalape/.test(compareText), 'Compare page does not show Jalapeno')

  await page.goto(`${baseUrl}/my-visit`, { waitUntil: 'networkidle' })
  const myVisitText = await page.locator('body').innerText()
  assert(/Lemon Drop/.test(myVisitText), 'My Visit does not show saved Lemon Drop')

  await context.close()
  return {
    savedPepperIds: state.savedPepperIds,
    comparedPepperIds: state.comparedPepperIds,
  }
}

await assertServerReady()

const browser = await chromium.launch({ headless: true })
try {
  const results = {
    routeAudit: await auditRoutes(browser),
    mainFlow: await runMainFlow(browser),
    adaptiveFlow: await runAdaptiveFlow(browser),
    pepperFlow: await runPepperFlow(browser),
  }

  console.log(JSON.stringify({ status: 'PASS', baseUrl, results }, null, 2))
} finally {
  await browser.close()
}
