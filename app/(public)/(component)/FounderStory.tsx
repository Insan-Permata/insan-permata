"use client";

import { useEffect, useState } from "react";

type Language = "en" | "id";

const STORY_PARAGRAPHS: Record<Language, string[]> = {
  en: [
    "Starting from the mission to reach the lost according to the Great Commission of the Lord Jesus, we carried out evangelism both in cities and in remote areas among isolated tribes. We visited small villages deep in the interior of Riau Province near the border of Jambi Province. We met tribal children who lived in very simple and underdeveloped conditions, taught them reading and writing, distributed medicine, and built wells. Even in the city, we met street children who were wild and involved with drugs, where we provided food and shared the Word of God. We also visited stone-making sites where children were working there as well.",
    "One day, it seemed as though there was a voice in my heart saying that you should not only minister to these neglected children once a week because that is not enough. You must disciple them. I asked in my heart, how can I disciple them? Then I began gathering them one by one, and because they were neglected children, the social services suggested that we open an orphanage.",
    "When I saw them abandoned, it felt as though there was a voice speaking in my heart that they were like sheep without a shepherd.",
    "At one point, we ran out of food and ate porridge for three days. As usual, we had prayer and fasting on Friday, and when we ended the fast with porridge again, the children said they were tired of eating porridge. Then I asked, what do you want to eat? They answered together, Kentucky Fried Chicken. I became very afraid because at that time KFC was expensive. But the children said, you just taught us that if we pray and believe that we have received it, then we will receive it. With some anxiety I said, alright, let us believe and give thanks for KFC.",
    "The next day, Saturday, at about the same time as when we had prayed the day before, suddenly someone placed several parcels in front of the house and immediately left. The children shouted to tell me that someone had placed several parcels in front of the house. I told them to chase after the person and call him back. I asked, what is this? He said, Kentucky Fried Chicken. Why did you put it here? He said, I have been tired from circling this area three times looking for a place to put it, so I just placed it here instead. At that time, we did not even have a signboard. He said his employer's child was having a birthday party, but the event was canceled, and his employer told him to distribute the KFC anywhere. And I am grateful because apparently this was the right place.",
    "From this event, we taught the children that if one day they are in crisis, they know where to go.",
    "There are many stories of God's miraculous provision for us.",
    "I believe that whatever the background of these children may be, if God has allowed them to be born, then God has a good and beautiful plan for them. That is why we named this orphanage Insan Permata Orphanage. Insan means human, and Permata means gems.",
    "Therefore, this orphanage is designed not merely as a social institution but as a place of discipleship where children experience and know God personally and grow in faith in Him.",
    "It is a place to grow holistically in spiritual life, skills, health, nutrition, education, biblical worldview, and many other aspects.",
    "When we first started and gathered the children, we lived in an old and damaged house, very simple, with a hand-dug well. The neighbors even called our house a haunted palace because it was run down and the electric lights were dim. At that time, 26 years ago, packs of wild boars entered the yard, black cobras entered the kitchen, and we often encountered scorpions, monitor lizards, and poisonous toads. There were no telephones, let alone mobile phones and similar technology. Because 26 years ago, perhaps more than a quarter of this city had not yet been developed.",
    "But in 2012 we had to move because the owner wanted to sell the house. We had great difficulty finding a house that could accommodate around 15 people. On top of that, there was strong religious fanaticism where every time we searched for a house, the first question the owners asked was whether we were Muslim or Christian. Most refused when they found out we were Christian.",
    "But by God's mercy, eventually a man, even though he was Muslim, allowed us to rent his house.",
    "Sadly, after four years, this man passed away and his child no longer allowed us to rent the house. We were very stressed and under pressure because it was difficult to find a house that could accommodate more than 20 people, along with the strong religious fanaticism.",
    "But a miracle came during the most severe crisis. God moved a woman who was not Christian but Buddhist to donate land and build us a permanent house after receiving guidance from her spiritual leader at the temple.",
    "Because of this, we believe and our faith is strengthened even more that God is with us, and it is not by our own strength but purely by His grace that we are able to endure in His mission and calling.",
    " - Jonedy Umboh, 2026",
  ],
  id: [
    "Berawal dari misi menjangkau orang terhilang sesuai Amanat Agung Tuhan Yesus, kami mengadakan penginjilan baik di kota maupun di pedalaman di tengah suku terpencil. Mengunjungi desa kecil yang jauh di pedalaman provinsi Riau yang berdekatan dengan provinsi Jambi. Bertemu dengan anak-anak suku yang sangat sederhana dan terbelakang, mengajar baca tulis, mendistribusikan obat dan membuat sumur. Bahkan di kota juga bertemu dengan anak-anak jalanan yang liar, bahkan narkoba dimana kami memberi makan dan sharing Firman Tuhan. Juga mengunjungi tempat pembuatan batu bata dimana anak-anak juga bekerja disana.",
    "Suatu ketika sepertinya ada suara dalam hati yang berbicara bahwa kamu jangan hanya melayani anak-anak terlantar itu satu minggu satu kali karena itu tidak cukup. Kamu harus memuridkan mereka. Saya bertanya dalam hati bagaimana cara memuridkan mereka? Lalu saya mulai mengumpulkan mereka satu per satu dan karena mereka anak-anak terlantar maka dinas sosial menyarankan kami untuk membuka panti asuhan.",
    "Ketika melihat mereka terlantar sepertinya ada suara yang berbicara dalam hati saya bahwa mereka bagaikan domba yang tidak bergembala.",
    "Suatu ketika kami kehabisan makanan dan hanya makan bubur selama 3 hari, dan seperti biasa kami ada doa dan puasa pada hari Jumat dan saat mengakhiri puasa dengan bubur lagi, anak-anak berkata kami bosan makan bubur. Lalu saya bertanya, kalian mau makan apa? Mereka kompak menjawab Kentucky Fried Chicken. Saya menjadi sangat takut karena waktu itu KFC itu mahal. Tetapi anak-anak berkata kamu baru saja mengajar bahwa jika kita berdoa dan percaya bahwa kita menerimanya maka kita akan menerimanya. Dengan sedikit kuatir saya berkata Ok, mari kita imani dan bersyukur untuk KFC.",
    "Besoknya Sabtu, sekitar jam yang sama dengan kemarin ketika kita berdoa, tiba-tiba seseorang meletakkan beberapa parcel di depan rumah dan langsung pergi. Anak-anak berteriak memberitahu saya bahwa ada seseorang meletakkan beberapa parcel depan rumah. Saya suruh kejar dan panggil orang itu, saya tanya apa ini? Dia bilang Kentucky Fried Chicken. Mengapa kamu taruh disini? Dia bilang saya sudah capek 3 kali mengelilingi lokasi ini mencari tempat untuk ditaruh akhirnya saya taruh di sini saja (pada waktu itu kami tidak punya papan nama). Dia bilang anak bos saya berulang tahun tetapi batal acaranya, dan bosnya suruh bagikan KFC ini dimana saja. Dan saya bersyukur ini rupanya tempat yang tepat.",
    "Dari peristiwa ini, mengajar anak-anak bahwa jika suatu waktu mereka berada dalam krisis maka mereka tahu kemana harus pergi.",
    "Banyak cerita mujizat penyediaan Tuhan bagi kami.",
    "Saya percaya bahwa apa pun latar belakang anak-anak ini, jika Tuhan sudah mengizinkan mereka lahir berarti Tuhan punya rencana yang baik dan indah bagi mereka. Itu sebabnya kami memberi nama panti asuhan ini Panti Asuhan Insan Permata. (Insan = Human, Permata = Gems).",
    "Sehingga panti asuhan ini dirancang bukan sekedar panti sosial tetapi merupakan tempat pemuridan dimana anak-anak mengalami dan mengenal Tuhan secara pribadi serta bertumbuh dalam iman kepada Tuhan.",
    "Suatu tempat bertumbuh secara holistik baik rohani, skill, kesehatan, makanan, pendidikan, pandangan Alkitab, dsb.",
    "Ketika awal memulai dan mengumpulkan anak-anak, kami tinggal di rumah tua dan rusak, sangat sederhana dengan sumur galinya. Bahkan tetangga menyebut rumah kami puri hantu karena rusak dan lampu listrik yang gelap. Pada waktu itu, 26 tahun yang lalu, gerombolan babi hutan masuk di halaman rumah, kobra hitam masuk ke dapur, sering bertemu kalajengking, biawak, kodok racun. Tidak ada telepon apalagi HP dan sejenisnya. Karena 26 tahun yang lalu mungkin 1/4 lebih dari kota ini belum ada.",
    "Tetapi tahun 2012 kami harus pindah karena tuan rumah mau jual rumah ini. Kami sangat kesulitan mencari rumah yang bisa menampung sekitar 15 orang. Ditambah dengan fanatisme agama dimana setiap kali kami mencari rumah maka pertanyaan pertama pemilik rumah adalah apakah kamu Muslim atau Kristen. Kebanyakan menolak ketika tahu kami Kristen.",
    "Tetapi oleh kemurahan Tuhan akhirnya ada seorang bapak yang walaupun Muslim mengizinkan kami menyewa rumahnya.",
    "Tetapi sayang setelah 4 tahun, bapak ini meninggal dan anaknya tidak mengizinkan kami menyewa rumah ini lagi. Kami sangat stress dan tertekan karena sulit mendapat rumah yang dapat menampung 20 orang lebih serta fanatisme agama yang kuat.",
    "Tetapi mujizat datang di saat krisis yang paling berat. Tuhan menggerakkan seorang wanita bukan Kristen tetapi Budha, memberikan lahan dan membangunkan kami rumah permanen setelah mendapat petunjuk dari pendetanya di klenteng.",
    "Karenanya kami percaya dan semakin dikuatkan iman bahwa Tuhan menyertai dan bukan oleh kekuatan kita tetapi karena kasih karunia-Nya semata-mata sehingga kita bisa bertahan dalam misi dan panggilan-Nya.",
    " - Jonedy Umboh, 2026",
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

  const LanguageToggle = ({ size = "sm" }: { size?: "sm" | "xs" }) => {
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
  };

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
          <LanguageToggle />
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
                <LanguageToggle size="xs" />
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
