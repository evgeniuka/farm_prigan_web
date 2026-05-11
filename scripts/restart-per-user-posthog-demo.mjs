import { execFile, spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const execFileAsync = promisify(execFile)

const baseUrl = 'http://127.0.0.1:5173'
const headless = process.env.PRIGAN_RESTART_DEMO_HEADLESS !== 'false'
const cwd = process.cwd()
const runStamp = Date.now()

const users = [
  {
    id: 'elena-family-restart',
    name: 'Elena',
    viewport: { width: 390, height: 844 },
    run: runElena,
  },
  {
    id: 'arkady-enthusiast-restart',
    name: 'Arkady',
    viewport: { width: 1365, height: 900 },
    run: runArkady,
  },
  {
    id: 'general-quick-restart',
    name: 'General quick visitor',
    viewport: { width: 1024, height: 768 },
    run: runQuickVisitor,
  },
]

const posthogEvents = []
const results = []

function isPostHogUrl(url) {
  return url.includes('posthog.com') || url.includes('posthog.net')
}

function url(path, user, extra = '') {
  const next = new URL(path, baseUrl)
  next.searchParams.set('restart_each_user', user.id)
  next.searchParams.set('demo_user', user.name)
  next.searchParams.set('demo_distinct_id', `demo-${user.id}-${runStamp}`)
  next.searchParams.set('demo_run', String(Date.now()))
  if (extra) next.searchParams.set('demo_step', extra)
  return next.toString()
}

async function stopServerOn5173() {
  const command = [
    "$serverPid = (netstat -ano | Select-String '127.0.0.1:5173\\s+0.0.0.0:0\\s+LISTENING' | ForEach-Object { ($_ -split '\\s+')[-1] } | Select-Object -First 1);",
    "if ($serverPid) { Stop-Process -Id ([int]$serverPid) -Force; Start-Sleep -Seconds 2 }",
  ].join(' ')

  await execFileAsync('powershell.exe', ['-NoProfile', '-Command', command], { cwd })
}

async function startServer() {
  const child = spawn(
    process.execPath,
    ['.\\node_modules\\vite\\bin\\vite.js', '--host', '127.0.0.1'],
    {
      cwd,
      stdio: 'ignore',
      windowsHide: true,
    },
  )

  await waitForServer()
  return child
}

async function waitForServer() {
  const deadline = Date.now() + 15_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // Keep waiting until Vite is ready.
    }
    await wait(500)
  }
  throw new Error('Vite server did not start on 5173')
}

async function click(page, role, name) {
  const locator = page.getByRole(role, { name, exact: false }).first()
  await locator.waitFor({ state: 'visible', timeout: 10_000 })
  await locator.click()
  await wait(900)
}

async function clickText(page, text) {
  const locator = page.getByText(text, { exact: false }).first()
  await locator.waitFor({ state: 'visible', timeout: 10_000 })
  await locator.click()
  await wait(900)
}

async function flushPostHog(page) {
  await page.evaluate(() => window.posthog?.flush?.()).catch(() => undefined)
  await wait(2_000)
}

function attachPostHogLogging(page, user) {
  page.on('request', (request) => {
    if (!isPostHogUrl(request.url())) return
    posthogEvents.push({
      user: user.name,
      type: 'request',
      method: request.method(),
      url: request.url(),
    })
  })

  page.on('response', (response) => {
    if (!isPostHogUrl(response.url())) return
    posthogEvents.push({
      user: user.name,
      type: 'response',
      status: response.status(),
      url: response.url(),
    })
  })

  page.on('requestfailed', (request) => {
    if (!isPostHogUrl(request.url())) return
    posthogEvents.push({
      user: user.name,
      type: 'failed',
      failure: request.failure()?.errorText,
      url: request.url(),
    })
  })
}

async function runElena(page, user) {
  await page.goto(url('/', user, 'home'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
  await clickText(page, 'Start Visit')
  await page.waitForURL('**/planner', { timeout: 10_000 })
  await click(page, 'button', '45 min')
  await click(page, 'button', 'Family')
  await click(page, 'button', 'Tasting')
  await click(page, 'button', 'Mild')
  await click(page, 'button', 'With children')
  await click(page, 'button', 'Generate My Route')
  await page.waitForURL('**/recommended', { timeout: 10_000 })
  await wait(2_000)
  await click(page, 'button', 'Accept Route')
  await page.waitForURL('**/route', { timeout: 10_000 })
  await wait(1_500)
  await clickText(page, 'Details')
  await page.waitForURL('**/stops/greenhouse-route', { timeout: 10_000 })
  await wait(1_500)
  await click(page, 'button', 'Continue to Tasting')
  await page.waitForURL('**/route', { timeout: 10_000 })
  await page.goto(url('/my-visit', user, 'review'), { waitUntil: 'domcontentloaded' })
  await wait(1_500)
  await page.goto(url('/finish', user, 'finish'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
}

async function runArkady(page, user) {
  await page.goto(url('/', user, 'home'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
  await clickText(page, 'Browse Peppers')
  await page.waitForURL('**/catalog', { timeout: 10_000 })
  await wait(1_500)
  await click(page, 'button', 'Hot')
  await click(page, 'button', 'Good for learning')
  await page.goto(url('/peppers/habanero', user, 'pepper-detail'), { waitUntil: 'domcontentloaded' })
  await wait(1_500)
  await page.goto(url('/catalog', user, 'catalog-return'), { waitUntil: 'domcontentloaded' })
  await wait(1_000)
  await page.goto(url('/compare', user, 'compare'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
  await page.goto(url('/my-visit', user, 'my-visit'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
}

async function runQuickVisitor(page, user) {
  await page.goto(url('/', user, 'home'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
  await clickText(page, 'Start Visit')
  await page.waitForURL('**/planner', { timeout: 10_000 })
  await click(page, 'button', '30 min')
  await click(page, 'button', 'Quick Tour')
  await click(page, 'button', 'Farm highlights')
  await click(page, 'button', 'Medium')
  await click(page, 'button', 'Prefer less walking')
  await click(page, 'button', 'Generate My Route')
  await page.waitForURL('**/recommended', { timeout: 10_000 })
  await wait(2_000)
  await click(page, 'button', 'Choose Manually')
  await wait(1_500)
  await page.goto(url('/recommended', user, 'back-from-manual'), { waitUntil: 'domcontentloaded' })
  await wait(1_000)
  await click(page, 'button', 'Accept Route')
  await page.waitForURL('**/route', { timeout: 10_000 })
  await wait(1_500)
  await click(page, 'button', 'Skip')
  await wait(1_500)
  await page.goto(url('/finish', user, 'finish'), { waitUntil: 'domcontentloaded' })
  await wait(2_000)
}

async function runUser(user) {
  let server
  let browser
  const startedAt = Date.now()

  try {
    console.log(`Restarting server for ${user.name}...`)
    await stopServerOn5173()
    server = await startServer()
    console.log(`Running ${user.name}...`)
    browser = await chromium.launch({ channel: 'chrome', headless })
    const context = await browser.newContext({
      viewport: user.viewport,
      locale: 'en-US',
    })
    const page = await context.newPage()
    attachPostHogLogging(page, user)
    await user.run(page, user)
    await flushPostHog(page)
    await context.close()
    results.push({
      user: user.name,
      status: 'completed',
      ms: Date.now() - startedAt,
    })
    console.log(`Completed ${user.name}`)
  } catch (error) {
    results.push({
      user: user.name,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - startedAt,
    })
  } finally {
    if (browser) await browser.close().catch(() => undefined)
    if (server) {
      server.kill()
      await wait(1_000)
    }
  }
}

for (const user of users) {
  await runUser(user)
}

await stopServerOn5173()
const finalServer = await startServer()
finalServer.unref()
await wait(2_000)

const successfulPostHogResponses = posthogEvents.filter(
  (event) => event.type === 'response' && event.status >= 200 && event.status < 300,
)
const failedPostHogRequests = posthogEvents.filter((event) => event.type === 'failed')

console.log(JSON.stringify({
  users: users.map((user) => user.name),
  serverRestartedPerUser: true,
  finalServerRunning: true,
  headless,
  completedUsers: results.filter((result) => result.status === 'completed').length,
  failedUsers: results.filter((result) => result.status === 'failed').length,
  posthogSuccessfulResponses: successfulPostHogResponses.length,
  posthogFailedRequests: failedPostHogRequests.length,
  results,
}, null, 2))
