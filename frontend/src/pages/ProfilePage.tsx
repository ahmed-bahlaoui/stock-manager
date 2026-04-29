import { useAuth } from '../modules/auth/AuthContext'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'

export function ProfilePage() {
  const { user, token } = useAuth()

  return (
    <PageSection
      eyebrow="Identity"
      title="Authenticated user"
      description="Use this screen during the demo to show which user is signed in and how the role changes what the UI allows."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">User details</h4>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium uppercase tracking-[0.18em] text-teal-700">{user?.role}</dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Active token</h4>
          <p className="mt-2 text-sm text-slate-600">The token is stored locally and attached to protected API requests as a Bearer token.</p>
          <pre className="mt-5 overflow-x-auto rounded-3xl bg-stone-950 p-4 text-xs text-emerald-200">
            {token ?? 'No token loaded'}
          </pre>
        </Panel>
      </div>
    </PageSection>
  )
}
