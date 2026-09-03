export const Urls = {
  brightspace: "https://leren.han.nl/",
  osiris: "https://han.osiris-student.nl/",
  teams: "https://teams.cloud.microsoft/",
  outlook: "https://outlook.office.com/mail/",
  isas: "https://isas.han.nl/default.aspx",
  ans: "https://www.ans.app/",
  myx: "https://han.myx.nl/",
  studiepuntenRegelementen:
    "https://www1.han.nl/insite/studenten/jouw-opleiding/hbo/ict/voltijd/rechten-en-plichten/bacheloropleiding-ict-voltijd.pdf",
  studentenverenigingICT: "https://svxtend.nl/",
} as const

export type UrlKey = keyof typeof Urls
