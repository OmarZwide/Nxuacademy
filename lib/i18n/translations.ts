import { z } from "zod";

export const languages = ['en-GB', 'zu', 'xh'] as const;
export type Language = typeof languages[number];

export const translations = {
  'en-GB': {
    nav: {
      home: "Home",
      courses: "Courses",
      about: "About",
    },
    hero: {
      title: "South Africa's Premier AWS & AI Training Academy",
      subtitle: "Join a diverse academic community in the Rainbow Nation",
      cta: "Join the Waiting List",
      preview: "Preview Dashboard",
    },
    features: {
      title: "Why Choose NXU Academy",
      subtitle: "Your gateway to professional AWS certification and artificial intelligence expertise",
      items: {
        awsPartnership: {
          title: "AWS Partnership",
          description: "Official AWS training partner providing internationally recognised certifications",
        },
        aiExpertise: {
          title: "AI & ML Expertise",
          description: "Specialised programmes in Artificial Intelligence and Machine Learning",
        },
        certification: {
          title: "Professional Certification",
          description: "Earn AWS certifications recognised by institutions worldwide",
        },
        location: {
          title: "Johannesburg Location",
          description: "Centrally situated campus with state-of-the-art facilities",
        },
      },
    },
    timeline: {
      title: "Our Journey in Technology Education",
      subtitle: "Celebrating South Africa's advancement in technology education and diversity",
      culturalContext: {
        1994: "Dawn of Democracy - Beginning of the Rainbow Nation era",
        2004: "Digital Access Initiative - Bridging the digital divide",
        2015: "AWS Africa Expansion - Cloud computing reaches Southern Africa",
        2020: "AWS Africa Region - Significant milestone for African cloud computing",
        2025: "NXU Academy Launch - Next generation of diverse technology leaders",
      },
    },
  },
  zu: {
    nav: {
      home: "Ikhaya",
      courses: "Izifundo",
      about: "Mayelana",
    },
    hero: {
      title: "I-Academy Ephambili ye-AWS ne-AI eNingizimu Afrika",
      subtitle: "Joyina umphakathi ohlukahlukene wabafundi eSizweni se-Rainbow",
      cta: "Joyina uhla lokulinda",
      preview: "Buka iDashboard",
    },
    features: {
      title: "Kungani Ukhetha i-NXU Academy",
      subtitle: "Isango lakho lokuthola isitifiketi se-AWS kanye nobuchwepheshe be-AI",
      items: {
        awsPartnership: {
          title: "Ubambiswano ne-AWS",
          description: "Umlingani wokuqeqesha we-AWS osemthethweni onikeza izitifiketi ezamukelwa yimboni",
        },
        aiExpertise: {
          title: "Ubuchwepheshe be-AI & ML",
          description: "Izifundo ezikhethekile ze-Artificial Intelligence ne-Machine Learning",
        },
        certification: {
          title: "Isitifiketi Sobungcweti",
          description: "Thola izitifiketi ze-AWS ezamukelwa umhlaba wonke",
        },
        location: {
          title: "Indawo yase-Johannesburg",
          description: "Ikhampasi esendaweni ephakathi nezakhiwo zesimanjemanje",
        },
      },
    },
    timeline: {
      title: "Uhambo Lwethu Kwimfundo Yezobuchwepheshe",
      subtitle: "Sigubha inqubekela phambili yeNingizimu Afrika kwimfundo yezobuchwepheshe kanye nokwahlukana",
      culturalContext: {
        1994: "Ukuqala kweDemokhrasi - Ukuqala kwesikhathi seRainbow Nation",
        2004: "Uhlelo Lokufinyelela Kwedijithali - Ukuxhumanisa ukuhlukaniswa kwedijithali",
        2015: "Ukwandisa i-AWS e-Afrika - Ukuphehla kwe-cloud computing eNingizimu ne-Afrika",
        2020: "Isifunda se-AWS Afrika - Umkhombandlela omkhulu we-cloud computing e-Afrika",
        2025: "Ukuqala kwe-NXU Academy - Isizukulwane esilandelayo sabaholi bezobuchwepheshe abahlukahlukene",
      },
    },
  },
  xh: {
    nav: {
      home: "Ikhaya",
      courses: "Izifundo",
      about: "Malunga",
    },
    hero: {
      title: "Iziko Lokuqeqesha i-AWS ne-AI eliPhambili loMzantsi Afrika",
      subtitle: "Joyina uluntu olwahlukeneyo lwabafundi kwisizwe seRainbow",
      cta: "Joyina uluhlu lokulinda",
      preview: "Jonga iDashboard",
    },
    features: {
      title: "Kutheni Ukhetha i-NXU Academy",
      subtitle: "Isango lakho kwisatifikethi se-AWS kunye nobungcali be-AI",
      items: {
        awsPartnership: {
          title: "Ubuhlakani be-AWS",
          description: "Iqabane lokuqeqesha le-AWS elisemthethweni elinika izatifikethi ezamkelwa yishishini",
        },
        aiExpertise: {
          title: "Ubungcali be-AI & ML",
          description: "Izifundo ezikhethekileyo ze-Artificial Intelligence ne-Machine Learning",
        },
        certification: {
          title: "Isatifikethi Sobungcali",
          description: "Fumana izatifikethi ze-AWS ezamkelwa kwihlabathi liphela",
        },
        location: {
          title: "Indawo yaseJohannesburg",
          description: "Ikhampasi ekwindawo ephakathi nezakhiwo zexesha",
        },
      },
    },
    timeline: {
      title: "Uhambo Lwethu KwiMfundo YezobuChwepheshe",
      subtitle: "Sibhiyozela inkqubela phambili yoMzantsi Afrika kwimfundo yezobuchwepheshe nokwahluka-hluka",
      culturalContext: {
        1994: "Ukuvela kweDemokhrasi - Ukuqala kwexesha leRainbow Nation",
        2004: "INkqubo yokuFikelela kwiDijithali - Ukudibanisa umsantsa wedijithali",
        2015: "Ukwanda kwe-AWS e-Afrika - Ukufikelela kwe-cloud computing kuMzantsi Afrika",
        2020: "INgingqi ye-AWS Afrika - Indlela enkulu ye-cloud computing e-Afrika",
        2025: "Ukuqala kwe-NXU Academy - Isizukulwane esilandelayo seenkokheli zezobuchwepheshe ezahlukeneyo",
      },
    },
  },
} as const;

export const translationSchema = z.object({
  nav: z.object({
    home: z.string(),
    courses: z.string(),
    about: z.string(),
  }),
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    cta: z.string(),
    preview: z.string(),
  }),
  features: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.object({
      awsPartnership: z.object({
        title: z.string(),
        description: z.string(),
      }),
      aiExpertise: z.object({
        title: z.string(),
        description: z.string(),
      }),
      certification: z.object({
        title: z.string(),
        description: z.string(),
      }),
      location: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
  }),
  timeline: z.object({
    title: z.string(),
    subtitle: z.string(),
    culturalContext: z.record(z.string(), z.string()),
  }),
});

export type Translation = z.infer<typeof translationSchema>;