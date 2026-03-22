import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="px-6 py-24 md:py-36 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-800 leading-tight mb-6">
          Throw parties,<br />not spreadsheets.
        </h1>
        <p className="text-lg md:text-xl text-[#6b6862] max-w-xl mx-auto mb-10">
          Create beautiful event pages, share a single link, and watch RSVPs roll in. No app download required for your guests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-white font-mono font-500 rounded-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Create your first event
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 border-2 border-primary-dark text-primary-dark font-mono font-500 rounded-lg hover:bg-primary-dark hover:text-white transition focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="bg-ink text-paper px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-600 text-center mb-14">
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-primary text-3xl mb-3">🎉</div>
              <h3 className="font-serif text-xl font-600 mb-2">One-link invites</h3>
              <p className="text-[#c8c4bc] text-sm leading-relaxed">
                Share a single link via text, email, or social. Guests RSVP in seconds — no account needed.
              </p>
            </div>
            <div>
              <div className="text-primary text-3xl mb-3">📋</div>
              <h3 className="font-serif text-xl font-600 mb-2">Live guest list</h3>
              <p className="text-[#c8c4bc] text-sm leading-relaxed">
                See who's coming, who's maybe, and who can't make it — updated in real time on your dashboard.
              </p>
            </div>
            <div>
              <div className="text-primary text-3xl mb-3">✨</div>
              <h3 className="font-serif text-xl font-600 mb-2">Beautiful by default</h3>
              <p className="text-[#c8c4bc] text-sm leading-relaxed">
                Every event page looks stunning out of the box. Pick a color, add the details, and you're live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-600 mb-6">
          Ready to ditch the group chat?
        </h2>
        <p className="text-[#6b6862] max-w-md mx-auto mb-8">
          Your next event deserves better than "who's in?" on 14 different threads.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-white font-mono font-500 rounded-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Get started free
        </Link>
      </section>
    </div>
  )
}