import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, createJob, updateJob, deleteJob } from '../services/job.service'
import type { Job, CreateJobInput } from '../services/job.service'
import { useState } from 'react'

const COLUMNS: { id: Job['status']; label: string }[] = [
  { id: 'saved', label: 'Guardada' },
  { id: 'applied', label: 'Aplicada' },
  { id: 'interviewing', label: 'Entrevista' },
  { id: 'offer', label: 'Oferta' },
  { id: 'rejected', label: 'Rechazada' },
]

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateJobInput>({ company: '', position: '' })

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  })

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setShowForm(false)
      setForm({ company: '', position: '' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJobInput> }) =>
      updateJob(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company || !form.position) return
    createMutation.mutate(form)
  }

  const handleStatusChange = (job: Job, newStatus: Job['status']) => {
    updateMutation.mutate({ id: job._id, data: { status: newStatus } })
  }

  if (isLoading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">JobTrackr</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hola, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Mis solicitudes</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + Nueva solicitud
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3 flex-wrap"
          >
            <input
              type="text"
              placeholder="Empresa"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
              className="border rounded px-3 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Puesto"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              required
              className="border rounded px-3 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancelar
            </button>
          </form>
        )}

        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.id)
            return (
              <div key={col.id} className="bg-white rounded-lg shadow min-w-[220px] flex-1">
                <div className="p-3 border-b font-semibold text-sm text-gray-700 flex justify-between">
                  <span>{col.label}</span>
                  <span className="text-gray-400">{colJobs.length}</span>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {colJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-gray-50 border rounded p-3 text-sm"
                    >
                      <p className="font-medium">{job.company}</p>
                      <p className="text-gray-500">{job.position}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <select
                          value={job.status}
                          onChange={(e) =>
                            handleStatusChange(job, e.target.value as Job['status'])
                          }
                          className="text-xs border rounded px-1 py-0.5 bg-white"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteMutation.mutate(job._id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
