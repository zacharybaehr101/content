
export const metadata = {
  title: 'Thank You — SchoolContent',
};

export default function SubmitThanksPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>✓</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>Submission received</h1>
        <p style={{ fontSize: '1rem', color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: '2rem' }}>
          Thank you for submitting your school. We will analyze your website and social profiles and notify you by email when your profile is live — usually within 2 weeks.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/search" className="btn btn-primary">Browse all schools →</a>
          <a href="/admissions" className="btn btn-outline">View admissions pages</a>
        </div>
      </div>
    </div>
  );
}
