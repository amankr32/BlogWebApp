import { Link } from "react-router-dom";
import { Command, Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-[--color-border] bg-[--color-surface]/50 mt-24">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <Command size={13} className="text-black stroke-[2.5]" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Ink<span className="text-[--color-brand-hover]">Flow</span>
            </span>
          </Link>
          <p className="text-sm text-[--color-text-muted] leading-relaxed mb-4">
            A modern blogging platform built for developers and creators.
          </p>
          <div className="flex gap-3">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-[--color-text-muted] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {[
          {
            title: "Platform",
            links: [
              { to: "/blogs", label: "Explore" },
              { to: "/create", label: "Write Article" },
              { to: "/dashboard", label: "Dashboard" },
            ],
          },
          {
            title: "Categories",
            links: [
              { to: "/blogs?category=Technology", label: "Technology" },
              { to: "/blogs?category=Programming", label: "Programming" },
              { to: "/blogs?category=Design", label: "Design" },
            ],
          },
          {
            title: "Company",
            links: [
              { to: "/", label: "About" },
              { to: "/", label: "Privacy" },
              { to: "/", label: "Terms" },
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[--color-text-muted] mb-4">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-[--color-text-muted] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[--color-border] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[--color-text-muted]">
          © {new Date().getFullYear()} InkFlow. All rights reserved.
        </p>
        <p className="text-xs text-[--color-text-muted] flex items-center gap-1.5">
          Made with <Heart size={11} className="text-red-500 fill-red-500" />{" "}
          for developers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
