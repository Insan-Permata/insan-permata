"use client";

import { useEffect, useState } from "react";

type Language = "en" | "id";

const STORY_PARAGRAPHS: Record<Language, string[]> = {
  en: [
    "It began with a mission to reach the lost, in accordance with the Great Commission of the Lord Jesus. We carried out evangelism both in urban areas and in remote regions among isolated tribes. We visited small villages deep in the interior of Riau Province, near the border with Jambi Province. There, we met children from very simple and underdeveloped tribal communities. We taught them how to read and write, distributed medicine, and built wells. Even in the city, we encountered street children who lived wild lives and used drugs. We fed them and shared the Word of God with them. We also visited stone-breaking sites where children worked.",
    "At one point, it felt as though a voice spoke in my heart, saying: you should not only serve these neglected children once a week, because that is not enough—you must disciple them. I asked myself, how can I disciple them? Then I began gathering them one by one, and because they were neglected children, the Social Service Department suggested that we open an orphanage.",
    "When I saw their condition, it felt as though a voice spoke in my heart again, saying they were like sheep without a shepherd. There was a time when we ran out of food and only ate porridge for three days. As usual, we prayed and fasted on Friday, and when we ended the fast with porridge again, the children said they were tired of eating porridge. I asked them, \"What do you want to eat?\" They all answered in unison: Kentucky Fried Chicken (KFC). I became very afraid because at that time KFC was expensive. But the children said, \"You just taught us that if we pray and believe we receive it, then we will receive it.\" With some hesitation, I said, \"Alright, let us believe and be thankful for KFC.\"",
    "The next day, Saturday, at around the same time as our prayer the previous day, someone suddenly placed several packages in front of the house and immediately left. The children shouted to tell me that someone had left packages outside. I asked them to run after the person and call them back. When I asked what was inside the packages, the person answered, \"Kentucky Fried Chicken.\" I asked why it was left there. He explained that he had driven around three times looking for a place to distribute it, and eventually decided to leave it at our house. At that time, we did not even have a nameplate.",
    "From this event, we taught the children that whenever they face a crisis, they will know where to go.",
    "There are many stories of God's miraculous provision for us.",
    "I believe that whatever the background of these children may be, if God has allowed them to be born, it means He has a good and beautiful plan for their lives. That is why we named this orphanage Insan Permata (Insan = Human, Permata = Gems).",
    "This orphanage is designed not merely as a social institution, but as a place of discipleship where children can personally experience and know God, and grow in faith. It is a place of holistic growth—spiritual life, skills, health, food, education, and a biblical worldview.",
    "When we first started and gathered the children, we lived in an old and damaged house, very simple, with a dug well. Even neighbors called our house a \"haunted palace\" because the electricity was broken and the lights were dim. At that time, 26 years ago, wild boars would enter the yard, black cobras would come into the kitchen, and we often encountered scorpions, monitor lizards, and poisonous frogs. There were no telephones, let alone mobile phones. More than 26 years ago, even about a quarter of Pekanbaru city was not yet developed.",
    "However, in 2012, we had to move because the landlord wanted to sell the house. We struggled to find a new place that could accommodate around 15 people. On top of that, religious exclusivism made things more difficult; every time we looked for a house, the first question from landlords was whether we were Muslim or Christian. Most refused when they found out we were Christians.",
    "But by God's grace, we eventually met a Muslim man who allowed us to rent his house. Unfortunately, after four years, he passed away, and his children no longer permitted us to continue renting the house. We were deeply stressed and pressured because it was very difficult to find a home that could accommodate more than 20 people, especially with strong religious tensions.",
    "Yet in the midst of the greatest crisis, God's miracle came. God moved the heart of a woman who was not a Christian but a Buddhist. She provided land and built us a permanent house after receiving guidance from her temple priest. Through this, we are strengthened in our faith and believe that God is with us—not by our own strength, but solely by His grace—so that we can continue in His mission and calling.",
    "Warm regards,",
    "Jonedy & Anna Umboh",
  ],
  id: [
    "Berawal dari misi menjangkau orang-orang terhilang sesuai Amanat Agung Tuhan Yesus, kami mengadakan penginjilan baik di perkotaan maupun di pedalaman di tengah suku terpencil. Kami mengunjungi desa kecil yang jauh di pedalaman Provinsi Riau yang berdekatan dengan Provinsi Jambi. Bertemu dengan anak-anak suku yang sangat sederhana dan terbelakang, kami mengajar baca tulis, mendistribusikan obat, dan membuat sumur. Bahkan di perkotaan kami juga bertemu dengan anak-anak jalanan yang liar yang menggunakan narkoba dimana kami memberi mereka makan dan berbagi Firman Tuhan. Kami juga mengunjungi tempat pembuatan batu dimana anak-anak juga bekerja disana.",
    "Suatu ketika sepertinya ada suara dalam hati yang berbicara bahwa kamu jangan hanya melayani anak-anak terlantar itu hanya satu minggu sekali karena itu tidak cukup, kamu harus memuridkan mereka. Saya bertanya dalam hati bagaimana cara memuridkan mereka? Lalu saya mulai mengumpulkan mereka satu per satu dan karena mereka anak-anak terlantar, maka Dinas Sosial menyarankan kami untuk membuka panti asuhan.",
    "Ketika melihat mereka terlantar, sepertinya ada suara yang berbicara dalam hati saya bahwa mereka bagaikan domba yang tidak bergembala. Ada satu masa ketika kami kehabisan makanan dan hanya makan bubur selama 3 hari. Seperti biasa, kami doa dan puasa pada hari Jumat, dan saat mengakhiri puasa dengan bubur lagi, anak-anak berkata kami bosan makan bubur. Lalu saya bertanya, \"Kalian mau makan apa?\" Mereka kompak menjawab Kentucky Fried Chicken (KFC). Saya menjadi sangat takut karena pada saat itu KFC adalah makanan yang mahal. Tetapi anak-anak berkata, \"Kamu baru saja mengajar bahwa jika kita berdoa dan percaya bahwa kita menerimanya, maka kita akan menerimanya.\" Dengan sedikit ketegangan, saya berkata, \"Oke, mari kita imani dan bersyukur untuk KFC.\"",
    "Keesokan harinya, di hari Sabtu, sekitar jam yang sama dengan kemarin ketika kami berdoa, tiba-tiba seseorang meletakkan beberapa parsel di depan rumah dan langsung pergi. Anak-anak berteriak memberitahu saya bahwa ada seseorang meletakkan beberapa parsel depan rumah. Saya meminta anak-anak mengejar dan memanggil orang itu. Ketika saya bertanya apa isi parsel tersebut, ia menjawab, \"Kentucky Fried Chicken.\" Saya bertanya lagi mengapa ia meletakkannya di sini. Ia menjelaskan bahwa ia sudah tiga kali berkeliling mencari tempat untuk membagikannya, dan akhirnya memutuskan menaruhnya di rumah kami. Pada waktu itu kami memang belum memiliki papan nama.",
    "Dari peristiwa ini, mengajar anak-anak bahwa jika suatu waktu mereka berada dalam krisis maka mereka tahu kemana harus pergi.",
    "Banyak cerita mujizat penyediaan Tuhan bagi kami.",
    "Saya percaya bahwa apa pun latar belakang anak-anak ini, jika Tuhan sudah mengizinkan mereka lahir berarti Tuhan punya rencana yang baik dan indah bagi mereka. Itu sebabnya kami memberi nama panti asuhan ini Panti Asuhan Insan Permata. (Insan = Human, Permata = Gems).",
    "Sehingga panti asuhan ini dirancang bukan sekedar panti sosial tetapi merupakan tempat pemuridan dimana anak-anak mengalami dan mengenal Tuhan secara pribadi serta bertumbuh dalam iman kepada Tuhan. Suatu tempat bertumbuh secara holistik, baik rohani, skill, kesehatan, makanan, pendidikan, dan pandangan Alkitab.",
    "Ketika awal memulai dan mengumpulkan anak-anak, kami tinggal di rumah tua dan rusak, sangat sederhana dengan sumur galinya. Bahkan tetangga menyebut rumah kami 'puri hantu' karena listrik yang rusak dan lampu yang gelap. Pada waktu itu, 26 tahun yang lalu, gerombolan babi hutan masuk di halaman rumah, ular kobra hitam masuk ke dapur, kami sering bertemu kalajengking, biawak, dan kodok beracun. Tidak ada telepon apalagi HP dan sejenisnya pada saat itu. 26 tahun yang lalu mungkin 1/4 lebih dari kota Pekanbaru bahkan belum ada.",
    "Namun pada tahun 2012, kami harus pindah karena tuan rumah mau jual rumah ini. Kami sangat kesulitan mencari rumah yang bisa menampung sekitar 15 orang. Ditambah dengan fanatisme agama dimana setiap kali kami mencari rumah maka pertanyaan pertama pemilik rumah adalah apakah kamu beragama Muslim atau Kristen. Kebanyakan menolak ketika tahu kami Kristen.",
    "Tetapi oleh kemurahan Tuhan, akhirnya ada seorang bapak yang walaupun berkeyakinan Muslim, mengizinkan kami menyewa rumahnya. Sayangnya setelah 4 tahun, bapak ini meninggal dan anaknya tidak mengizinkan kami lanjut menyewa rumah ini lagi. Kami sangat stres dan tertekan karena sulit mendapat rumah yang dapat menampung 20 orang lebih serta fanatisme agama yang kuat.",
    "Namun mujizat Tuhan datang di saat krisis yang paling berat. Tuhan menggerakkan seorang wanita bukan Kristen tetapi Buddha, memberikan lahan dan membangunkan kami rumah permanen setelah mendapat petunjuk dari pendetanya di klenteng. Karenanya kami percaya dan semakin dikuatkan iman bahwa Tuhan menyertai dan bukan oleh kekuatan kita tetapi karena kasih karunia-Nya semata-mata sehingga kita bisa bertahan dalam misi dan panggilan-Nya.",
    "Salam Hangat,",
    "Jonedy & Anna Umboh",
  ],
};

const WORDS_PER_MINUTE = 200;

function estimateReadMinutes(paragraphs: string[]): number {
  const wordCount = paragraphs.reduce(
    (total, p) => total + p.trim().split(/\s+/).length,
    0
  );
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function LanguageToggle({
  size = "sm",
  lang,
  setLang,
}: {
  size?: "sm" | "xs";
  lang: Language;
  setLang: (lang: Language) => void;
}) {
  const padding = size === "xs" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <div
      role="group"
      aria-label="Select language"
      className="inline-flex items-center rounded-full border border-[#355872]/30 bg-white/60 p-0.5"
    >
      {(["en", "id"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`${padding} rounded-full font-medium tracking-wide transition-colors ${
              active
                ? "bg-[#355872] text-[#F5F5F3]"
                : "text-[#355872] hover:bg-[#355872]/10"
            }`}
          >
            {code === "en" ? "English" : "Indonesia"}
          </button>
        );
      })}
    </div>
  );
}

export default function FounderStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const paragraphs = STORY_PARAGRAPHS[lang];
  const readMinutes = estimateReadMinutes(paragraphs);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <section className="bg-[#F1F0EE] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#355872] mb-3">
          From the Founder
        </p>
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-[#292826] mb-6">
          How Insan Permata Began
        </h2>

        <div className="flex justify-center mb-8">
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <div className="max-w-3xl mx-auto text-left">
          <p className="text-base md:text-lg text-[#292826] leading-relaxed mb-4">
            {paragraphs[0]}
          </p>
          <p className="text-base md:text-lg text-[#292826] leading-relaxed">
            {paragraphs[1].split(". ").slice(0, 2).join(". ")}…
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <span className="text-sm text-[#292826]/70 italic">
            {readMinutes} minute read
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-8 py-3 border-2 border-[#355872] text-[#355872] font-semibold rounded-full hover:bg-[#355872] hover:text-[#F5F5F3] transition-all duration-300"
          >
            Read the Full Story
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/40 backdrop-blur-md animate-[fadeIn_200ms_ease-out]"
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="founder-story-title"
        >
          <div
            className="relative bg-[#F5F5F3] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 md:px-10 pt-8 pb-4 border-b border-[#292826]/10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#355872] mb-2">
                  From the Founder · {readMinutes} minute read
                </p>
                <h3
                  id="founder-story-title"
                  className="text-2xl md:text-3xl font-normal tracking-tight text-[#292826] mb-3"
                >
                  How Insan Permata Began
                </h3>
                <LanguageToggle size="xs" lang={lang} setLang={setLang} />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close story"
                className="shrink-0 w-10 h-10 rounded-full text-[#292826] hover:bg-[#292826]/10 transition-colors flex items-center justify-center text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-6 md:px-10 py-6 space-y-5">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-[#292826] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="px-6 md:px-10 py-4 border-t border-[#292826]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-[#355872] font-semibold rounded-full hover:bg-[#355872]/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
