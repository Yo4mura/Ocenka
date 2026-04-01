import { useState } from 'react'
import { ScrollReveal } from './components/ScrollReveal'
import './App.css'

type Page = 'home' | 'login' | 'register' | 'profile' | 'admin-panel' | 'course-player'
type Role = 'guest' | 'user' | 'admin'

interface Course {
  id: number
  title: string
  description: string
  price: string
  lessons: string
  level: string
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [role, setRole] = useState<Role>('guest')
  const [authRole, setAuthRole] = useState<'user' | 'admin'>('user')
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Frontend с нуля',
      description: 'HTML, CSS, JavaScript и первый полноценный проект.',
      price: '12900',
      lessons: '24',
      level: 'Начальный',
    },
  ])
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    lessons: '',
    level: 'Базовый',
  })
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<Record<number, number[]>>({})

  const formatKzt = (price: string) => `${price} ₸`
  const lessonCatalog = [
    'Введение в курс',
    'Подготовка окружения',
    'Основы интерфейса',
    'Компоненты и структура',
    'Работа с состоянием',
    'Маршрутизация и навигация',
    'Формы и валидация',
    'Работа с API',
    'Авторизация и роли',
    'Тестирование',
    'Оптимизация и производительность',
    'Итоговый проект',
  ]
  const getLessons = (lessonsRaw: string) => {
    const total = Math.max(1, Math.min(lessonCatalog.length, Number(lessonsRaw) || 6))
    return lessonCatalog.slice(0, total)
  }
  const openCoursePlayer = (courseId: number) => {
    setSelectedCourseId(courseId)
    setCurrentLessonIndex(0)
    setPage('course-player')
  }
  const markLessonDone = (courseId: number, lessonIndex: number) => {
    setCompletedLessons((prev) => {
      const prevForCourse = prev[courseId] || []
      if (prevForCourse.includes(lessonIndex)) return prev
      return {
        ...prev,
        [courseId]: [...prevForCourse, lessonIndex].sort((a, b) => a - b),
      }
    })
  }

  const onAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRole(authRole)
    setPage(authRole === 'admin' ? 'admin-panel' : 'profile')
  }

  const onLogout = () => {
    setRole('guest')
    setPage('home')
  }

  if (page === 'login' || page === 'register') {
    const isLogin = page === 'login'

    return (
      <div className="root">
        <header className="topbar">
          <div className="topbar-brand">TooOcenka LMS</div>
          <div className="topbar-actions">
            <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
              На главную
            </button>
          </div>
        </header>

        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-label">{isLogin ? 'Вход в систему' : 'Регистрация'}</div>
            <div className="auth-title">
              {isLogin ? 'Войдите в личный кабинет' : 'Создайте личный кабинет'}
            </div>
            <div className="auth-subtitle">
              {isLogin
                ? 'Введите email и пароль, чтобы продолжить обучение.'
                : 'Заполните форму, чтобы получить доступ к курсам и заданиям.'}
            </div>

            <form className="auth-form" onSubmit={onAuthSubmit}>
              {!isLogin && (
                <label className="auth-field">
                  <span>Имя и фамилия</span>
                  <input type="text" placeholder="Введите имя" />
                </label>
              )}

              <label className="auth-field">
                <span>Email</span>
                <input type="email" placeholder="you@example.com" />
              </label>

              <label className="auth-field">
                <span>Пароль</span>
                <input type="password" placeholder="Минимум 8 символов" />
              </label>

              <label className="auth-field">
                <span>Роль для входа (демо)</span>
                <select
                  value={authRole}
                  onChange={(event) => setAuthRole(event.target.value as 'user' | 'admin')}
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </label>

              {!isLogin && (
                <label className="auth-field">
                  <span>Подтверждение пароля</span>
                  <input type="password" placeholder="Повторите пароль" />
                </label>
              )}

              <button className="auth-submit" type="submit">
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <button
              className="auth-switch"
              onClick={() => setPage(isLogin ? 'register' : 'login')}
              type="button"
            >
              {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Вход'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'profile') {
    if (role === 'guest') {
      return (
        <div className="root">
          <header className="topbar">
            <div className="topbar-brand">TooOcenka LMS</div>
            <div className="topbar-actions">
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
                На главную
              </button>
              <button className="topbar-btn" onClick={() => setPage('login')}>
                Войти
              </button>
            </div>
          </header>
          <div className="admin-page">
            <div className="admin-card">
              <div className="auth-label">Требуется авторизация</div>
              <div className="auth-title">Войдите, чтобы открыть профиль</div>
            </div>
          </div>
        </div>
      )
    }

    const progressPercent = 68
    const inProgressCourses = courses.slice(0, 3)

    return (
      <div className="root">
        <header className="topbar">
          <div className="topbar-brand">TooOcenka LMS</div>
          <div className="topbar-actions">
            <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
              На главную
            </button>
            {role === 'admin' && (
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('admin-panel')}>
                Админ-панель
              </button>
            )}
            <button className="topbar-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </header>

        <div className="profile-page">
          <div className="profile-hero">
            <div className="profile-avatar">АБ</div>
            <div className="profile-main">
              <div className="auth-label">Личный кабинет</div>
              <h1>Алиакбар Бейсембаев</h1>
              <p>
                {role === 'admin'
                  ? 'Роль: администратор. Здесь видны прогресс, активные курсы и быстрый переход в панель.'
                  : 'Роль: пользователь. Здесь видны прогресс обучения, активные курсы и задачи.'}
              </p>
            </div>
          </div>

          <div className="profile-stats">
            <article className="profile-stat-card">
              <span>Активные курсы</span>
              <strong>{inProgressCourses.length}</strong>
            </article>
            <article className="profile-stat-card">
              <span>Прогресс обучения</span>
              <strong>{progressPercent}%</strong>
            </article>
            <article className="profile-stat-card">
              <span>Заданий сдано</span>
              <strong>14</strong>
            </article>
            <article className="profile-stat-card">
              <span>Уведомлений</span>
              <strong>3</strong>
            </article>
          </div>

          <div className="profile-grid">
            <section className="profile-card">
              <h2>Мой прогресс</h2>
              <div className="profile-progress-track">
                <div className="profile-progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
              <p>Вы завершили {progressPercent}% учебного плана за месяц.</p>
            </section>

            <section className="profile-card">
              <h2>Быстрые действия</h2>
              <div className="profile-actions">
                {role === 'admin' ? (
                  <button className="admin-action-btn" onClick={() => setPage('admin-panel')}>
                    Перейти в админ-панель
                  </button>
                ) : (
                  <button
                    className="admin-action-btn admin-action-btn-ghost"
                    onClick={() => openCoursePlayer(inProgressCourses[0]?.id ?? courses[0].id)}
                  >
                    Продолжить обучение
                  </button>
                )}
              </div>
            </section>
          </div>

          <section className="profile-card profile-courses">
            <h2>Текущие курсы</h2>
            <div className="admin-courses-grid">
              {inProgressCourses.map((course) => (
                <article className="admin-course-card" key={course.id}>
                  <div className="admin-course-head">
                    <h3>{course.title}</h3>
                    <span>{course.level}</span>
                  </div>
                  <p>{course.description}</p>
                  <div className="admin-course-meta">
                    <strong>{formatKzt(course.price)}</strong>
                    <span>{course.lessons} уроков</span>
                  </div>
                  <div className="admin-list-actions">
                    <button className="admin-action-btn" onClick={() => openCoursePlayer(course.id)}>
                      Проходить курс
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (page === 'course-player') {
    if (role === 'guest') {
      return (
        <div className="root">
          <header className="topbar">
            <div className="topbar-brand">TooOcenka LMS</div>
            <div className="topbar-actions">
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
                На главную
              </button>
              <button className="topbar-btn" onClick={() => setPage('login')}>
                Войти
              </button>
            </div>
          </header>
          <div className="admin-page">
            <div className="admin-card">
              <div className="auth-label">Требуется авторизация</div>
              <div className="auth-title">Войдите, чтобы проходить курс</div>
            </div>
          </div>
        </div>
      )
    }

    const activeCourse = courses.find((course) => course.id === selectedCourseId) || courses[0]
    const lessons = getLessons(activeCourse.lessons)
    const safeLessonIndex = Math.min(currentLessonIndex, lessons.length - 1)
    const doneLessons = completedLessons[activeCourse.id] || []

    return (
      <div className="root">
        <header className="topbar">
          <div className="topbar-brand">TooOcenka LMS</div>
          <div className="topbar-actions">
            <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('profile')}>
              Назад в профиль
            </button>
            {role === 'admin' && (
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('admin-panel')}>
                Админ-панель
              </button>
            )}
            <button className="topbar-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </header>

        <div className="course-page">
          <aside className="course-sidebar">
            <div className="auth-label">Курс</div>
            <h2>{activeCourse.title}</h2>
            <p>{activeCourse.description}</p>
            <div className="course-progress-line">
              <div
                className="course-progress-fill"
                style={{ width: `${Math.round((doneLessons.length / lessons.length) * 100)}%` }}
              />
            </div>
            <div className="course-progress-text">
              Пройдено: {doneLessons.length} / {lessons.length} уроков
            </div>

            <div className="course-lessons">
              {lessons.map((lesson, index) => (
                <button
                  className={`course-lesson-btn ${index === safeLessonIndex ? 'is-active' : ''} ${doneLessons.includes(index) ? 'is-done' : ''}`}
                  key={`${lesson}-${index}`}
                  onClick={() => setCurrentLessonIndex(index)}
                >
                  <span>{index + 1}. {lesson}</span>
                  {doneLessons.includes(index) && <em>Готово</em>}
                </button>
              ))}
            </div>
          </aside>

          <main className="course-content">
            <div className="course-video-card">
              <div className="course-video-head">
                <strong>Урок {safeLessonIndex + 1}</strong>
                <span>{lessons[safeLessonIndex]}</span>
              </div>
              <div className="course-video-mock">
                <div className="course-video-play">▶</div>
              </div>
              <div className="course-video-actions">
                <button
                  className="admin-action-btn"
                  onClick={() => markLessonDone(activeCourse.id, safeLessonIndex)}
                >
                  Отметить как пройденный
                </button>
                <button
                  className="admin-action-btn admin-action-btn-ghost"
                  onClick={() =>
                    setCurrentLessonIndex((prev) => Math.min(prev + 1, lessons.length - 1))
                  }
                >
                  Следующий урок
                </button>
              </div>
            </div>

            <div className="course-material-card">
              <h3>Материалы урока</h3>
              <ul>
                <li>Конспект в PDF</li>
                <li>Пример кода</li>
                <li>Домашнее задание</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (page === 'admin-panel') {
    if (role !== 'admin') {
      return (
        <div className="root">
          <header className="topbar">
            <div className="topbar-brand">TooOcenka LMS</div>
            <div className="topbar-actions">
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
                На главную
              </button>
              <button
                className="topbar-btn"
                onClick={() => {
                  setAuthRole('admin')
                  setPage('login')
                }}
              >
                Войти как админ
              </button>
            </div>
          </header>
          <div className="admin-page">
            <div className="admin-card">
              <div className="auth-label">Доступ ограничен</div>
              <div className="auth-title">Только для администратора</div>
              <div className="auth-subtitle">
                Эта панель доступна только с ролью администратора.
              </div>
            </div>
          </div>
        </div>
      )
    }

    const onCreateOrUpdateCourse = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!courseForm.title.trim()) return

      if (editingCourseId) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === editingCourseId
              ? {
                  ...course,
                  title: courseForm.title.trim(),
                  description: courseForm.description.trim() || 'Описание будет добавлено позже.',
                  price: courseForm.price.trim() || '0',
                  lessons: courseForm.lessons.trim() || '0',
                  level: courseForm.level,
                }
              : course
          )
        )
      } else {
        setCourses((prev) => [
          {
            id: Date.now(),
            title: courseForm.title.trim(),
            description: courseForm.description.trim() || 'Описание будет добавлено позже.',
            price: courseForm.price.trim() || '0',
            lessons: courseForm.lessons.trim() || '0',
            level: courseForm.level,
          },
          ...prev,
        ])
      }

      setCourseForm({ title: '', description: '', price: '', lessons: '', level: 'Базовый' })
      setEditingCourseId(null)
    }

    const onStartEdit = (course: Course) => {
      setEditingCourseId(course.id)
      setCourseForm({
        title: course.title,
        description: course.description,
        price: course.price,
        lessons: course.lessons,
        level: course.level,
      })
    }

    const onDeleteCourse = (id: number) => {
      setCourses((prev) => prev.filter((course) => course.id !== id))
      if (editingCourseId === id) {
        setEditingCourseId(null)
        setCourseForm({ title: '', description: '', price: '', lessons: '', level: 'Базовый' })
      }
    }

    return (
      <div className="root">
        <header className="topbar">
          <div className="topbar-brand">TooOcenka LMS</div>
          <div className="topbar-actions">
            <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('home')}>
              На главную
            </button>
            <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('profile')}>
              Профиль
            </button>
            <button className="topbar-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </header>

        <div className="admin-page">
          <div className="admin-card">
            <div className="auth-label">Админ-панель</div>
            <div className="auth-title">
              {editingCourseId ? 'Редактирование курса' : 'Создание курса'}
            </div>
            <div className="auth-subtitle">
              Управляйте курсами здесь: создавайте, редактируйте и удаляйте без перехода на главную.
            </div>

            <form className="auth-form" onSubmit={onCreateOrUpdateCourse}>
              <label className="auth-field">
                <span>Название курса</span>
                <input
                  type="text"
                  placeholder="Например, React + TypeScript"
                  value={courseForm.title}
                  onChange={(event) =>
                    setCourseForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="auth-field">
                <span>Описание</span>
                <input
                  type="text"
                  placeholder="Кратко о программе курса"
                  value={courseForm.description}
                  onChange={(event) =>
                    setCourseForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </label>

              <div className="admin-grid">
                <label className="auth-field">
                  <span>Цена (тенге)</span>
                  <input
                    type="text"
                    placeholder="12900"
                    value={courseForm.price}
                    onChange={(event) =>
                      setCourseForm((prev) => ({ ...prev, price: event.target.value }))
                    }
                  />
                </label>

                <label className="auth-field">
                  <span>Уроков</span>
                  <input
                    type="text"
                    placeholder="24"
                    value={courseForm.lessons}
                    onChange={(event) =>
                      setCourseForm((prev) => ({ ...prev, lessons: event.target.value }))
                    }
                  />
                </label>
              </div>

              <label className="auth-field">
                <span>Уровень</span>
                <input
                  type="text"
                  placeholder="Базовый / Средний / Продвинутый"
                  value={courseForm.level}
                  onChange={(event) =>
                    setCourseForm((prev) => ({ ...prev, level: event.target.value }))
                  }
                />
              </label>

              <div className="admin-actions">
                <button className="auth-submit" type="submit">
                  {editingCourseId ? 'Сохранить изменения' : 'Создать курс'}
                </button>
                {editingCourseId && (
                  <button
                    className="admin-action-btn admin-action-btn-ghost"
                    type="button"
                    onClick={() => {
                      setEditingCourseId(null)
                      setCourseForm({
                        title: '',
                        description: '',
                        price: '',
                        lessons: '',
                        level: 'Базовый',
                      })
                    }}
                  >
                    Отменить
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-courses">
            <div className="auth-label">Курсы</div>
            <div className="auth-title">Управление курсами</div>
            <div className="auth-subtitle">Всего курсов: {courses.length}</div>

            <div className="admin-courses-grid">
              {courses.map((course) => (
                <article className="admin-course-card" key={course.id}>
                  <div className="admin-course-head">
                    <h3>{course.title}</h3>
                    <span>{course.level}</span>
                  </div>
                  <p>{course.description}</p>
                  <div className="admin-course-meta">
                    <strong>{formatKzt(course.price)}</strong>
                    <span>{course.lessons} уроков</span>
                  </div>
                  <div className="admin-list-actions">
                    <button className="admin-action-btn" onClick={() => onStartEdit(course)}>
                      Редактировать
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn-ghost"
                      onClick={() => openCoursePlayer(course.id)}
                    >
                      Открыть курс
                    </button>
                    <button
                      className="admin-action-btn admin-danger-btn"
                      onClick={() => onDeleteCourse(course.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="root">
      <header className="topbar">
        <div className="topbar-brand">TooOcenka LMS</div>
        <div className="topbar-actions">
          {role === 'guest' ? (
            <>
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('login')}>
                Вход
              </button>
              <button className="topbar-btn" onClick={() => setPage('register')}>
                Регистрация
              </button>
            </>
          ) : (
            <>
              <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('profile')}>
                Профиль
              </button>
              {role === 'admin' && (
                <button className="topbar-btn topbar-btn-ghost" onClick={() => setPage('admin-panel')}>
                  Админ-панель
                </button>
              )}
              <button className="topbar-btn" onClick={onLogout}>
                Выйти
              </button>
            </>
          )}
        </div>
      </header>

      <div className="hero">
        <div className="hero-main">
          <div className="hero-label">Техническое задание</div>
          <div className="hero-title">
            Платформа
            <br />
            онлайн-<span>курсов</span>
          </div>
          <div className="hero-subtitle">
            RBAC • Видео • Задания • Личные кабинеты
          </div>
          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => setPage(role === 'guest' ? 'register' : role === 'admin' ? 'admin-panel' : 'profile')}
            >
              Начать обучение
            </button>
            {role === 'guest' ? (
              <button className="btn-secondary" onClick={() => setPage('login')}>
                Войти
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => setPage('profile')}>
                Открыть кабинет
              </button>
            )}
          </div>
          <div className="hero-tags">
            <span>#RBAC</span>
            <span>#Streaming</span>
            <span>#Assignments</span>
            <span>#LMS</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-browser">
            <div className="hero-browser-header">
              <span className="hero-browser-dot" />
              <span className="hero-browser-dot" />
              <span className="hero-browser-dot" />
            </div>
            <div className="hero-browser-content">
              <div className="hero-browser-bar bar-1" />
              <div className="hero-browser-bar bar-2" />
              <div className="hero-browser-bar bar-3" />
              <div className="hero-browser-bar bar-4" />
              <div className="hero-browser-bar bar-5" />
              <div className="hero-browser-block" />
            </div>
          </div>
          <div className="hero-floating-card card-1">
            <div className="hero-floating-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
            </div>
            <div>
              <div className="hero-floating-title">Курсы и уроки</div>
              <div className="hero-floating-desc">Модули, видео, материалы</div>
            </div>
          </div>
          <div className="hero-floating-card card-2">
            <div className="hero-floating-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="hero-floating-title">Проверка заданий</div>
              <div className="hero-floating-desc">Статусы, комментарии</div>
            </div>
          </div>
          <div className="hero-floating-card card-3">
            <div className="hero-floating-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <div className="hero-floating-title">Личный кабинет</div>
              <div className="hero-floating-desc">Прогресс, уведомления</div>
            </div>
          </div>
        </div>
      </div>

      <ScrollReveal className="hero-features">
        <div className="hero-feature-card">
          <div className="card-title">20 разделов ТЗ</div>
          <div className="card-desc">Полное описание функционала платформы</div>
        </div>
        <div className="hero-feature-card">
          <div className="card-title">4 роли пользователей</div>
          <div className="card-desc">Администратор, клиент, ученик, сотрудник</div>
        </div>
        <div className="hero-feature-card">
          <div className="card-title">Веб-формат</div>
          <div className="card-desc">Адаптивный дизайн, личные кабинеты</div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section" id="roles">
        <div className="section-header">
          <div className="section-index">01</div>
          <div className="section-info">
            <div className="section-label">Ролевая модель</div>
            <div className="section-title">Пользователи системы</div>
          </div>
        </div>
        <div className="grid-4">
          <div className="role-card">
            <div className="role-pill pill-admin">Полный доступ</div>
            <div className="role-name">Администратор</div>
            <ul className="role-list">
              <li>Управление курсами и уроками</li>
              <li>Назначение ролей</li>
              <li>Все заказы и платежи</li>
              <li>Проверка заданий</li>
              <li>Отчёты и статистика</li>
              <li>Настройки платформы</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-pill pill-client">Покупка</div>
            <div className="role-name">Клиент</div>
            <ul className="role-list">
              <li>Каталог и покупка</li>
              <li>Доступ к курсам</li>
              <li>Просмотр уроков</li>
              <li>Статусы заказов</li>
              <li>Уведомления</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-pill pill-student">Обучение</div>
            <div className="role-name">Ученик</div>
            <ul className="role-list">
              <li>Назначенные курсы</li>
              <li>Отправка заданий</li>
              <li>Статус проверки</li>
              <li>Комментарии куратора</li>
              <li>История отправок</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-pill pill-staff">Куратор</div>
            <div className="role-name">Сотрудник</div>
            <ul className="role-list">
              <li>Закреплённые курсы</li>
              <li>Проверка заданий</li>
              <li>Статусы и комментарии</li>
              <li>Методические файлы</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section" id="video">
        <div className="section-header">
          <div className="section-index">02</div>
          <div className="section-info">
            <div className="section-label">Защита контента</div>
            <div className="section-title">Видеоуроки</div>
          </div>
        </div>
        <div className="callout">
          <div className="callout-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="callout-title">
              Видео воспроизводится только внутри платформы
            </div>
            <div className="callout-body">
              Нет штатной кнопки скачивания, нет прямых ссылок на файлы. Доступ только
              авторизованным пользователям с проверкой роли и факта покупки. Запись
              экрана технически невозможно исключить — задача системы исключить
              официальное скачивание.
            </div>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-block accent">
            <div className="fb-eyebrow">Технические меры</div>
            <div className="fb-title">Защита файлов</div>
            <div className="fb-body">
              Потоковое воспроизведение, временные токенизированные URL, скрытие
              исходных путей, ограничение доступа к хранилищу, запрет индексации.
            </div>
          </div>
          <div className="feature-block dark">
            <div className="fb-eyebrow">Ограничения</div>
            <div className="fb-title">Что запрещено</div>
            <div className="fb-body">
              Кнопка «Скачать видео», прямые ссылки на видеофайлы, публичный доступ к
              хранилищу, отдача файла без проверки сессии.
            </div>
            <div className="fb-tags">
              <span className="fb-tag">Нет download</span>
              <span className="fb-tag">Нет прямых URL</span>
              <span className="fb-tag">Токен обязателен</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section" id="assignments">
        <div className="section-header">
          <div className="section-index">03</div>
          <div className="section-info">
            <div className="section-label">Учебный процесс</div>
            <div className="section-title">Приём и проверка заданий</div>
          </div>
        </div>
        <div className="wide-block">
          <div className="wide-header">
            <div className="wide-num">6</div>
            <div>
              <div className="wide-title">Статусов у каждого задания</div>
              <div className="wide-desc">
                Полный цикл от отправки до принятия или отклонения с возможностью
                доработки
              </div>
            </div>
          </div>
          <div className="wide-body">
            <div className="status-flow">
              <span className="status-node sn-0">Не отправлено</span>
              <span className="status-arrow">→</span>
              <span className="status-node sn-1">Отправлено</span>
              <span className="status-arrow">→</span>
              <span className="status-node sn-2">На проверке</span>
              <span className="status-arrow">→</span>
              <span className="status-node sn-3">Принято</span>
            </div>
            <div className="status-flow status-flow-alt">
              <span className="status-node sn-4">На доработку</span>
              <span className="status-arrow">→</span>
              <span className="status-flow-meta">
                повторная отправка
              </span>
              <span className="status-arrow">→</span>
              <span className="status-node sn-1">Отправлено</span>
              <span className="status-arrow">—</span>
              <span className="status-node sn-5">Отклонено</span>
            </div>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-block">
            <div className="fb-eyebrow">Форматы ответа</div>
            <div className="fb-title">Что принимает система</div>
            <div className="fb-tags">
              <span className="fb-tag green">Текст</span>
              <span className="fb-tag green">PDF</span>
              <span className="fb-tag green">DOC / DOCX</span>
              <span className="fb-tag green">XLS / XLSX</span>
              <span className="fb-tag green">JPG / PNG</span>
              <span className="fb-tag green">ZIP</span>
              <span className="fb-tag green">Текст + файл</span>
            </div>
          </div>
          <div className="feature-block">
            <div className="fb-eyebrow">Действия проверяющего</div>
            <div className="fb-title">Инструменты куратора</div>
            <div className="fb-body">
              Оставить комментарий, изменить статус, прикрепить ответный файл, вернуть
              на доработку — всё в едином интерфейсе.
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section" id="acceptance">
        <div className="section-header">
          <div className="section-index">04</div>
          <div className="section-info">
            <div className="section-label">Продажи</div>
            <div className="section-title">Каталог и покупка курсов</div>
          </div>
        </div>
        <div className="wide-block">
          <div className="wide-grid">
            <div className="wide-item">
              <div className="wi-label">Карточка курса</div>
              <ul className="wi-list">
                <li>Название и описания</li>
                <li>Обложка, стоимость, автор</li>
                <li>Длительность и уроки</li>
                <li>Программа курса</li>
                <li>Кнопки Купить / Подробнее</li>
              </ul>
            </div>
            <div className="wide-item">
              <div className="wi-label">Поиск и фильтры</div>
              <ul className="wi-list">
                <li>Фильтр по категории</li>
                <li>Фильтр по преподавателю</li>
                <li>Сортировка по цене</li>
                <li>Сортировка по популярности</li>
                <li>Поиск по названию</li>
              </ul>
            </div>
            <div className="wide-item">
              <div className="wi-label">Оформление заказа</div>
              <ul className="wi-list">
                <li>Корзина</li>
                <li>Выбор способа оплаты</li>
                <li>Авто-открытие доступа</li>
                <li>Уведомление об оплате</li>
                <li>Статусы заказа</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="section-header">
          <div className="section-index">05</div>
          <div className="section-info">
            <div className="section-label">Интерфейс</div>
            <div className="section-title">Личные кабинеты</div>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-block">
            <div className="fb-eyebrow">Клиент / Ученик</div>
            <div className="fb-title">Кабинет учащегося</div>
            <div className="fb-tags">
              <span className="fb-tag">Мои курсы</span>
              <span className="fb-tag">Покупки</span>
              <span className="fb-tag">Прогресс</span>
              <span className="fb-tag">Задания</span>
              <span className="fb-tag">Уведомления</span>
              <span className="fb-tag">Профиль</span>
              <span className="fb-tag">История</span>
            </div>
          </div>
          <div className="feature-block">
            <div className="fb-eyebrow">Сотрудник</div>
            <div className="fb-title">Кабинет куратора</div>
            <div className="fb-tags">
              <span className="fb-tag">Мои курсы</span>
              <span className="fb-tag">Ученики</span>
              <span className="fb-tag">Входящие задания</span>
              <span className="fb-tag">Фильтры статусов</span>
              <span className="fb-tag">Комментарии</span>
              <span className="fb-tag">Материалы</span>
            </div>
          </div>
        </div>
        <div className="feature-block dark">
          <div className="fb-eyebrow">Администратор</div>
          <div className="fb-title">Административная панель</div>
          <div className="fb-tags">
            <span className="fb-tag">Пользователи</span>
            <span className="fb-tag">Роли</span>
            <span className="fb-tag">Курсы</span>
            <span className="fb-tag">Уроки</span>
            <span className="fb-tag">Задания</span>
            <span className="fb-tag">Файлы</span>
            <span className="fb-tag">Платежи</span>
            <span className="fb-tag">Заказы</span>
            <span className="fb-tag">Уведомления</span>
            <span className="fb-tag">Настройки</span>
            <span className="fb-tag">Отчёты</span>
          </div>
          <div className="admin-actions">
            {role === 'admin' ? (
              <button className="admin-action-btn" onClick={() => setPage('admin-panel')}>
                Открыть админ-панель
              </button>
            ) : (
              <button
                className="admin-action-btn admin-action-btn-ghost"
                onClick={() => {
                  setAuthRole('admin')
                  setPage('login')
                }}
              >
                Войти как админ
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="section-header">
          <div className="section-index">06</div>
          <div className="section-info">
            <div className="section-label">Требования</div>
            <div className="section-title">Технические параметры</div>
          </div>
        </div>
        <div className="tech-grid">
          <div className="tech-card">
            <div className="tc-num">4</div>
            <div className="tc-label">Устройства</div>
            <div className="tc-desc">
              Адаптивный дизайн: ПК, планшет, мобильный, большие экраны
            </div>
          </div>
          <div className="tech-card">
            <div className="tc-num">4</div>
            <div className="tc-label">Роли в системе</div>
            <div className="tc-desc">
              Масштабируемая ролевая модель с возможностью расширения
            </div>
          </div>
          <div className="tech-card">
            <div className="tc-num">6</div>
            <div className="tc-label">Статусов заказа</div>
            <div className="tc-desc">
              Новый, ожидает оплаты, оплачен, отменён, завершён + черновик
            </div>
          </div>
          <div className="tech-card">
            <div className="tc-num">TLS</div>
            <div className="tc-label">Безопасность</div>
            <div className="tc-desc">
              Шифрование паролей, журналирование, защита форм, разграничение прав
            </div>
          </div>
          <div className="tech-card">
            <div className="tc-num">JWT</div>
            <div className="tc-label">Видеодоступ</div>
            <div className="tc-desc">
              Временные токенизированные ссылки, потоковая отдача, нет прямых URL
            </div>
          </div>
          <div className="tech-card">
            <div className="tc-num">XLS</div>
            <div className="tc-label">Экспорт</div>
            <div className="tc-desc">
              Отчёты по пользователям, курсам, заданиям в Excel или PDF
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="section-header">
          <div className="section-index">07</div>
          <div className="section-info">
            <div className="section-label">Финал</div>
            <div className="section-title">Критерии приёмки</div>
          </div>
        </div>
        <div className="accept-list">
          <div className="accept-row">
            <span className="ar-num">01</span>
            <span className="ar-text">
              Роли пользователей работают корректно, права разграничены
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">02</span>
            <span className="ar-text">
              Курсы создаются, редактируются и отображаются в каталоге
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">03</span>
            <span className="ar-text">
              Доступ к урокам открывается автоматически после оплаты
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">04</span>
            <span className="ar-text">
              Видео воспроизводится без возможности штатного скачивания
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">05</span>
            <span className="ar-text">Ученик может отправить задание в нужном формате</span>
          </div>
          <div className="accept-row">
            <span className="ar-num">06</span>
            <span className="ar-text">
              Сотрудник и администратор могут проверить задание с комментарием
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">07</span>
            <span className="ar-text">
              Файлы загружаются и привязываются к курсу, уроку, заданию
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">08</span>
            <span className="ar-text">
              Личные кабинеты работают корректно для всех ролей
            </span>
          </div>
          <div className="accept-row">
            <span className="ar-num">09</span>
            <span className="ar-text">
              Уведомления отправляются внутри платформы и на email
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

export default App
