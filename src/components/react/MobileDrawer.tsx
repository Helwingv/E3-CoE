import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { nav } from "../../config/nav";
import { ChevronDown } from "lucide-react";

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setExpanded(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" style={{ isolation: 'isolate' }}>
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <aside
        className="absolute right-0 top-0 h-full w-80 shadow-2xl p-6 overflow-y-auto"
        style={{ backgroundColor: '#ffffff' }}
      >
        <button
          className="mb-6 text-lg font-medium text-gray-900 hover:text-e3-600 transition-colors"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕ Close
        </button>
        <nav className="space-y-2 flex flex-col">
          {nav.map((item) => (
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between text-gray-900 hover:text-e3-600 transition-colors py-2.5 font-medium"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expanded === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-4 space-y-1 pt-1">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block text-sm text-gray-600 hover:text-e3-600 transition-colors py-2"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-gray-900 hover:text-e3-600 transition-colors py-2.5 font-medium"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>
      </aside>
    </div>,
    document.body
  );
}
