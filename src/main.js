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
