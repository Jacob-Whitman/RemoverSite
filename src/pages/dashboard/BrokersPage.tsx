import { useEffect, useState } from 'react'
import { BrokerStatusTable } from '../../components/dashboard/BrokerStatusTable'
import { useAuth } from '../../lib/authContext'
import { supabase } from '../../lib/supabaseClient'
import type { BrokerTask } from '../../types/database'

export function BrokersPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<BrokerTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('broker_tasks')
      .select('*, broker:brokers(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setTasks((data as BrokerTask[]) ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy-900">Broker status</h1>
      <p className="text-sm text-slate-600">
        Status for each data broker in scope for your account.
      </p>
      <BrokerStatusTable tasks={tasks} loading={loading} />
    </div>
  )
}
