export const metadata = {
  title: 'Subscribed — SchoolContent',
};

export default function SubscribedPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>✉️</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>You&apos;re on the list</h1>
        <p style={{ fontSize: '1rem', color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: '2rem' }}>
          Thanks for subscribing. We&apos;ll send you updates when new schools are added, new analysis is published, and new features launch.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/search" className="btn btn-primary">Browse all schools →</a>
          <a href="/admissions" className="btn btn-outline">Admissions pages</a>
        </div>
      </div>
    </div>
  );
}
