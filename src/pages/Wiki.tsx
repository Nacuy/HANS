import { Home, Globe, AlertCircle } from "lucide-react"

export function Wiki() {
  return (
    <div className="p-6 max-w-[900px] space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">Wiki</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Praktische informatie en tips voor studenten in Arnhem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="hans-card hans-card-hover p-6 border-l-4 border-green-500">
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
              <a
                href="#"
                className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 font-semibold text-sm"
              >
                <Globe size={14} />
                Bekijk beschikbare kamers
              </a>
            </div>
          </div>
        </div>

        <div className="hans-card p-6 bg-amber-50 border border-amber-100">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="text-amber-600 shrink-0" size={18} />
            <div>
              <h4 className="font-poppins font-semibold text-amber-900 mb-1">
                Kosten
              </h4>
              <p className="text-sm text-amber-800">
                Gemiddeld kun je rekenen op €400-600 per maand voor een kamer in
                Arnhem. Gebruik de HAN-calculator voor een betere schatting.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="hans-card p-4">
            <h4 className="font-poppins font-semibold text-slate-800 mb-2">
              OV-studentenkaart
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Korting op trein- en buskaarten met je HAN-studentenkaart.
            </p>
            <button className="btn-primary text-xs">Info opvragen</button>
          </div>

          <div className="hans-card p-4">
            <h4 className="font-poppins font-semibold text-slate-800 mb-2">
              Financiële ondersteuning
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Studiefinanciering en beurzen via DUO en HAN.
            </p>
            <button className="btn-primary text-xs">Meer info</button>
          </div>
        </div>
      </div>

      {/* <div className="hans-card p-5">
        <h4 className="font-poppins font-semibold text-slate-800 mb-3">
          Tips voor studenten
        </h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>✓ Meld je aan op HousingAnywhere voor internationale huizen</li>
          <li>✓ Check Funda en Kamernet voor particuliere aanbieders</li>
          <li>✓ Bezoek de student introductiedagen voor meer tips</li>
          <li>✓ Sluit een inboedelverzekering af</li>
        </ul>
      </div> */}
    </div>
  )
}
