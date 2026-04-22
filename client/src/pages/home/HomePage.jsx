import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './HomePage.module.css'
import {
  IconVideo,       // ✅ already there
  IconRosette,
  IconHome,
  IconMapPin,
  IconRadio,       // keep — still used in features array
  IconCoin,
  IconEye,
  IconShoppingBag,
  IconClock,
  IconDeviceMobile,
  IconStar,
  IconCircleCheckFilled,
  IconPointFilled
} from '@tabler/icons-react'

/* ── Static Data ───────────────────────────── */

const differentiators = [
  {
    icon: <IconEye size={32} stroke={1.5} color="#FFFFFF" />,
    title: '100% cooking process visible',
    sub: 'Watch before you order'
  },
  {
    icon: <IconVideo size={32} stroke={1.5} color="#FFFFFF" />,
    title: 'Live or recorded',
    sub: 'You choose the experience'
  },
  {
    icon: <IconCircleCheckFilled size={32} color="#FFFFFF" />,
    title: 'Zero mystery ingredients',
    sub: 'Full recipe transparency'
  },
  {
    icon: <IconHome size={32} stroke={1.5} color="#FFFFFF" />,
    title: 'Real home kitchens only',
    sub: 'No cloud kitchens, ever'
  }
]

const features = [
  { icon: <IconVideo size={22} stroke={1.5} color="#ffffff" />, title: 'Watch it being made', desc: 'See the actual cooking process — live or recorded. No more mystery about what goes into your food.' },
  { icon: <IconRosette size={22} stroke={1.5} color="#ffffff" />, title: 'Verified home chefs', desc: 'Every chef is reviewed and rated by real customers. Trust scores built on transparency.' },
  { icon: <IconHome size={22} stroke={1.5} color="#ffffff" />, title: 'Real home cooking', desc: 'Not a restaurant. Not a cloud kitchen. Real people cooking real food in real kitchens.' },
  { icon: <IconMapPin size={22} stroke={1.5} color="#ffffff" />, title: 'Local and fresh', desc: 'Order from chefs in your area. Fresh ingredients, local flavours, delivered with care.' },
  { icon: <IconRadio size={22} stroke={1.5} color="#ffffff" />, title: 'Live cooking sessions', desc: 'Order a live session and watch your chef cook exclusively for you in real time.' },
  { icon: <IconCoin size={22} stroke={1.5} color="#ffffff" />, title: 'Fair for everyone', desc: 'Chefs earn more. Customers pay less. No middlemen taking massive cuts.' }
]

const steps = [
  {
    number: '1',
    title: 'Browse dishes',
    desc: 'Explore home-cooked dishes from verified chefs near you'
  },
  {
    number: '2',
    title: 'Watch the process',
    desc: 'See exactly how your food is made before you order'
  },
  {
    number: '3',
    title: 'Order with confidence',
    desc: 'Place your order knowing exactly what goes into it'
  }
]

const chefPerks = [
  { icon: <IconCoin size={18} stroke={1.5} />, text: 'Earn from your cooking skills' },
  { icon: <IconClock size={18} stroke={1.5} />, text: 'Cook on your own schedule' },
  { icon: <IconDeviceMobile size={18} stroke={1.5} />, text: 'Simple tools to manage orders' },
  { icon: <IconStar size={18} stroke={1.5} />, text: 'Build your reputation with reviews' }
]

/* ── Component ─────────────────────────────── */

function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Refs to track which sections to reveal on scroll
  const revealRefs = useRef([])

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'CHEF' ? '/chef/dashboard' : '/feed')
    } else {
      navigate('/register')
    }
  }

  /* ── Scroll Reveal (IntersectionObserver) ──
     Concept: Browser watches each .reveal element.
     When element enters viewport (even 10% visible),
     we add 'is-visible' class → CSS transition plays.
     This is more performant than scroll event listeners
     because the browser handles the detection natively.
  ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Stop watching after revealed — no need to re-trigger
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 } // trigger when 10% of element is visible
    )

    // Observe all elements with 'reveal' class
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    revealEls.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.page}>

      {/* ── HERO ─────────────────────────────── */}
      <section className={styles.hero}>

        {/* Left: text content — animates in on load */}
        <div className={`${styles.heroContent} animate-fade-in-up`}>
          <span className={styles.heroBadge}>
            <IconShoppingBag size={14} stroke={1.5} />
            Food transparency platform · Early access
          </span>

          <h1 className={styles.heroTitle}>
            Know exactly what goes into{' '}
            <span className={styles.heroTitleAccent}>your food</span>
          </h1>

          <p className={styles.heroSubtitle}>
            OpenPlate connects you with verified home chefs who share their
            actual cooking process — live or recorded. No secrets. Just real food.
          </p>

          <div className={styles.heroActions}>
            <button
              className={styles.heroPrimary}
              onClick={handleGetStarted}
            >
              {user ? 'Go to Feed' : 'Order Now'}
            </button>
            <button
              className={styles.heroSecondary}
              onClick={() => navigate('/register')}
            >
              Become a Chef
            </button>
          </div>
        </div>

        {/* Right: image — floats gently */}
        <div className={`${styles.heroImage} animate-float animate-fade-in delay-3`}>
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&auto=format&fit=crop&q=80"
            alt="Home chef cooking Indian food"
            className={styles.heroImg}
          />
          {/* Live badge overlay */}
          <div className={styles.heroImageBadge}>
            <IconPointFilled
              size={14}
              className={`${styles.liveDot} animate-pulse-dot`}
              style={{ color: '#E53935' }}
            />
            <div>
              <div className={styles.heroImageBadgeText}>Live cooking now</div>
              <div className={styles.heroImageBadgeSubtext}>
                Chef Supriya · Hyderabad
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── DIFFERENTIATORS BAR ──────────────── */}
      <div className={styles.diffBar}>
        <div className={styles.diffBarInner}>
          {differentiators.map((item, i) => (
            <div
              key={item.title}
              className={`${styles.diffItem} reveal delay-${i + 1}`}
            >
              <span className={styles.diffIcon}>{item.icon}</span>
              <span className={styles.diffTitle}>{item.title}</span>
              <span className={styles.diffSubtext}>{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className={styles.howItWorks}>
        <span className={`${styles.sectionBadge} reveal`}>How it works</span>
        <h2 className={`${styles.sectionTitle} reveal`}>
          Ordering is simple and transparent
        </h2>
        <p className={`${styles.sectionSubtitle} reveal`}>
          Three steps between you and a home-cooked meal you can trust
        </p>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`${styles.step} reveal delay-${i + 1}`}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────── */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <span className={`${styles.sectionBadge} reveal`}>Why OpenPlate</span>
          <h2 className={`${styles.sectionTitle} reveal`}>
            Food delivery, reimagined
          </h2>
          <p className={`${styles.sectionSubtitle} reveal`}>
            We built OpenPlate because you deserve to know what you're eating
          </p>

          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`${styles.featureCard} reveal delay-${(i % 3) + 1}`}
              >
                <div className={styles.featureIconWrap}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR CHEFS ────────────────────────── */}
      <section className={styles.forChefs}>

        {/* Image with badge overlay */}
        <div className={`${styles.forChefsImageWrap} reveal-left`}>
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&auto=format&fit=crop&q=80"
            alt="Home chef plating food"
            className={styles.forChefsImg}
          />
          <div className={styles.chefBadge}>
            <span className={styles.chefBadgeEmoji}>👩‍🍳</span>
            <div>
              <div className={styles.chefBadgeText}>Home chef · Verified</div>
              <div className={styles.chefBadgeSubtext}>
                Cooking biryani live right now
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${styles.forChefsContent} reveal-right`}>
          <span className={styles.sectionBadge}>For chefs</span>
          <h2 className={styles.forChefsTitle}>
            Turn your passion for cooking into income
          </h2>
          <p className={styles.forChefsDesc}>
            Join home chefs who are already earning by doing what they love.
            Set your own menu, your own prices, your own hours.
          </p>

          <div className={styles.perks}>
            {chefPerks.map((perk) => (
              <div key={perk.text} className={styles.perk}>
                <div className={styles.perkIcon}>{perk.icon}</div>
                <span>{perk.text}</span>
              </div>
            ))}
          </div>

          <button
            className={styles.heroPrimary}
            style={{ width: 'fit-content' }}
            onClick={() => navigate('/register')}
          >
            Start cooking for others
          </button>
        </div>

      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className={styles.cta}>
        <div className={`${styles.ctaInner} reveal`}>
          <h2 className={styles.ctaTitle}>
            Ready to eat food you can trust?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join OpenPlate today — free to sign up, no hidden fees.
            Currently accepting early access in Hyderabad.
          </p>
          <div className={styles.ctaActions}>
            <button
              className={styles.ctaPrimary}
              onClick={() => navigate('/register')}
            >
              Get early access
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2026 OpenPlate · Food transparency platform · Built with ❤️ in Hyderabad
        </p>
      </footer>

    </div>
  )
}

export default HomePage