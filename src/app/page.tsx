import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Gustavo AI</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <Link href="/waitlist" className={styles.ctaButton}>Join Waitlist</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Revolutionize Your Property Management with AI
            </h1>
            <p className={styles.heroSubtitle}>
              Gustavo AI streamlines property management with intelligent automation, 
              predictive analytics, and seamless tenant communication. 
              Manage your properties smarter, not harder.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/waitlist" className={styles.primaryButton}>Join the Waitlist</Link>
              <button className={styles.secondaryButton}>Watch Demo</button>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10,000+</span>
                <span className={styles.statLabel}>Properties Managed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Satisfaction Rate</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>AI Support</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imagePlaceholder}>
              <span>AI Dashboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Powerful Features</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to manage properties efficiently with AI
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI-Powered Automation</h3>
              <p>Automate routine tasks like rent collection, maintenance requests, and tenant screening with intelligent AI algorithms.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Predictive Analytics</h3>
              <p>Get insights into property performance, market trends, and maintenance predictions to maximize your ROI.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Smart Communication</h3>
              <p>AI-powered tenant communication with instant responses, automated notifications, and 24/7 support.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Intelligent Screening</h3>
              <p>Advanced tenant screening with AI analysis of credit history, rental history, and risk assessment.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Mobile App</h3>
              <p>Manage your properties on the go with our intuitive mobile app for both property managers and tenants.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3>Secure & Compliant</h3>
              <p>Bank-level security with GDPR compliance and regular security audits to protect your data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            <p className={styles.sectionSubtitle}>
              Join thousands of satisfied property managers
            </p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"Gustavo AI has transformed how we manage our 200+ properties. The AI automation saves us 20+ hours per week!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>SM</div>
                <div className={styles.authorInfo}>
                  <h4>Sarah Martinez</h4>
                  <span>Property Manager, Urban Real Estate</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"The predictive analytics helped us increase our rental income by 15% in just 6 months. Incredible ROI!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>MJ</div>
                <div className={styles.authorInfo}>
                  <h4>Michael Johnson</h4>
                  <span>CEO, Johnson Properties</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"24/7 AI support means our tenants get instant help, and we get peace of mind. Game changer!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>LC</div>
                <div className={styles.authorInfo}>
                  <h4>Lisa Chen</h4>
                  <span>Property Owner, Chen Holdings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p className={styles.sectionSubtitle}>
              Choose the plan that fits your portfolio size
            </p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Starter</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>29</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p>Perfect for small portfolios</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Up to 10 properties</li>
                <li>Basic AI automation</li>
                <li>Tenant screening</li>
                <li>Mobile app access</li>
                <li>Email support</li>
              </ul>
              <Link href="/waitlist" className={styles.pricingButton}>Join Waitlist</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.featuredBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Professional</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>79</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p>Ideal for growing portfolios</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Up to 50 properties</li>
                <li>Advanced AI automation</li>
                <li>Predictive analytics</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
                <li>Advanced reporting</li>
              </ul>
              <Link href="/waitlist" className={styles.pricingButton}>Join Waitlist</Link>
            </div>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Enterprise</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>199</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p>For large property companies</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Unlimited properties</li>
                <li>Custom AI models</li>
                <li>Dedicated account manager</li>
                <li>API access</li>
                <li>White-label options</li>
                <li>24/7 phone support</li>
              </ul>
              <Link href="/waitlist" className={styles.pricingButton}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Property Management?</h2>
            <p>Join thousands of property managers who trust Gustavo AI</p>
            <div className={styles.ctaButtons}>
              <Link href="/waitlist" className={styles.primaryButton}>Join the Waitlist</Link>
              <button className={styles.secondaryButton}>Schedule Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>Gustavo AI</h3>
              <p>Revolutionizing property management with artificial intelligence.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#testimonials">Testimonials</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#status">Status</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Gustavo AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
