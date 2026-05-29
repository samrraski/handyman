import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { BUSINESS } from "@/lib/config";
import { CheckCircle2, Phone, Hammer } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-brand-gray-100">
      <PublicNav />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-10 shadow-sm">
          <CheckCircle2 size={52} className="text-brand-yellow mx-auto mb-5" />
          <h1 className="text-2xl font-extrabold text-brand-black mb-2">Request Received!</h1>
          <p className="text-brand-gray-600 leading-relaxed mb-6">
            Thanks for reaching out. We&apos;ll review your request and get back to you
            within <strong>24 hours</strong> to discuss your project.
          </p>
          <div className="bg-brand-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-gray-600 mb-1">Need to reach us sooner?</p>
            <a href={`tel:${BUSINESS.phone}`} className="flex items-center justify-center gap-2 text-brand-black font-bold hover:text-brand-yellow transition-colors">
              <Phone size={16} /> {BUSINESS.phone}
            </a>
          </div>
          <Link href="/" className="text-sm text-brand-yellow hover:text-brand-yellow-hover font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
      <footer className="bg-brand-black border-t border-brand-gray-800 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-brand-yellow rounded-md flex items-center justify-center">
            <Hammer size={12} className="text-brand-black" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-sm">{BUSINESS.name}</span>
        </div>
      </footer>
    </div>
  );
}
