import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Broker } from '../../types/database'

export function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    supabase
      .from('brokers')
      .select('*')
      .order('priority', { ascending: true })
      .order('name', { ascending: true })
      .then(({ data }) => {
        setBrokers((data as Broker[]) ?? [])
        setLoading(false)
      })
  }, [])

  async function toggleActive(broker: Broker) {
    setToggling(broker.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('brokers')
      .update({ active: !broker.active })
      .eq('id', broker.id)

    if (!error) {
      setBrokers(prev => prev.map(b => b.id === broker.id ? { ...b, active: !b.active } : b))
    }
    setToggling(null)
  }

  const visible = brokers.filter(b => {
    if (filter === 'active') return b.active
    if (filter === 'inactive') return !b.active
    return true
  })

  const counts = {
    all: brokers.length,
    active: brokers.filter(b => b.active).length,
    inactive: brokers.filter(b => !b.active).length,
    automated: brokers.filter(b => b.supports_automation).length,
  }

  function priorityVariant(p: string) {
    if (p === 'high') return 'danger' as const
    if (p === 'medium') return 'amber' as const
    return 'neutral' as const
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Broker management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {counts.active} active · {counts.automated} automated · {counts.inactive} inactive
        </p>
      </div>

      <div className="flex gap-2">
        {(['all', 'active', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              filter === f
                ? 'bg-navy-700 text-white border-navy-700'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading brokers…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Broker</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Automation</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map(broker => (
                <tr key={broker.id} className={`hover:bg-slate-50 ${!broker.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{broker.name}</p>
                    {broker.opt_out_url && (
                      <a
                        href={broker.opt_out_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-navy-600 hover:underline"
                      >
                        Opt-out page ↗
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs capitalize">
                    {broker.category?.replace(/_/g, ' ') ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityVariant(broker.priority)}>{broker.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {broker.supports_automation
                      ? <Badge variant="success">{broker.automation_method}</Badge>
                      : <Badge variant="neutral">Manual</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={broker.active ? 'success' : 'neutral'}>
                      {broker.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={broker.active ? 'danger' : 'outline'}
                      loading={toggling === broker.id}
                      onClick={() => toggleActive(broker)}
                    >
                      {broker.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
