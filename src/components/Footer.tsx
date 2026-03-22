import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#c8c4bc]">
          &copy; {new Date().getFullYear()} Confetti. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link to="/privacy" className="text-[#c8c4bc] hover:text-paper transition focus:outline-none focus:ring-2 focus:ring-primary rounded">Privacy Policy</Link>
          <Link to="/terms" className="text-[#c8c4bc] hover:text-paper transition focus:outline-none focus:ring-2 focus:ring-primary rounded">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}