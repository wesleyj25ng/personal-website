// Keep anchor-link scrolling from landing under the sticky nav bar
;(function () {
    const navBar = document.getElementById('nav-bar')
    if (!navBar) return

    function syncNavOffset() {
        document.documentElement.style.scrollPaddingTop = navBar.offsetHeight + 'px'
    }

    syncNavOffset()
    window.addEventListener('resize', syncNavOffset)
})();

// Fade in section content as the user scrolls to it
;(function () {
    const staggerGroups = ['.about li', '.timeline-item', '.project-container']
    const singleTargets = ['.about-section', '.experience > h1', '.projects > h1', 'footer']

    staggerGroups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal')
            el.style.animationDelay = `${Math.min(i, 8) * 0.08}s`
        })
    })

    document.querySelectorAll(singleTargets.join(',')).forEach((el) => {
        el.classList.add('reveal')
    })

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target
                el.classList.add('is-visible')
                el.addEventListener('animationend', () => {
                    el.classList.remove('is-visible')
                    el.classList.add('revealed')
                }, { once: true })
                observer.unobserve(el)
            }
        })
    }, { threshold: 0.15 })

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})();

// Interactive particle background that follows the mouse
;(function () {
    const canvas = document.getElementById('hero-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const hero = document.getElementById('hero')

    let width, height
    let particles = []
    let mouse = { x: null, y: null }
    let glow = { x: null, y: null }

    const ACCENT = '64, 255, 175'
    const LINK_DIST = 130
    const MOUSE_DIST = 220

    function resize() {
        width = hero.clientWidth
        height = hero.clientHeight
        canvas.width = width
        canvas.height = height
        const count = Math.floor((width * height) / 12000)
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.8
        }))
    }

    function onMouseMove(e) {
        const rect = hero.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
    }

    function onMouseLeave() {
        mouse.x = null
        mouse.y = null
    }

    function step() {
        // ease the glow toward the mouse for a smooth trailing feel
        if (mouse.x !== null) {
            glow.x = glow.x === null ? mouse.x : glow.x + (mouse.x - glow.x) * 0.08
            glow.y = glow.y === null ? mouse.y : glow.y + (mouse.y - glow.y) * 0.08
        }

        ctx.clearRect(0, 0, width, height)

        // soft glow that trails the cursor
        if (glow.x !== null) {
            const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 260)
            gradient.addColorStop(0, `rgba(${ACCENT}, 0.05)`)
            gradient.addColorStop(1, `rgba(${ACCENT}, 0)`)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
        }

        // move + draw particles
        for (const p of particles) {
            p.x += p.vx
            p.y += p.vy
            if (p.x < 0 || p.x > width) p.vx *= -1
            if (p.y < 0 || p.y > height) p.vy *= -1

            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${ACCENT}, 0.6)`
            ctx.fill()
        }

        // connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j]
                const dx = a.x - b.x, dy = a.y - b.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < LINK_DIST) {
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.strokeStyle = `rgba(${ACCENT}, ${0.15 * (1 - dist / LINK_DIST)})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
        }

        // connect particles to the mouse
        if (mouse.x !== null) {
            for (const p of particles) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < MOUSE_DIST) {
                    ctx.beginPath()
                    ctx.moveTo(p.x, p.y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.strokeStyle = `rgba(${ACCENT}, ${0.35 * (1 - dist / MOUSE_DIST)})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
        }

        requestAnimationFrame(step)
    }

    resize()
    window.addEventListener('resize', resize)
    hero.addEventListener('mousemove', onMouseMove)
    hero.addEventListener('mouseleave', onMouseLeave)
    requestAnimationFrame(step)
})()