import { LifeBuoy, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import { supportContacts } from "../data/support";

export function Support() {
  return (
    <div className="p-6 max-w-[1000px] space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">
          Hulplijnen & Ondersteuning
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Contact opnemen met studentbegeleiding, decaan of psycholoog.
        </p>
      </div>

      <div className="grid gap-4">
        {supportContacts.map((contact) => (
          <div
            key={contact.id}
            className="hans-card hans-card-hover p-5 border-l-4"
            style={{ borderColor: contact.color }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: contact.bg, color: contact.color }}
              >
                {contact.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-poppins font-bold text-slate-900 text-base mb-1">
                  {contact.naam}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {contact.wanneer}
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 font-semibold"
                  >
                    <Mail size={14} />
                    {contact.email}
                  </a>
                  <a
                    href={`tel:${contact.tel}`}
                    className="flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 font-semibold"
                  >
                    <Phone size={14} />
                    {contact.tel}
                  </a>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={14} />
                    {contact.locatie}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional resources */}
      <div className="hans-card p-5 bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-poppins font-semibold text-amber-900 text-sm mb-1">
              Noodgevallen?
            </h4>
            <p className="text-sm text-amber-800">
              Voor spoedeisende kwesties kunt u altijd contact opnemen met de
              receptie op campus R26 (024-353 0500) of door persoonlijk langs
              te gaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
