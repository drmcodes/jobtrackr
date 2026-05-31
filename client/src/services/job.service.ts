import api from './api'

export interface Job {
  _id: string
  userId: string
  company: string
  position: string
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'
  notes?: string
  appliedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateJobInput {
  company: string
  position: string
  status?: Job['status']
  notes?: string
  appliedAt?: string
}

export const getJobs = async (): Promise<Job[]> => {
  const res = await api.get('/jobs')
  return res.data
}

export const createJob = async (data: CreateJobInput): Promise<Job> => {
  const res = await api.post('/jobs', data)
  return res.data.job
}

export const updateJob = async (id: string, data: Partial<CreateJobInput>): Promise<Job> => {
  const res = await api.put(`/jobs/${id}`, data)
  return res.data
}

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`)
}
