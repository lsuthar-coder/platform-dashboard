import React from 'react'
import { Card, Table, Spinner, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { useGetJobsQuery } from '../store/api'

const statusBadge = {
  DONE: 'badge-done', QUEUED: 'badge-queued', PROCESSING: 'badge-active',
  FAILED: 'badge-degraded', EXPIRED: 'badge-expired'
}

export default function JobsPage() {
  const { data: jobs = [], isLoading, isError } = useGetJobsQuery(undefined, { pollingInterval: 15000 })

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <Card className="p-3">
          <div className="card-label">AUDIO EXTRACTION JOBS</div>
          {isLoading ? (
            <div className="d-flex justify-content-center py-5"><Spinner /></div>
          ) : isError ? (
            <Alert variant="warning" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
              Could not load jobs — audio service may be unreachable
            </Alert>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5" style={{ color: '#55557a', fontFamily: 'var(--mono)', fontSize: 12 }}>
              No jobs yet. Submit an audio file via POST /audio/extract
            </div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>FILENAME</th>
                  <th>STATUS</th>
                  <th>CODEC</th>
                  <th>DURATION</th>
                  <th>SIZE</th>
                  <th>CREATED</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <motion.tr key={job.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <td><span className="code-pill">{job.id.slice(0, 8)}…</span></td>
                    <td style={{ fontSize: 12 }}>{job.filename}</td>
                    <td><span className={`badge ${statusBadge[job.status] || 'badge-type'} px-2 py-1`}>{job.status}</span></td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{job.codec || '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{job.duration_sec ? `${job.duration_sec}s` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{job.file_size_mb ? `${job.file_size_mb}MB` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#55557a' }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span></td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
