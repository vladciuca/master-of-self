import {
  GiSpellBook,
  GiBookCover,
  GiBookmarklet,
  GiEnlightenment,
} from "react-icons/gi";

export function HeroSection() {
  return (
    <section className="text-center py-20">
      {/* <motion.h1 className="leading-snug space-y-4"> */}
      <span className="text-5xl block uppercase font-semibold">Journaling</span>

      <h1 className="text-xl max-w-[600px] px-6">
        <div className="text-center mt-10">
          Helps you target development in specific disciplines, tracking your
          daily progress.
        </div>
      </h1>
      {/* </motion.h1> */}
      <span className="w-full text-center flex justify-center">
        <GiSpellBook size={80} className="mt-24" />
      </span>
    </section>
  );
}
