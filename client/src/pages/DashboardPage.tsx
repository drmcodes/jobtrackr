import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, createJob, updateJob, deleteJob } from '../services/job.service'
import type { Job, CreateJobInput } from '../services/job.service'
import { useState } from 'react'
import NewJobModal from '../components/NewJobModal'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const COLUMNS: { id: Job['status']; label: string; color: string; darkColor: string }[] = [
  { id: 'saved', label: 'Guardada', color: 'bg-slate-100 border-slate-300', darkColor: 'dark:bg-slate-800 dark:border-slate-600' },
  { id: 'applied', label: 'Aplicada', color: 'bg-blue-50 border-blue-300', darkColor: 'dark:bg-blue-950 dark:border-blue-700' },
  { id: 'interviewing', label: 'Entrevista', color: 'bg-yellow-50 border-yellow-300', darkColor: 'dark:bg-yellow-950 dark:border-yellow-700' },
  { id: 'offer', label: 'Oferta', color: 'bg-green-50 border-green-300', darkColor: 'dark:bg-green-950 dark:border-green-700' },
  { id: 'rejected', label: 'Rechazada', color: 'bg-red-50 border-red-300', darkColor: 'dark:bg-red-950 dark:border-red-700' },
]

const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#22c55e', '#ef4444']

const BADGE: Record<Job['status'], string> = {
  saved: 'bg-slate-200 text-slate-700',
  applied: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-yellow-100 text-yellow-700',
  offer: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const StatCard = ({ label, value, sub }: { label: string; value: number | string; sub?: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
  </div>
)

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
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
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJobInput> }) => updateJob(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company || !form.position) return
    createMutation.mutate(form)
  }
  const handleStatusChange = (job: Job, newStatus: Job['status']) => {
    updateMutation.mutate({ id: job._id, data: { status: newStatus } })
  }

  const total = jobs.length
  const applied = jobs.filter(j => ['applied', 'interviewing', 'offer', 'rejected'].includes(j.status)).length
  const interviews = jobs.filter(j => j.status === 'interviewing').length
  const offers = jobs.filter(j => j.status === 'offer').length
  const responseRate = applied > 0 ? Math.round((interviews + offers) / applied * 100) : 0

  const counts = COLUMNS.map(col => jobs.filter(j => j.status === col.id).length)
  const labels = COLUMNS.map(col => col.label)

  const barData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: STATUS_COLORS,
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  const doughnutData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: STATUS_COLORS,
      borderWidth: 0,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } } },
      y: { grid: { color: isDark ? '#374151' : '#f3f4f6' }, ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 }, stepSize: 1 } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: isDark ? '#d1d5db' : '#374151', font: { size: 11 }, boxWidth: 10, padding: 12 } },
    },
    cutout: '65%',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">J</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">JobTrackr</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all">
              <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </Link>
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">Salir</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Panel de solicitudes</h1>
            <p className="text-gray-400 text-sm mt-1">Gestiona tu búsqueda de empleo</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + <span className="hidden md:inline">Nueva solicitud</span><span className="md:hidden">Nueva</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard label="Total solicitudes" value={total} />
          <StatCard label="Entrevistas" value={interviews} sub={`de ${applied} aplicadas`} />
          <StatCard label="Ofertas" value={offers} />
          <StatCard label="Tasa de respuesta" value={`${responseRate}%`} sub="entrevistas / aplicadas" />
        </div>

        {total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Solicitudes por estado</p>
              <div style={{ height: 180 }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Distribución</p>
              <div style={{ height: 180 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <NewJobModal
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            onClose={() => { setShowForm(false); setForm({ company: '', position: '' }) }}
            isPending={createMutation.isPending}
          />
        )}

        {total === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No tienes solicitudes aún</p>
            <p className="text-sm">Pulsa "Nueva" para empezar</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {COLUMNS.map((col) => {
              const colJobs = jobs.filter((j) => j.status === col.id)
              return (
                <div key={col.id} className={`rounded-xl border-2 ${col.color} ${col.darkColor} min-w-[200px] md:min-w-[220px] flex-1`}>
                  <div className="px-3 py-3 flex justify-between items-center">
                    <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">{col.label}</span>
                    <span className="text-xs bg-white dark:bg-gray-700 rounded-full px-2 py-0.5 text-gray-500 dark:text-gray-300 font-medium shadow-sm">{colJobs.length}</span>
                  </div>
                  <div className="px-2 pb-3 flex flex-col gap-2">
                    {colJobs.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-300 dark:text-gray-600">Sin solicitudes</div>
                    )}
                    {colJobs.map((job) => (
                      <div key={job._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-sm text-gray-800 dark:text-white leading-tight">{job.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{job.position}</p>
                        <div className="mt-3 flex items-center justify-between gap-1">
                          <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job, e.target.value as Job['status'])}
                            className={`text-xs rounded-full px-2 py-1 font-medium border-0 cursor-pointer ${BADGE[job.status]}`}
                          >
                            {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                          </select>
                          <button onClick={() => deleteMutation.mutate(job._id)} className="text-xs text-gray-300 hover:text-red-400 transition-colors px-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
