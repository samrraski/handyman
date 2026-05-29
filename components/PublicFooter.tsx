import Link from "next/link";
import { Hammer, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/config";

export default function PublicFooter() {
  return (
    <footer className="bg-brand-black border-t border-brand-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-yellow rounded-md flex items-center justify-center">
                <Hammer size={14} className="text-brand-black" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-base">Nova<span className="text-brand-yellow">reno</span></span>
            </div>
            <p className="text-brand-gray-600 text-sm leading-relaxed">
              {BUSINESS.tagline}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about/our-story" className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Our Story</Link></li>
              <li><Link href="/about/process"   className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Our Process</Link></li>
              <li><Link href="/about/team"      className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Team</Link></li>
              <li><Link href="/projects"        className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Projects</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/kitchen"                 className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Kitchen Renovation</Link></li>
              <li><Link href="/services/basement-finishing"      className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Basement Finishing</Link></li>
              <li><Link href="/services/complete-home-renovation" className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Complete Renovation</Link></li>
              <li><Link href="/services/drywall"                 className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Drywall & Painting</Link></li>
              <li><Link href="/services/flooring"                className="text-brand-gray-600 hover:text-brand-yellow transition-colors">Flooring</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-yellow transition-colors">
                  <Phone size={13} />{BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-yellow transition-colors">
                  <Mail size={13} />{BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-brand-gray-600">
                <MapPin size={13} />{BUSINESS.area}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-gray-600 text-xs">
            © {new Date().getFullYear()} Novareno. All rights reserved.
          </p>
          <Link href="/calculator" className="text-brand-yellow text-xs font-semibold hover:underline">
            Get a Free Quote →
          </Link>
        </div>
      </div>
    </footer>
  );
}
