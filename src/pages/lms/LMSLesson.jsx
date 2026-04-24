import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourse, getAllLessons, getLesson } from '../../data/courses'
import { useLMSProgress } from '../../hooks/useLMSProgress'
import LMSLayout from './LMSLayout'

/* ── Quiz component ─────────────────────────────────────── */
function Quiz({ questions, onPass }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const select = (qid, idx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qid]: idx }))
  }

  const score = submitted
    ? questions.filter(q => answers[q.id] === q.correct).length
    : 0
  const passed = score >= Math.ceil(questions.length * 0.7)

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return
    setSubmitted(true)
    if (passed) onPass()
  }

  return (
    <div className="nds-lms-quiz">
      {questions.map((q, qi) => (
        <div key={q.id} className="nds-lms-quiz-question">
          <p className="nds-lms-quiz-q-text">{qi + 1}. {q.text}</p>
          <div className="nds-lms-quiz-options">
            {q.options.map((opt, oi) => {
              const chosen = answers[q.id] === oi
              let state = ''
              if (submitted) {
                if (oi === q.correct) state = 'correct'
                else if (chosen) state = 'wrong'
              } else if (chosen) state = 'chosen'
              return (
                <button
                  key={oi}
                  className={`nds-lms-quiz-opt${state ? ` ${state}` : ''}`}
                  onClick={() => select(q.id, oi)}
                >
                  <span className="nds-lms-quiz-opt-marker">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className="nds-lms-btn"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Enviar respuestas
        </button>
      ) : (
        <div className={`nds-lms-quiz-result${passed ? ' passed' : ' failed'}`}>
          {passed
            ? `✓ ¡Aprobado! ${score}/${questions.length} correctas`
            : `✗ ${score}/${questions.length} correctas — Intenta de nuevo`}
          {!passed && (
            <button
              className="nds-lms-btn nds-lms-btn--outline"
              onClick={() => { setAnswers({}); setSubmitted(false) }}
            >
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Lesson page ────────────────────────────────────────── */
export default function LMSLesson() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { getProgress, markComplete } = useLMSProgress()

  const course = getCourse(courseId)
  const result = getLesson(courseId, lessonId)

  if (!course || !result) {
    return (
      <LMSLayout title="Lección no encontrada">
        <Link to="/lms" className="nds-lms-btn">Volver al catálogo</Link>
      </LMSLayout>
    )
  }

  const { lesson } = result
  const allLessons = getAllLessons(courseId)
  const currentIdx = allLessons.findIndex(l => l.id === lessonId)
  const prev = allLessons[currentIdx - 1]
  const next = allLessons[currentIdx + 1]
  const isDone = getProgress(courseId, lessonId)

  const handleComplete = () => {
    markComplete(courseId, lessonId)
    if (next) navigate(`/lms/lesson/${courseId}/${next.id}`)
    else navigate(`/lms/course/${courseId}`)
  }

  return (
    <LMSLayout>
      {/* Breadcrumb */}
      <div className="nds-lms-breadcrumb">
        <Link to="/lms">Mis cursos</Link>
        <span>›</span>
        <Link to={`/lms/course/${courseId}`}>{course.title}</Link>
        <span>›</span>
        <span>{lesson.title}</span>
      </div>

      <div className="nds-lms-lesson-grid">
        {/* ── Content ── */}
        <article className="nds-lms-lesson-body">
          <div className="nds-lms-lesson-type-badge" style={{ background: course.color }}>
            {lesson.type === 'video' ? '▶ Video' : lesson.type === 'quiz' ? '✎ Quiz' : '📖 Lectura'}
          </div>

          <h1 className="nds-lms-lesson-title">{lesson.title}</h1>

          {lesson.duration && (
            <p className="nds-lms-lesson-duration">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {lesson.duration}
            </p>
          )}

          {/* Video placeholder */}
          {lesson.type === 'video' && (
            <div className="nds-lms-video-placeholder" style={{ borderColor: course.color }}>
              <div className="nds-lms-video-play" style={{ background: course.color }}>
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <p>Video de la lección</p>
              <span>El contenido multimedia se cargará aquí</span>
            </div>
          )}

          {/* Text content */}
          {lesson.content && lesson.type !== 'quiz' && (
            <div className="nds-lms-lesson-content">
              {lesson.content.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />
                if (line.startsWith('•')) return <li key={i} className="nds-lms-content-li">{line.slice(1).trim()}</li>
                if (line.endsWith(':') && !line.startsWith(' ')) return <h3 key={i} className="nds-lms-content-h3">{line}</h3>
                return <p key={i} className="nds-lms-content-p">{line}</p>
              })}
            </div>
          )}

          {/* Quiz */}
          {lesson.type === 'quiz' && lesson.questions && (
            <Quiz
              questions={lesson.questions}
              onPass={() => markComplete(courseId, lessonId)}
            />
          )}

          {/* Complete button (non-quiz) */}
          {lesson.type !== 'quiz' && (
            <div className="nds-lms-lesson-actions">
              {isDone ? (
                <div className="nds-lms-lesson-done">✓ Lección completada</div>
              ) : (
                <button
                  className="nds-lms-btn"
                  style={{ background: course.color }}
                  onClick={handleComplete}
                >
                  {next ? 'Completar y continuar →' : 'Completar lección ✓'}
                </button>
              )}
              {isDone && next && (
                <Link to={`/lms/lesson/${courseId}/${next.id}`} className="nds-lms-btn nds-lms-btn--outline">
                  Siguiente lección →
                </Link>
              )}
            </div>
          )}
        </article>

        {/* ── Lesson list sidebar ── */}
        <aside className="nds-lms-lesson-sidebar">
          <h3 className="nds-lms-lesson-sidebar-title">Lecciones del curso</h3>
          <div className="nds-lms-lesson-list">
            {allLessons.map((l, idx) => {
              const done = getProgress(courseId, l.id)
              const isCurrent = l.id === lessonId
              return (
                <Link
                  key={l.id}
                  to={`/lms/lesson/${courseId}/${l.id}`}
                  className={`nds-lms-lesson-list-item${isCurrent ? ' current' : ''}${done ? ' done' : ''}`}
                  style={isCurrent ? { borderLeftColor: course.color } : {}}
                >
                  <span className="nds-lms-lesson-list-num">{done ? '✓' : idx + 1}</span>
                  <span className="nds-lms-lesson-list-title">{l.title}</span>
                </Link>
              )
            })}
          </div>
        </aside>
      </div>

      {/* Navigation */}
      <div className="nds-lms-nav-btns">
        {prev ? (
          <Link to={`/lms/lesson/${courseId}/${prev.id}`} className="nds-lms-btn nds-lms-btn--outline">
            ← Anterior
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/lms/lesson/${courseId}/${next.id}`} className="nds-lms-btn nds-lms-btn--ghost">
            Siguiente →
          </Link>
        ) : (
          <Link to={`/lms/course/${courseId}`} className="nds-lms-btn nds-lms-btn--ghost">
            Ver curso →
          </Link>
        )}
      </div>
    </LMSLayout>
  )
}
