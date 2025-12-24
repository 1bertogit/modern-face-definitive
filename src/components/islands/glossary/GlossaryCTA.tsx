/**
 * Glossary CTA Section Component
 * Call-to-action section for glossary pages
 */

interface GlossaryCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function GlossaryCTA({
  title = 'Ainda tem dúvidas sobre algum termo?',
  description = 'A cirurgia facial envolve conceitos complexos. O Dr. Robério Brandão acredita que um paciente bem informado toma as melhores decisões. Agende uma conversa para entender como esses conceitos se aplicam ao seu caso.',
  primaryButtonText = 'Agendar Avaliação',
  primaryButtonHref = '/formacao',
  secondaryButtonText = 'Ver Resultados',
  secondaryButtonHref = '/tecnicas',
}: GlossaryCTAProps) {
  return (
    <section className="bg-primary-900 text-white py-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-serif font-normal mb-4">{title}</h2>
          <p className="text-primary-400 text-base leading-relaxed mb-8 font-light">
            {description}
          </p>
          <div className="flex gap-4 justify-center md:justify-start flex-wrap">
            <a
              href={primaryButtonHref}
              className="inline-flex items-center justify-center font-medium uppercase tracking-[0.15em] transition-colors duration-300 bg-accent-600 text-white hover:bg-accent-300 px-8 py-4 text-[11px]"
            >
              {primaryButtonText}
            </a>
            <a
              href={secondaryButtonHref}
              className="border border-white/30 text-white font-medium px-8 py-4 hover:bg-white/10 transition-colors duration-300 text-[11px] uppercase tracking-[0.15em]"
            >
              {secondaryButtonText}
            </a>
          </div>
        </div>
        <div className="relative size-72 hidden md:block opacity-90">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-2xl"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt-rI4BpP_HXapPjJHgvJmFvNnz0VmZedBpkYXW58tMJumt7cQza2zT07s7Ma6C56gFu5I0wQOIsxzBXsU1VpE7r-fjddSC51Z7xvX66xSiia4jc7RJ_-BLAhytcJmKIgXzb07AcVRXWNwjr8TwL49ZDVyRyaTimRf7UrGLDhb88XSjUSt4ViKnGo3WWa7ypqOpKLe6c2veeZfYkRIBrfgulkL5v9EK4qyubrXUPtOxiJSatSi2_VDqSV2bpvKRHtn0aj-VKkGfDaM"
            alt="Anatomia Facial"
            className="relative z-10 w-full h-full object-contain grayscale-[80%] brightness-105 contrast-105 drop-shadow-2xl rounded-2xl border-4 border-white/10 p-2 bg-primary-900/30"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
