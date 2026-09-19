import { AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supportContacts } from "../../data/support";

export function HulplijnenSection() {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        {supportContacts.map((contact) => (
          <Card
            key={contact.id}
            className="border-l-4 transition-shadow hover:shadow-md"
            style={{ borderColor: contact.color }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
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
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Button variant="link" asChild className="h-auto max-w-full p-0 text-indigo-500">
                      <a href={`mailto:${contact.email}`} className="min-w-0 break-all">
                        <Mail size={14} />
                        {contact.email}
                      </a>
                    </Button>
                    <Button variant="link" asChild className="h-auto p-0 text-indigo-500">
                      <a href={`tel:${contact.tel}`}>
                        <Phone size={14} />
                        {contact.tel}
                      </a>
                    </Button>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} />
                      {contact.locatie}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert variant="warning">
        <AlertCircle className="size-4" />
        <AlertTitle className="font-poppins">Noodgevallen?</AlertTitle>
        <AlertDescription>
          Voor spoedeisende kwesties kunt u altijd contact opnemen met de
          receptie op campus R26 (024-353 0500) of door persoonlijk langs te
          gaan.
        </AlertDescription>
      </Alert>
    </div>
  );
}
