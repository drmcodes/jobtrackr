import type { FormEvent } from 'react'
import type { CreateJobInput } from '../services/job.service'

interface Props {
  form: CreateJobInput
  onChange: (form: CreateJobInput) => void
  onSubmit: (e: FormEvent) => void
  onClose: () => void
  isPending: boolean
}

const NewJobModal = ({ form, onChange, onSubmit, onClose, isPending }: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Nueva solicitud</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Empresa</label>
            <input
              type="text"
              placeholder="Google, Meta, Stripe..."
              value={form.company}
              onChange={(e) => onChange({ ...form, company: e.target.value })}
              required
              autoFocus
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Puesto</label>
            <input
              type="text"
              placeholder="Frontend Developer, Diseñador UX..."
              value={form.position}
              onChange={(e) => onChange({ ...form, position: e.target.value })}
              required
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Estado inicial</label>
            <select
              value={form.status ?? 'saved'}
              onChange={(e) => onChange({ ...form, status: e.target.value as CreateJobInput['status'] })}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="saved">Guardada</option>
              <option value="applied">Aplicada</option>
              <option value="interviewing">Entrevista</option>
              <option value="offer">Oferta</option>
              <option value="rejected">Rechazada</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notas (opcional)</label>
            <textarea
              placeholder="Contacto, detalles de la oferta..."
              value={form.notes ?? ''}
              onChange={(e) => onChange({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-gray-500 dark:text-gray-400 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {isPending ? 'Guardando...' : 'Guardar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewJobModal
