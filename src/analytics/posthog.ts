import posthog from 'posthog-js'

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  const apiHost = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'
  const enabled = import.meta.env.VITE_POSTHOG_ENABLED === 'true'
  const demoUser = getDemoUserFromUrl()

  if (!key || !enabled) return

  posthog.init(key, {
    api_host: apiHost,
    defaults: '2026-01-30',
    ...(demoUser
      ? {
          bootstrap: {
            distinctID: demoUser.distinctId,
            isIdentifiedID: true,
          },
        }
      : {}),
  })

  if (demoUser) {
    posthog.register({
      demo_user: true,
      demo_persona: demoUser.persona,
      demo_distinct_id: demoUser.distinctId,
    })
    posthog.setPersonProperties({
      name: demoUser.persona,
      demo_user: true,
      demo_persona: demoUser.persona,
      demo_run: demoUser.run,
    })
  }
}

function getDemoUserFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const distinctId = params.get('demo_distinct_id')

  if (!distinctId) return null

  const persona = params.get('demo_user') ?? distinctId

  return {
    distinctId,
    persona,
    run: params.get('restart_each_user') ?? 'manual-demo',
  }
}
