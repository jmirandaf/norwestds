import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse, getAllLessons } from '../../data/courses'
import { useLMSProgress } from '../../hooks/useLMSProgress'
import LMSLayout from './LMSLayout'

const TYPE_ICONS = {
  video: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  ),
  reading: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  quiz: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
}

function ProgressBar({ pct }) {
  return (
    <div className="nds-lms-progress-bar">
      <div className="nds-lms-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function LMSCourse() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { getProgress } = useLMSProgress()
  const [openMod, setOpenMod] = useState(null)

  if (!course) {
    return (
      <LMSLayout title="Curso no encontrado">
        <p>El curso solicitado no existe.</p>
        <Link to="/lms" className="nds-lms-btn">Volver al catálogo</Link>
      </LMSLayout>
    )
  }

  const allLessons = getAllLessons(courseId)
  const completed = allLessons.filter(l => getProgress(courseId, l.id)).length
  const pct = allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0

  // Find next uncompleted lesson
  const nextLesson = allLessons.find(l => !getProgress(courseId, l.id))

  return (
    <LMSLayout>
      {/* Course hero */}
      <div className="nds-lms-course-hero" style={{ borderColor: course.color }}>
        <div className="nds-lms-course-hero-accent" style={{ background: course.color }} />
        <div className="nds-lms-course-hero-body">
          <div className="nds-lms-course-hero-meta">
            <span className="nds-lms-badge" style={{ background: course.color }}>{course.category}</span>
            <span className="nds-lms-badge nds-lms-badge--ghost">{course.level}</span>
            <span className="nds-lms-badge nds-lms-badge--ghost">{course.duration}</span>
          </div>
          <h1 className="nds-lms-course-hero-title">{course.title}</h1>
          <p className="nds-lms-course-hero-desc">{course.description}</p>

          <div className="nds-lms-course-hero-progress">
            <div className="nds-lms-course-progress-row">
              <span className="nds-lms-course-progress-lbl">{completed} / {allLessons.length} lecciones completadas</span>
              <span className="nds-lms-course-progress-pct">{pct}%</span>
            </div>
            <ProgressBar pct={pct} />
          </div>

          {nextLesson && (
            <Link
              to={`/lms/lesson/${courseId}/${nextLesson.id}`}
              className="nds-lms-btn"
              style={{ background: course.color }}
            >
              {completed === 0 ? 'Comenzar curso' : 'Continuar lección'} →
            </Link>
          )}
          {pct === 100 && (
            <div className="nds-lms-completed-badge">✓ Curso completado</div>
          )}
        </div>

        {/* Objectives */}
        <div className="nds-lms-course-hero-obj">
          <h3 className="nds-lms-obj-title">Lo que aprenderás</h3>
          <ul className="nds-lms-obj-list">
            {course.objectives.map((obj, i) => (
              <li key={i} className="nds-lms-obj-item">
                <span className="nds-lms-obj-check" style={{ color: course.color }}>✓</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modules accordion */}
      <h2 className="nds-lms-section-title" style={{ marginTop: 28 }}>Contenido del curso</h2>
      <div className="nds-lms-modules">
        {course.modules.map((mod, idx) => {
          const modCompleted = mod.lessons.filter(l => getProgress(courseId, l.id)).length
          const isOpen = openMod === mod.id || openMod === null && idx === 0
          return (
            <div key={mod.id} className="nds-lms-module">
              <button
                className="nds-lms-module-header"
                onClick={() => setOpenMod(isOpen ? '__closed__' : mod.id)}
              >
                <div className="nds-lms-module-header-left">
                  <span className="nds-lms-module-num">Módulo {idx + 1}</span>
                  <span className="nds-lms-module-title">{mod.title}</span>
                </div>
                <div className="nds-lms-module-header-right">
                  <span className="nds-lms-module-count">{modCompleted}/{mod.lessons.length}</span>
                  <svg
                    width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="nds-lms-module-lessons">
                  {mod.lessons.map(lesson => {
                    const done = getProgress(courseId, lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        to={`/lms/lesson/${courseId}/${lesson.id}`}
                        className={`nds-lms-lesson-row${done ? ' done' : ''}`}
                      >
                        <span className={`nds-lms-lesson-status${done ? ' done' : ''}`}>
                          {done ? '✓' : TYPE_ICONS[lesson.type] || TYPE_ICONS.video}
                        </span>
                        <span className="nds-lms-lesson-title">{lesson.title}</span>
                        <span className="nds-lms-lesson-meta">
                          <span className="nds-lms-lesson-type">{lesson.type}</span>
                          {lesson.duration && <span>{lesson.duration}</span>}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </LMSLayout>
  )
}
