import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { COURSES, getAllLessons } from '../../data/courses'
import { useLMSProgress } from '../../hooks/useLMSProgress'
import LMSLayout from './LMSLayout'

function ProgressBar({ pct }) {
  return (
    <div className="nds-lms-progress-bar">
      <div className="nds-lms-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

function CourseCard({ course }) {
  const { getProgress } = useLMSProgress()
  const allLessons = getAllLessons(course.id)
  const completed = allLessons.filter(l => getProgress(course.id, l.id)).length
  const pct = allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0
  const started = completed > 0

  return (
    <Link to={`/lms/course/${course.id}`} className="nds-lms-course-card">
      <div className="nds-lms-course-card-header" style={{ background: course.color }}>
        <span className="nds-lms-course-category">{course.category}</span>
        <span className="nds-lms-course-level">{course.level}</span>
      </div>
      <div className="nds-lms-course-card-body">
        <h3 className="nds-lms-course-title">{course.title}</h3>
        <p className="nds-lms-course-subtitle">{course.subtitle}</p>

        <div className="nds-lms-course-meta">
          <span>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {course.duration}
          </span>
          <span>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {course.totalLessons} lecciones
          </span>
        </div>

        <div className="nds-lms-course-progress">
          <div className="nds-lms-course-progress-row">
            <span className="nds-lms-course-progress-lbl">
              {started ? `${completed} / ${allLessons.length} completadas` : 'Sin iniciar'}
            </span>
            <span className="nds-lms-course-progress-pct">{pct}%</span>
          </div>
          <ProgressBar pct={pct} />
        </div>

        <div className={`nds-lms-course-cta${started ? '' : ' nds-lms-course-cta--start'}`}>
          {pct === 100 ? 'Completado ✓' : started ? 'Continuar →' : 'Comenzar →'}
        </div>
      </div>
    </Link>
  )
}

export default function LMSHome() {
  const { userData } = useAuth()
  const { getProgress } = useLMSProgress()
  const firstName = userData?.displayName?.split(' ')[0] || 'Estudiante'

  const totalLessons = COURSES.flatMap(c => getAllLessons(c.id)).length
  const completedTotal = COURSES.flatMap(c =>
    getAllLessons(c.id).filter(l => getProgress(c.id, l.id))
  ).length
  const overallPct = totalLessons ? Math.round((completedTotal / totalLessons) * 100) : 0

  return (
    <LMSLayout>
      {/* Greeting */}
      <div className="nds-lms-greeting">
        <div>
          <h1 className="nds-lms-greeting-title">Hola, {firstName} 👋</h1>
          <p className="nds-lms-greeting-sub">Sigue aprendiendo automatización industrial.</p>
        </div>
        <div className="nds-lms-overall-progress">
          <div className="nds-lms-overall-num">{overallPct}%</div>
          <div className="nds-lms-overall-lbl">Progreso general</div>
          <ProgressBar pct={overallPct} />
        </div>
      </div>

      {/* Stats strip */}
      <div className="nds-lms-stats">
        <div className="nds-lms-stat">
          <span className="nds-lms-stat-num">{COURSES.length}</span>
          <span className="nds-lms-stat-lbl">Cursos disponibles</span>
        </div>
        <div className="nds-lms-stat">
          <span className="nds-lms-stat-num">{completedTotal}</span>
          <span className="nds-lms-stat-lbl">Lecciones completadas</span>
        </div>
        <div className="nds-lms-stat">
          <span className="nds-lms-stat-num">{totalLessons - completedTotal}</span>
          <span className="nds-lms-stat-lbl">Lecciones pendientes</span>
        </div>
      </div>

      {/* Course grid */}
      <h2 className="nds-lms-section-title">Cursos</h2>
      <div className="nds-lms-course-grid">
        {COURSES.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </LMSLayout>
  )
}
