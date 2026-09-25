/* =====================================================================
   GRACIE HUMAITÁ VALENCIA — WEBSITE CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit to change what the website
   says: class times, phone number, testimonials, photos, all of it.

   How to edit safely:
     • Change the words between the "quote marks". Leave the quote marks.
     • Keep the comma at the end of each line.
     • Lines starting with // are notes for you. The website ignores them.
     • Save the file, then refresh the website to see the change.

   If the page goes blank after an edit, you probably deleted a quote
   mark or a comma. Undo your last change and try again.
   ===================================================================== */

window.SITE = {

  /* ---------- CONTACT DETAILS ---------- */
  gym: {
    name: "Gracie Humaitá Valencia",
    shortName: "Gracie Humaitá",
    city: "Valencia · CA",
    phone: "(310) 279-7140",
    email: "marioaiello10@gmail.com",
    street: "24749 Ave Rockefeller, Unit A",
    cityStateZip: "Santa Clarita, CA 91355",
    instagram: [
      { handle: "@graciejiujitsuvalencia", url: "https://www.instagram.com/graciejiujitsuvalencia/" },
      { handle: "@marioaiellobjj",         url: "https://www.instagram.com/marioaiellobjj/" },
    ],
    yelp: "https://www.yelp.com/biz/gracie-jiu-jitsu-valencia-santa-clarita-3",
    timeZone: "America/Los_Angeles",
  },

  /* ---------- TOP OF THE PAGE ----------
     Put *stars* around words to show them in yellow. */
  hero: {
    eyebrow: "Gracie Humaitá · Santa Clarita Valley",
    headline: "Train under a *coral belt.*",
    subhead: "Authentic Gracie Jiu-Jitsu in the Santa Clarita Valley. Kids, women, beginners and competitors, all taught by Master Mario Aiello, coral belt under Royler Gracie.",
    image: "assets/img/hero-mario.jpg",   // leave "" for no photo
  },

  stats: [
    { value: "Coral Belt", label: "Under Royler Gracie" },
    { value: "6 Days",     label: "Of classes every week" },
    { value: "Ages 3+",    label: "Kids, teens & adults" },
    { value: "World Champs", label: "From our kids competition team" },
  ],

  /* ---------- CLASS SCHEDULE ----------
     One line per class. To change the schedule, edit these lines.

       name:  what the class is called
       type:  which filter button it belongs to (see classTypes below)
       days:  "Mon Wed Fri"  or a range like  "Mon-Thu"
       time:  "4:30pm - 5:00pm", or just a start time like "7:00pm"
       note:  optional extra line, e.g. "No-gi"  (or leave it out)

     Days: Mon Tue Wed Thu Fri Sat Sun                                   */
  classTypes: {
    kids:        "Kids",
    adults:      "Adults",
    fundamentals: "Fundamentals",
    women:       "Women",
    competition: "Kids Competition",
  },

  schedule: {
    note: "Classes meet daily for all levels and ages. Arrive 5–10 minutes early ready to train. Schedule is subject to change, so call if you have questions.",
    // Shown under the schedule. Leave "" for none.
    footnote: "Kids Competition Class: participation requires an invitation from Master Mario.",
    // For classes listed with only a start time, how long to treat them as
    // lasting (in minutes). Only used for the "Happening now" badge.
    defaultLength: 90,
    classes: [
      // Kids
      { name: "Little Kids (ages 3–6)",  type: "kids",         days: "Mon Wed Fri", time: "4:15pm - 5:00pm" },
      { name: "Kids (ages 7+)",          type: "kids",         days: "Mon Wed Fri", time: "5:00pm - 6:00pm" },
      { name: "Kids No-Gi (ages 7+)",    type: "kids",         days: "Tue Thu",     time: "6:00pm - 7:00pm" },
      { name: "Kids No-Gi (all ages)",   type: "kids",         days: "Sat",         time: "9:00am - 10:00am" },
      // Kids competition (by invitation)
      { name: "Kids Competition (Gi)",    type: "competition", days: "Mon Wed Fri", time: "9:30am - 10:30am", note: "By invitation" },
      { name: "Kids Competition (No-Gi)", type: "competition", days: "Tue Thu",     time: "9:30am - 10:30am", note: "By invitation" },
      { name: "Kids Competition (Gi)",    type: "competition", days: "Mon Wed Fri", time: "6:00pm - 7:00pm",  note: "By invitation" },
      // Adults
      { name: "Adults",                  type: "adults",       days: "Mon-Fri",     time: "10:30am" },
      { name: "Adults",                  type: "adults",       days: "Mon-Thu",     time: "7:00pm" },
      { name: "Adults No-Gi",            type: "adults",       days: "Fri",         time: "7:00pm" },
      { name: "Adult Fundamentals",      type: "fundamentals", days: "Tue Thu",     time: "5:00pm - 6:00pm", note: "All levels · beginners welcome" },
      { name: "Adult Open Mat",          type: "adults",       days: "Sat",         time: "11:00am" },
      // Women
      { name: "Women's Class",           type: "women",        days: "Sat",         time: "10:00am - 11:00am" },
    ],
  },

  /* ---------- PROGRAMS ----------
     type:  links the "See class times" button to the schedule filter.
            Use "" for programs that aren't on the schedule (privates).
     image: a photo in assets/img/, or "" for a plain yellow-and-black panel. */
  programs: [
    {
      title: "Kids",
      type: "kids",
      ages: "Ages 3 and up",
      text: "Builds confidence, self-discipline and respect through excellent instruction and positive reinforcement, while keeping it fun. Bully-proof self-defense skills, and a kids competition team that has produced world champions.",
      image: "assets/img/kids-class.jpg",
    },
    {
      title: "Fundamentals",
      type: "fundamentals",
      ages: "All levels · beginners welcome",
      text: "The core of Gracie Jiu-Jitsu: escapes, positions and self-defense, taught step by step. The perfect place to start if you're new, and a class every level trains in to sharpen the basics.",
      image: "",
    },
    {
      title: "Adults",
      type: "adults",
      ages: "All levels · gi & no-gi",
      text: "Morning classes Monday through Friday, evening classes Monday through Thursday, no-gi on Friday nights, and an open mat on Saturdays. Self-defense, sport grappling, and a workout like you've never had.",
      image: "assets/img/mario-rolling.jpg",
    },
    {
      title: "Women",
      type: "women",
      ages: "All levels",
      text: "Superior training for female students of every level. Perfect for self-defense, or for women who want to compete at tournament level.",
      image: "assets/img/womens-class.jpg",
    },
    {
      title: "Kids Competition Team",
      type: "competition",
      ages: "By invitation · tournament training",
      // CONFIRM WITH MARIO: which world titles (e.g. IBJJF Kids Worlds, year) so this can be specific.
      text: "Tournament preparation, gi and no-gi, with the team that has produced world champions. Participation requires an invitation from Master Mario.",
      image: "",
    },
    {
      title: "Private Lessons",
      type: "",
      ages: "One-on-one with Master Mario",
      text: "Available on request. Get detailed, personal instruction built around your game, your goals and your schedule.",
      image: "assets/img/comp-team.jpg",
    },
  ],

  /* ---------- MASTER MARIO ---------- */
  master: {
    name: "Master Mario Aiello",
    title: "Head Instructor · Coral Belt",
    image: "assets/img/master-mario.jpg",
    bio: [
      "Master Mario Aiello is a coral belt under Royler Gracie and the head instructor of Gracie Humaitá Valencia. The coral belt is the rank of a master, or mestre, awarded only after decades as a black belt. His curriculum comes straight from the programs Grand Master Helio Gracie created for the original Gracie Humaitá academy in Rio de Janeiro.",
      "Students say the same thing about his teaching: he knows that each person learns differently, and he breaks techniques down until they click for everyone on the mat.",
    ],
    credentials: [
      "Coral belt under Royler Gracie, promoted at Gracie Humaitá in Rio de Janeiro, January 2026",
      "Teaches the original Gracie Humaitá curriculum",
      "Hosts all major MABJJA events and seminars in Valencia",
      "Brings members of the Gracie family, black belts and champions to teach",
    ],
    lineage: ["Helio Gracie", "Royler Gracie", "Mario Aiello"],
  },

  /* ---------- LINEAGE PHOTOS ----------
     Shown as a sideways-scrolling strip, oldest first. Add or remove as many as you like.
     CONFIRM WITH MARIO: these captions are best guesses from the photos. */
  lineage: [
    { label: "2000",      image: "assets/img/lineage-helio.jpg",      title: "With Grand Master Helio Gracie", text: "The founder of Gracie Jiu-Jitsu, whose programs are the basis of every class taught here." },
    { label: "Lineage",   image: "assets/img/lineage-promotion.jpg",  title: "Promoted by Royler Gracie",      text: "Mario's master, and one of the most decorated competitors in Gracie history." },
    { label: "Lineage",   image: "assets/img/lineage-royler.jpg",     title: "With Royler Gracie",             text: "A direct line back to the Gracie Humaitá academy in Rio." },
    { label: "Jan 2026",  image: "assets/img/lineage-coral-ceremony.jpg", title: "Coral belt ceremony",        text: "Promoted to coral belt at the original Gracie Humaitá academy in Rio de Janeiro, January 17, 2026." },
  ],

  /* ---------- REVIEWS ----------
     Real reviews shown live from Yelp (Yelp's official embed, so they always
     match what's on Yelp). To add one: on Yelp, find the review, click
     Share → copy the link. The review ID is the part after "hrid=".
     Update rating and count now and then to match the Yelp page.            */
  reviews: {
    rating: "4.9",
    count: "36",
    badge: "Yelp “People Love Us” award, 2017",
    yelp: [
      { id: "Uz1a6ntvLiEAIuf4D-1wsg", name: "Jerry Y." },
      { id: "ZK1EWUxifl9LRqgmz7kwSA", name: "Alexandria R." },
      { id: "HQcdFX-GWHIa4UTMvEoYVQ", name: "Dennis L." },
      { id: "rofXhqyvdpqQAeamUIBDgA", name: "Adan R." },
      { id: "HJ-402zIsMUxGiVlo9XbMA", name: "Daniel A." },
      { id: "79RZMmg62hFfns92vXsBqw", name: "Asaf M." },
    ],
    // Optional: your own testimonials, shown as a rotating quote above the Yelp
    // reviews. Leave the list empty [] to hide it. Example:
    // { quote: "Best gym in the valley.", name: "Maria G., student since 2019" },
    items: [],
  },

  /* ---------- QUESTIONS & ANSWERS ---------- */
  faq: [
    { q: "I've never done jiu-jitsu. Where do I start?", a: "Book a free intro class. Most new adults start in the Fundamentals class, where students of every level drill the core techniques together, so you'll never be thrown in the deep end." },
    // A longer answer can be split into paragraphs: put each one in quotes, inside [ ].
    { q: "What is Brazilian Jiu-Jitsu?", a: [
      "Jiu-Jitsu, the “gentle art,” is built on three principles: technique, leverage and balance. Its roots are traced to Buddhist monks in India, who developed it for self-defense on their travels. From there it spread to China, and then to Japan.",
      "In 1914 the Japanese champion Mitsuyo Maeda, known as “Count Koma,” arrived in Brazil and settled in Belém do Pará. The next year he met Gastão Gracie, who enrolled his son Carlos as a student. In 1925 the Gracie family opened the first Brazilian Jiu-Jitsu academy, on Rua Marques de Abrantes in Rio de Janeiro. The brothers Carlos, Oswaldo, Gastão, Jorge and Helio built its reputation by openly challenging all comers.",
      "It was Grand Master Helio Gracie who perfected the art. He refined every technique so that a smaller, lighter person could defeat a bigger, stronger opponent, and became known as the father of Brazilian Jiu-Jitsu.",
      "The Gracie Academy later moved from downtown Rio to the Vasco da Gama club in Lagoa in 1981, and in 1985 to Humaitá, where Gracie Humaitá still teaches today under Master Rolker Gracie. Gracie Humaitá Valencia carries on that same lineage.",
    ] },
    { q: "What should I bring to my first class?", a: "Arrive 5–10 minutes early ready to train. Wear comfortable workout clothes and bring water. If you have a gi, bring it. If not, just ask when you book." },
    { q: "How old does my child need to be?", a: "Our Little Kids class is for ages 3–6, and the Kids class is for ages 7 and up. There are also kids no-gi classes during the week and on Saturday mornings. See the schedule for times." },
    { q: "What's the difference between gi and no-gi?", a: "Gi classes are taught in the traditional kimono, where grips on the collar and sleeves are part of the game. No-gi is trained in shorts and a rash guard, which makes it faster and closer to wrestling and MMA. We train both." },
    { q: "Do you offer private lessons?", a: "Yes. Private lessons with Master Mario are available on request. Call or text to set one up." },
  ],
};
