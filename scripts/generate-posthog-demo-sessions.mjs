import { chromium } from 'playwright'

const baseUrl = process.env.PRIGAN_DEMO_URL ?? 'http://127.0.0.1:5173'
const pauseMs = Number(process.env.PRIGAN_DEMO_PAUSE_MS ?? 750)
const headless = process.env.PRIGAN_DEMO_HEADLESS !== 'false'

const firstTenStories = [
  'US-01 Start visit without registration',
  'US-02 Choose language at the beginning',
  'US-03 Understand route duration quickly',
  'US-04 Select interests quickly',
  'US-05 Set comfortable spice level',
  'US-06 Choose visit mode',
  'US-07 Specify mobility limitations',
  'US-08 Get a route, not just a list of stops',
  'US-09 See why the route was recommended',
  'US-10 Understand where to go first',
]

const personas = [
  {
    id: 'elena-family',
    label: 'Elena, family visitor',
    duration: '45 min',
    mode: 'Family',
    spice: 'Mild',
    interest: 'Tasting',
    mobility: 'With children',
    viewport: { width: 390, height: 844 },
  },
  {
    id: 'arkady-enthusiast',
    label: 'Arkady, enthusiast visitor',
    duration: '75+ min',
    mode: 'Explore',
    spice: 'Hot',
    interest: 'Compare varieties',
    mobility: 'Need more rest points',
    viewport: { width: 1365, height: 900 },
  },
  {
    id: 'quick-general',
    label: 'General quick visitor',
    duration: '30 min',
    mode: 'Quick Tour',
    spice: 'Medium',
    interest: 'Farm highlights',
    mobility: 'Prefer less walking',
    viewport: { width: 1024, height: 768 },
  },
]

const completeSessions = Array.from({ length: 10 }, (_, index) => ({
  kind: 'complete',
  name: `complete-${index + 1}`,
  persona: personas[index % personas.length],
  story: firstTenStories[index],
  branch: index % 4,
}))

const plannerOnlySessions = Array.from({ length: 5 }, (_, index) => ({
  kind: 'planner-only',
  name: `planner-only-${index + 1}`,
  persona: personas[(index + 1) % personas.length],
  story: firstTenStories[index],
  branch: index % 2,
}))

const routeOnlySessions = Array.from({ length: 3 }, (_, index) => ({
  kind: 'route-only',
  name: `route-only-${index + 1}`,
  persona: personas[(index + 2) % personas.length],
  story: firstTenStories[index + 7],
  branch: index,
}))

const clickedActions = new Set()
const visitedPages = new Set()
const posthogEvents = []
const sessionResults = []

function sleep(ms = pauseMs) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isPostHogUrl(url) {
  return url.includes('posthog.com') || url.includes('posthog.net')
}

function sessionUrl(path, scenario) {
  const url = new URL(path, baseUrl)
  url.searchParams.set('demo_session', scenario.name)
  url.searchParams.set('demo_persona', scenario.persona.id)
  url.searchParams.set('demo_story', scenario.story.split(' ')[0])
  url.searchParams.set('demo_kind', scenario.kind)
  url.searchParams.set('demo_run', String(Date.now()))
  return url.toString()
}

async function notePage(page) {
  const url = new URL(page.url())
  visitedPages.add(url.pathname || '/')
}

async function waitForAnalytics(page) {
  await page.evaluate(() => {
    window.posthog?.flush?.()
  }).catch(() => undefined)
  await sleep(1200)
}

async function clickByRole(page, role, name, options = {}) {
  const locator = page.getByRole(role, { name, exact: options.exact ?? false }).first()
  await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 10000 })
  await locator.click()
  clickedActions.add(name)
  await sleep(options.pauseMs)
  await notePage(page)
}

async function clickText(page, text, options = {}) {
  const locator = page.getByText(text, { exact: options.exact ?? false }).first()
  await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 10000 })
  await locator.click()
  clickedActions.add(text)
  await sleep(options.pauseMs)
  await notePage(page)
}

async function maybeClick(page, role, name) {
  const locator = page.getByRole(role, { name, exact: false }).first()
  if ((await locator.count()) === 0) return false
  if (!(await locator.isVisible().catch(() => false))) return false
  await locator.click()
  clickedActions.add(name)
  await sleep()
  await notePage(page)
  return true
}

function attachPostHogLogging(page, scenario) {
  page.on('request', (request) => {
    const url = request.url()
    if (!isPostHogUrl(url)) return
    posthogEvents.push({
      session: scenario.name,
      persona: scenario.persona.id,
      type: 'request',
      method: request.method(),
      url,
    })
  })

  page.on('response', (response) => {
    const url = response.url()
    if (!isPostHogUrl(url)) return
    posthogEvents.push({
      session: scenario.name,
      persona: scenario.persona.id,
      type: 'response',
      status: response.status(),
      url,
    })
  })

  page.on('requestfailed', (request) => {
    const url = request.url()
    if (!isPostHogUrl(url)) return
    posthogEvents.push({
      session: scenario.name,
      persona: scenario.persona.id,
      type: 'failed',
      failure: request.failure()?.errorText,
      url,
    })
  })
}

async function gotoHome(page, scenario) {
  await page.goto(sessionUrl('/', scenario), { waitUntil: 'domcontentloaded' })
  await notePage(page)
  await waitForAnalytics(page)
}

async function openPlannerFromHome(page, scenario) {
  await gotoHome(page, scenario)

  if (scenario.persona.id === 'elena-family') {
    await clickText(page, 'Family Visit')
  } else if (scenario.persona.id === 'arkady-enthusiast') {
    await clickText(page, 'Browse Peppers')
    await waitForAnalytics(page)
    await page.goto(sessionUrl('/', scenario), { waitUntil: 'domcontentloaded' })
    await clickText(page, 'Start Visit')
  } else {
    await clickText(page, 'Start Visit')
  }

  await page.waitForURL('**/planner', { timeout: 10000 })
  await notePage(page)
  await waitForAnalytics(page)
}

async function choosePlannerPreferences(page, scenario) {
  const { duration, mode, interest, spice, mobility } = scenario.persona

  await clickByRole(page, 'button', duration)
  await clickByRole(page, 'button', mode)
  await clickByRole(page, 'button', interest)
  await clickByRole(page, 'button', spice)
  await clickByRole(page, 'button', mobility)

  if (scenario.branch === 1) {
    await maybeClick(page, 'button', 'Edit')
  }

  await waitForAnalytics(page)
}

async function generateRoute(page) {
  await clickByRole(page, 'button', 'Generate My Route')
  await page.waitForURL('**/recommended', { timeout: 10000 })
  await notePage(page)
  await waitForAnalytics(page)
}

async function exploreRecommendation(page, scenario) {
  if (scenario.branch === 1) {
    const openedMap = await maybeClick(page, 'button', 'Open Map')
    if (openedMap) {
      await waitForAnalytics(page)
      await page.goto(sessionUrl('/recommended', scenario), { waitUntil: 'domcontentloaded' })
      await waitForAnalytics(page)
    }
  } else if (scenario.branch === 2) {
    const choseManual = await maybeClick(page, 'button', 'Choose Manually')
    if (choseManual) {
      await waitForAnalytics(page)
      await page.goto(sessionUrl('/recommended', scenario), { waitUntil: 'domcontentloaded' })
      await waitForAnalytics(page)
    }
  } else if (scenario.branch === 3) {
    await maybeClick(page, 'button', 'Edit Preferences')
    await waitForAnalytics(page)
    await page.goto(sessionUrl('/recommended', scenario), { waitUntil: 'domcontentloaded' })
    await waitForAnalytics(page)
  }
}

async function acceptRoute(page, scenario) {
  await exploreRecommendation(page, scenario)
  await clickByRole(page, 'button', 'Accept Route')
  await page.waitForURL('**/route', { timeout: 10000 })
  await notePage(page)
  await waitForAnalytics(page)
}

async function continueThroughRoute(page, scenario) {
  if (scenario.persona.id === 'arkady-enthusiast') {
    await clickText(page, 'Details')
    await page.waitForURL('**/stops/greenhouse-route', { timeout: 10000 })
    await notePage(page)
    await waitForAnalytics(page)
    await clickByRole(page, 'button', 'Continue to Tasting GH 1-2')
    await page.waitForURL('**/route', { timeout: 10000 })
    await notePage(page)
  } else if (scenario.branch === 2) {
    await clickByRole(page, 'button', 'Skip')
  } else {
    const openedMap = await maybeClick(page, 'button', 'Open Map')
    if (openedMap) {
      await waitForAnalytics(page)
      await page.goto(sessionUrl('/route', scenario), { waitUntil: 'domcontentloaded' })
      await notePage(page)
    }
  }

  await waitForAnalytics(page)
}

async function reviewAndFinish(page, scenario) {
  await page.goto(sessionUrl('/my-visit', scenario), { waitUntil: 'domcontentloaded' })
  await notePage(page)
  await waitForAnalytics(page)

  await page.goto(sessionUrl('/finish', scenario), { waitUntil: 'domcontentloaded' })
  await notePage(page)
  await waitForAnalytics(page)
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext({
    viewport: scenario.persona.viewport,
    locale: 'en-US',
    colorScheme: 'light',
  })
  const page = await context.newPage()
  attachPostHogLogging(page, scenario)
  const start = Date.now()

  try {
    await openPlannerFromHome(page, scenario)
    await choosePlannerPreferences(page, scenario)

    if (scenario.kind === 'planner-only') {
      await waitForAnalytics(page)
      sessionResults.push({
        name: scenario.name,
        kind: scenario.kind,
        persona: scenario.persona.label,
        story: scenario.story,
        status: 'completed',
        stoppedAt: '/planner',
        ms: Date.now() - start,
      })
      return
    }

    await generateRoute(page)

    if (scenario.kind === 'route-only') {
      await exploreRecommendation(page, scenario)
      await waitForAnalytics(page)
      sessionResults.push({
        name: scenario.name,
        kind: scenario.kind,
        persona: scenario.persona.label,
        story: scenario.story,
        status: 'completed',
        stoppedAt: '/recommended',
        ms: Date.now() - start,
      })
      return
    }

    await acceptRoute(page, scenario)
    await continueThroughRoute(page, scenario)
    await reviewAndFinish(page, scenario)
    sessionResults.push({
      name: scenario.name,
      kind: scenario.kind,
      persona: scenario.persona.label,
      story: scenario.story,
      status: 'completed',
      stoppedAt: '/finish',
      ms: Date.now() - start,
    })
  } catch (error) {
    sessionResults.push({
      name: scenario.name,
      kind: scenario.kind,
      persona: scenario.persona.label,
      story: scenario.story,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      url: page.url(),
      ms: Date.now() - start,
    })
  } finally {
    await waitForAnalytics(page)
    await context.close()
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'chrome', headless })
  } catch {
    return chromium.launch({ headless })
  }
}

const scenarios = [...completeSessions, ...plannerOnlySessions, ...routeOnlySessions]
const browser = await launchBrowser()

for (const scenario of scenarios) {
  await runScenario(browser, scenario)
}

await browser.close()

const posthogSuccessfulResponses = posthogEvents.filter(
  (event) => event.type === 'response' && event.status >= 200 && event.status < 300,
)
const posthogFailedRequests = posthogEvents.filter((event) => event.type === 'failed')

const summary = {
  baseUrl,
  headless,
  totalRequested: scenarios.length,
  completeRequested: completeSessions.length,
  plannerOnlyRequested: plannerOnlySessions.length,
  routeOnlyRequested: routeOnlySessions.length,
  completed: sessionResults.filter((item) => item.status === 'completed').length,
  failed: sessionResults.filter((item) => item.status === 'failed').length,
  completeSessions: sessionResults.filter((item) => item.kind === 'complete' && item.status === 'completed').length,
  plannerOnlySessions: sessionResults.filter((item) => item.kind === 'planner-only' && item.status === 'completed').length,
  routeOnlySessions: sessionResults.filter((item) => item.kind === 'route-only' && item.status === 'completed').length,
  personas: personas.map((persona) => persona.label),
  storiesUsed: firstTenStories,
  visitedPages: [...visitedPages],
  clickedActions: [...clickedActions],
  posthogSuccessfulResponses: posthogSuccessfulResponses.length,
  posthogFailedRequests: posthogFailedRequests.length,
  posthogEndpoints: [...new Set(posthogEvents.map((event) => new URL(event.url).host))],
  results: sessionResults,
}

console.log(JSON.stringify(summary, null, 2))
