import { Home, Globe, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PraktischSection() {
  return (
    <div className="space-y-4 pt-4">
      <Card className="border-l-4 border-l-green-500 transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Home className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-poppins font-bold text-slate-900 text-base mb-2">
                Huisvesting
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                HAN biedt studentenhuisvesting aan via de studentenhuisvesting
                webportal. Je kunt hier zoeken naar kamers in Arnhem en
                omgeving.
              </p>
              <Button variant="link" asChild className="h-auto p-0 text-indigo-500">
                <a href="#">
                  <Globe size={14} />
                  Bekijk beschikbare kamers
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert variant="warning">
        <AlertCircle className="size-4" />
        <AlertTitle className="font-poppins">Kosten</AlertTitle>
        <AlertDescription>
          Gemiddeld kun je rekenen op €400-600 per maand voor een kamer in
          Arnhem. Gebruik de HAN-calculator voor een betere schatting.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="font-poppins text-base text-slate-800">
              OV-studentenkaart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 mb-3">
              Korting op trein- en buskaarten met je HAN-studentenkaart.
            </p>
            <Button size="sm" className="font-poppins">
              Info opvragen
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="font-poppins text-base text-slate-800">
              Financiële ondersteuning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 mb-3">
              Studiefinanciering en beurzen via DUO en HAN.
            </p>
            <Button size="sm" className="font-poppins">
              Meer info
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
