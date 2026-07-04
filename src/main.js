import VanillaTilt from 'vanilla-tilt'

document.querySelector('#year').textContent = new Date().getFullYear()

const navToggle = document.querySelector('#nav-toggle')
const mainNav = document.querySelector('#main-nav')

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open')
  navToggle.classList.toggle('is-open', isOpen)
  navToggle.setAttribute('aria-expanded', String(isOpen))
})

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open')
    navToggle.classList.remove('is-open')
    navToggle.setAttribute('aria-expanded', 'false')
  })
})

// Stats count-up, triggered once each number scrolls into view.
const statNumbers = document.querySelectorAll('.stat-number')

const animateStat = (el) => {
  const target = parseFloat(el.dataset.target)
  const decimals = parseInt(el.dataset.decimals ?? '0', 10)
  const suffix = el.dataset.suffix ?? ''
  const duration = 1400
  const start = performance.now()

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = (target * eased).toFixed(decimals) + suffix
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateStat(entry.target)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.5 })

statNumbers.forEach((el) => statsObserver.observe(el))

// Business hours / "open now" indicator (America/Sao_Paulo time).
// Placeholder schedule — replace with the real opening hours.
const hoursBadge = document.querySelector('#hours-badge')
const schedule = {
  0: null, // domingo: fechado
  1: [480, 1080], // segunda: 08:00–18:00
  2: [480, 1080],
  3: [480, 1080],
  4: [480, 1080],
  5: [480, 1080],
  6: [480, 720], // sábado: 08:00–12:00
}
const dayPhrases = [
  'no domingo',
  'na segunda-feira',
  'na terça-feira',
  'na quarta-feira',
  'na quinta-feira',
  'na sexta-feira',
  'no sábado',
]

const formatTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m}`
}

const getSaoPauloTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

  return {
    day: weekdays[map.weekday],
    minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10),
  }
}

const updateHoursBadge = () => {
  const { day, minutes } = getSaoPauloTime()
  const todayRange = schedule[day]
  const dot = hoursBadge.querySelector('.hours-dot')
  const text = hoursBadge.querySelector('.hours-text')
  const isOpen = todayRange && minutes >= todayRange[0] && minutes < todayRange[1]

  if (isOpen) {
    dot.className = 'hours-dot is-open'
    text.textContent = `Aberto agora · Fecha às ${formatTime(todayRange[1])}`
    return
  }

  dot.className = 'hours-dot is-closed'

  for (let i = 0; i <= 7; i++) {
    const checkDay = (day + i) % 7
    const range = schedule[checkDay]
    if (range && (i > 0 || minutes < range[0])) {
      const label = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : dayPhrases[checkDay]
      text.textContent = `Fechado agora · Abre ${label} às ${formatTime(range[0])}`
      return
    }
  }

  text.textContent = 'Fechado agora'
}

if (hoursBadge) {
  updateHoursBadge()
  setInterval(updateHoursBadge, 60_000)
}

// Scroll-reveal: fade/slide elements in once as they enter the viewport.
const revealTargets = document.querySelectorAll(
  '.card, .gallery-item, .contact-card, .about-figure, .about-text, .promo-banner, .map-frame'
)

revealTargets.forEach((el) => el.classList.add('reveal'))

document.querySelectorAll('.card-grid, .gallery-grid, .contact-grid').forEach((grid) => {
  Array.from(grid.children).forEach((child, index) => {
    child.style.setProperty('--reveal-delay', `${index * 70}ms`)
  })
})

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 }
)

revealTargets.forEach((el) => revealObserver.observe(el))

// Subtle hover tilt on service cards.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
  VanillaTilt.init(document.querySelectorAll('.card'), {
    max: 8,
    speed: 400,
    scale: 1.03,
  })
}
