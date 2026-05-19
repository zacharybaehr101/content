export const metadata = {
  title: 'Submit Your School — SchoolContent',
  description: 'Submit your Catholic school to the SchoolContent database. We do all the analysis work — just give us your URLs.',
};

export default function SubmitPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--red)' }}>Join the Database</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            Submit Your School
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
            We do all the analysis work. Just give us your school&apos;s information and links — we&apos;ll handle the rest and notify you when your profile is live.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>

          {/* Form */}
          <div>
            <form action="/api/submit" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <FormSection title="School Information">
                <FormField label="School / Institution Name" name="institutionName" required placeholder="e.g. Benet Academy" />
                <FormField label="School Type" name="type" type="select" required options={['Catholic High School', 'Catholic University / College', 'Catholic K-12 System', 'Archdiocese / Diocese', 'Other']} />
                <FormField label="Religious Order or Affiliation" name="religiousOrder" placeholder="e.g. Benedictine, Jesuit, Diocesan" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="City" name="city" required placeholder="e.g. Lisle" />
                  <FormField label="State" name="state" required placeholder="e.g. Illinois" />
                </div>
              </FormSection>

              <FormSection title="Website">
                <FormField label="Main Website URL" name="websiteUrl" required placeholder="e.g. benet.org" />
                <FormField label="Admissions Page URL" name="admissionsUrl" placeholder="e.g. benet.org/admissions" />
                <FormField label="Academics Page URL" name="academicsUrl" placeholder="e.g. benet.org/academics" />
                <FormField label="Faith & Mission Page URL" name="faithUrl" placeholder="e.g. benet.org/faith" />
              </FormSection>

              <FormSection title="Social Media">
                <FormField label="Instagram" name="instagram" placeholder="e.g. instagram.com/benetacademy" />
                <FormField label="Facebook" name="facebook" placeholder="e.g. facebook.com/benetacademy" />
                <FormField label="LinkedIn" name="linkedin" placeholder="e.g. linkedin.com/school/benet-academy" />
                <FormField label="X / Twitter" name="twitter" placeholder="e.g. twitter.com/benetacademy" />
                <FormField label="YouTube" name="youtube" placeholder="e.g. youtube.com/@benetacademy" />
                <FormField label="TikTok" name="tiktok" placeholder="e.g. tiktok.com/@benetacademy" />
              </FormSection>

              <FormSection title="Your Contact Information">
                <FormField label="Your Name" name="contactName" required placeholder="First and last name" />
                <FormField label="Your Email" name="contactEmail" type="email" required placeholder="you@school.org" />
                <FormField label="Your Role" name="contactRole" placeholder="e.g. Director of Communications" />
                <FormField label="Anything else we should know?" name="notes" type="textarea" placeholder="Special context about your school, enrollment goals, anything helpful for our analysis..." />
              </FormSection>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" name="subscribe" id="subscribe" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--navy)' }} />
                <label htmlFor="subscribe" style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', cursor: 'pointer' }}>
                  Notify me by email when my school is added to the database
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.95rem', padding: '14px 28px' }}>
                Submit your school →
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>How it works</div>
              {[
                { step: '1', text: 'Submit your school information and links' },
                { step: '2', text: 'We analyze your website, admissions page, and social profiles' },
                { step: '3', text: 'Your profile goes live in the database — usually within 2 weeks' },
                { step: '4', text: 'You get notified by email when it\'s ready' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {step}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6, marginTop: '4px' }}>{text}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>What we analyze</div>
              {[
                'Hero headlines and messaging strategy',
                'CTA labels and admissions language',
                'Faith identity and belonging signals',
                'Visual theology and image choices',
                'Social content themes and frequency',
                'Full narrative analysis',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'var(--ink-mid)', padding: '5px 0', borderBottom: '0.5px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--navy)' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--parchment-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--navy)' }}>This service is free.</strong> Submission and analysis costs you nothing. We add schools to help the Catholic school community benchmark and improve their communications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1.25rem' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, name, type = 'text', required, placeholder, options }: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}) {
  const baseStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    background: 'var(--parchment)',
    fontFamily: 'var(--font-body)',
    boxSizing: 'border-box' as const,
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '5px' }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: '3px' }}>*</span>}
      </label>
      {type === 'select' && options ? (
        <select name={name} required={required} style={{ ...baseStyle, appearance: 'none' }}>
          <option value="">Select...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} placeholder={placeholder} rows={4} style={{ ...baseStyle, resize: 'vertical' }} />
      ) : (
        <input type={type} name={name} required={required} placeholder={placeholder} style={baseStyle} />
      )}
    </div>
  );
}
