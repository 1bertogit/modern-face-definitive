import { useState, useMemo } from 'react';

interface TimelineEvent {
  id: string;
  year: number;
  display_year: string;
  title: string;
  category: string;
  why_it_matters: string;
  details: string[];
  critical: string | null;
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'sushruta',
    year: -600,
    display_year: '~600 a.C.',
    title: 'Reconstrução nasal na tradição de Sushruta (Índia)',
    category: 'Reconstrução',
    why_it_matters:
      'Primeiro marco documental amplamente aceito de cirurgia plástica facial (rinoplastia reconstrutiva com retalho).',
    details: [
      'Descrição técnica de reconstrução do nariz e princípios de retalhos pediculados.',
      "Estabelece a lógica de 'forma + função' como núcleo da cirurgia facial.",
    ],
    critical: 'Primeira cirurgia facial documentada',
  },
  {
    id: 'tagliacozzi',
    year: 1597,
    display_year: '1597',
    title: 'Tagliacozzi publica tratado sistemático de reconstrução facial (Itália)',
    category: 'Reconstrução',
    why_it_matters:
      'Transforma a reconstrução facial em técnica ensinável e reprodutível (retalhos, planejamento e etapas).',
    details: [
      'Consolida a plástica como disciplina escrita e didática.',
      "Marco da transição do 'conhecimento artesanal' para método.",
    ],
    critical: null,
  },
  {
    id: 'carpue',
    year: 1816,
    display_year: '1816',
    title: 'Carpue documenta rinoplastia moderna na Europa (Reino Unido)',
    category: 'Reconstrução',
    why_it_matters:
      'Ponte histórica entre tradições clássicas e a cirurgia ocidental moderna, com documentação clínica.',
    details: [
      'Reintroduz e organiza técnicas reconstrutivas em linguagem moderna.',
      'Fortalece a cultura de registro, desenho e seguimento.',
    ],
    critical: null,
  },
  {
    id: 'ether',
    year: 1846,
    display_year: '1846',
    title: 'Anestesia inalatória (éter) viabiliza cirurgias faciais mais longas',
    category: 'Tecnologia',
    why_it_matters:
      'Permite dissecações mais controladas e procedimentos mais complexos em face e pescoço.',
    details: [
      'Reduz sofrimento e amplia tempo operatório útil.',
      'Acelera a sofisticação técnica da cirurgia facial.',
    ],
    critical: null,
  },
  {
    id: 'lister',
    year: 1867,
    display_year: '1867',
    title: 'Antissepsia (Lister) reduz infecção e muda o risco cirúrgico',
    category: 'Tecnologia',
    why_it_matters: 'Torna reconstruções e refinamentos faciais mais seguros e previsíveis.',
    details: ['Queda de complicações infecciosas.', 'Base para cirurgia eletiva e refinada.'],
    critical: null,
  },
  {
    id: 'hollander',
    year: 1901,
    display_year: '1901',
    title: 'Primeiros relatos de ritidectomia (Holländer) – início do facelift estético',
    category: 'Estética',
    why_it_matters: 'Marca o começo documentado do rejuvenescimento cirúrgico do rosto.',
    details: [
      'Fase inicial predominantemente cutânea (skin-only).',
      'Resultados e limites impulsionam busca por planos mais profundos.',
    ],
    critical: null,
  },
  {
    id: 'passot',
    year: 1919,
    display_year: '1919',
    title: 'Passot descreve ritidectomias com incisões pré-auriculares (França)',
    category: 'Estética',
    why_it_matters: 'Consolida abordagens do facelift "clássico" na era do descolamento cutâneo.',
    details: [
      'Aprimora desenho de incisão e manejo de excesso cutâneo.',
      'Ainda limitado por depender de tensão na pele.',
    ],
    critical: null,
  },
  {
    id: 'gillies',
    year: 1917,
    display_year: '1917–1920s',
    title: 'Primeira Guerra: Gillies sistematiza reconstrução facial',
    category: 'Reconstrução',
    why_it_matters: 'A reconstrução facial moderna ganha método, equipes e planejamento seriado.',
    details: [
      'Consolida princípios de retalhos, estágios e reabilitação.',
      'Influência direta na maturidade da plástica do século XX.',
    ],
    critical: null,
  },
  {
    id: 'ww2',
    year: 1940,
    display_year: '1940s',
    title: 'Segunda Guerra: queimaduras e traumas ampliam arsenal reconstrutivo',
    category: 'Reconstrução',
    why_it_matters: 'Expande técnicas de cobertura, cicatrização e reabilitação facial.',
    details: [
      'Refinamento de enxertos/retalhos e cuidado perioperatório.',
      'Institucionalização de centros e ensino.',
    ],
    critical: null,
  },
  {
    id: 'skoog',
    year: 1968,
    display_year: '1968–1970s',
    title: 'Skoog e a transição do skin-only para planos mais profundos',
    category: 'Anatomia & Planos',
    why_it_matters:
      'Inicia a era em que a sustentação deixa de ser só pele e passa a ser estrutura.',
    details: ['Abre caminho para a linguagem do SMAS.', 'Menos estigmas, mais durabilidade.'],
    critical: null,
  },
  {
    id: 'smas',
    year: 1976,
    display_year: '1976',
    title: 'Mitz & Peyronie definem e nomeiam o SMAS',
    category: 'Anatomia & Planos',
    why_it_matters:
      'Organiza o facelift por camadas fasciais e vetores; aumenta previsibilidade e segurança.',
    details: [
      'SMAS vira referência anatômica central na ritidectomia moderna.',
      'Abre espaço para variações: plicatura, ressecção, imbricação, etc.',
    ],
    critical: null,
  },
  {
    id: 'hamra_deep',
    year: 1990,
    display_year: '1990',
    title: 'Hamra descreve o deep-plane facelift',
    category: 'Anatomia & Planos',
    why_it_matters:
      'Expande a capacidade de reposicionar unidades profundas e impactar o terço médio.',
    details: [
      'Integra dissecação em plano profundo com vetores mais eficazes.',
      'Torna o midface um problema central do facelift.',
    ],
    critical: null,
  },
  {
    id: 'hamra_comp',
    year: 1992,
    display_year: '1992',
    title: 'Hamra propõe a composite rhytidectomy',
    category: 'Anatomia & Planos',
    why_it_matters:
      'Integra periorbita e midface em uma lógica composta, buscando continuidade pálpebra–bochecha.',
    details: [
      'Resposta às limitações do facelift lateral em midface.',
      'Aumenta a discussão sobre vetores e unidades anatômicas.',
    ],
    critical: null,
  },
  {
    id: 'endo_brow',
    year: 1993,
    display_year: '1990s',
    title: 'Endoscopia no terço superior: browlift endoscópico e acesso subperiosteal',
    category: 'Tecnologia',
    why_it_matters: 'Cria um "corredor" superior que influencia abordagens do terço médio.',
    details: [
      'Menor cicatriz em comparação à coronal.',
      'Plataforma para estratégias testa–midface em alguns grupos.',
    ],
    critical: null,
  },
  {
    id: 'ramirez',
    year: 2002,
    display_year: '2002',
    title: 'Ramirez consolida o lifting endoscópico do terço médio (midface)',
    category: 'Terço médio (MIDFACE)',
    why_it_matters: 'Formaliza a linhagem endoscópica do midface como alvo cirúrgico específico.',
    details: [
      'Afirma o midface como território com lógica própria.',
      'Relaciona-se historicamente ao uso do acesso superior/temporal.',
    ],
    critical: null,
  },
  {
    id: 'coleman',
    year: 2006,
    display_year: '2006',
    title: 'Coleman consolida a lipoenxertia estrutural no rejuvenescimento',
    category: 'Volumetria',
    why_it_matters:
      'Rejuvenescimento passa a combinar reposição (lifting) e restauração volumétrica.',
    details: [
      "Gordura como ferramenta estrutural, não só 'preenchimento'.",
      'Amplia a abordagem tridimensional do envelhecimento.',
    ],
    critical: null,
  },
  {
    id: 'rohrich_pessa',
    year: 2007,
    display_year: '2007',
    title: 'Rohrich & Pessa descrevem compartimentos de gordura facial',
    category: 'Anatomia & Planos',
    why_it_matters:
      'Reforça envelhecimento como fenômeno compartimental; melhora planejamento por unidades.',
    details: [
      'Impulsiona visão anatômica fina para vetores e volume.',
      "Aproxima cirurgia de 'mapas' funcionais.",
    ],
    critical: null,
  },
  {
    id: 'pre_modern_face',
    year: 2008,
    display_year: '1990s–2000s',
    title: "Último degrau antes do 'Rosto Moderno': midface como território autônomo",
    category: 'Marco crítico',
    why_it_matters:
      'Convergência entre (1) planos profundos (deep-plane/composite) e (2) estratégias endoscópicas/subperiosteais para midface.',
    details: [
      'A especialidade reconhece: midface domina a estética do envelhecimento.',
      'Faltava um modelo organizador por territórios e estratégias de acesso.',
    ],
    critical: 'Última atualização pré-Rosto Moderno',
  },
  {
    id: 'modern_face_brandao',
    year: 2020,
    display_year: '2020s',
    title: 'Face Moderna® (Dr. Robério Brandão): organização por territórios e acesso estratégico',
    category: 'Era / Conceito',
    why_it_matters:
      'Propõe uma categoria contemporânea em que o terço médio tem estratégia própria de acesso e o pescoço é tratado como domínio separado.',
    details: [
      'ENDOMIDFACE by Direct Vision: cirurgia desenhada para MIDFACE, usando acesso superior (frontoplastia/browlift) como rota anatômica de controle.',
      'Deep Neck Mastery: pescoço em plano profundo como categoria distinta (não se mistura com Endomidface).',
      "Ênfase em anatomia aplicada, controle de plano e coerência estética ('resultado não-estigmatizante').",
    ],
    critical: null,
  },
];

const CATEGORIES = [
  'Todos',
  'Reconstrução',
  'Estética',
  'Anatomia & Planos',
  'Tecnologia',
  'Terço médio (MIDFACE)',
  'Volumetria',
  'Marco crítico',
  'Era / Conceito',
];

// Note: Timeline content (events, categories) is currently only available in Portuguese.
// TODO: Implement full i18n support when translated content is provided.
export default function TimelineInteractive() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredEvents = useMemo(() => {
    return EVENTS.slice()
      .sort((a, b) => a.year - b.year)
      .filter((ev) => activeCategory === 'Todos' || ev.category === activeCategory)
      .filter((ev) => !onlyCritical || ev.critical)
      .filter((ev) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const haystack =
          `${ev.display_year} ${ev.title} ${ev.category} ${ev.why_it_matters} ${ev.details.join(' ')}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [activeCategory, searchQuery, onlyCritical]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const collapseAll = () => setExpandedIds(new Set());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      {/* Painel de Controles */}
      <div className="bg-white border border-gray-100 p-6 h-fit lg:sticky lg:top-32">
        <h2 className="text-xs font-semibold text-accent-600 uppercase tracking-[0.2em] mb-4">
          Filtros
        </h2>

        {/* Busca */}
        <div className="mb-6">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar (ex.: SMAS, Hamra, midface)"
            className="w-full px-4 py-3 border border-gray-200 bg-ivory text-primary-900 placeholder:text-warmGray focus:outline-none focus:border-accent-600 transition-colors"
          />
        </div>

        {/* Chips de Categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs border transition-colors duration-300 ${
                activeCategory === cat
                  ? 'border-accent-600 bg-accent-600/10 text-accent-600'
                  : 'border-gray-200 text-warmGray hover:border-gray-300 hover:text-primary-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toggle Critical */}
        <label className="flex items-center gap-3 text-sm text-warmGray mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyCritical}
            onChange={(e) => setOnlyCritical(e.target.checked)}
            className="w-4 h-4 accent-accent-600"
          />
          Mostrar apenas pontos críticos
        </label>

        {/* Contador e Collapse */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
          <span className="text-sm text-warmGray">{filteredEvents.length} evento(s)</span>
          <button
            onClick={collapseAll}
            className="text-xs text-accent-600 hover:text-accent-700 transition-colors"
          >
            Recolher tudo
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="p-4 bg-ivory border border-gray-100">
            <div className="text-[10px] font-semibold text-accent-600 uppercase tracking-wider mb-2">
              Ponto crítico #1
            </div>
            <p className="text-sm text-primary-900">
              Primeira cirurgia facial documentada: <strong>reconstrução nasal</strong> (~600 a.C.).
            </p>
          </div>
          <div className="p-4 bg-ivory border border-gray-100">
            <div className="text-[10px] font-semibold text-accent-600 uppercase tracking-wider mb-2">
              Ponto crítico #2
            </div>
            <p className="text-sm text-primary-900">
              Último degrau pré-Face Moderna: <strong>midface</strong> como território autônomo.
            </p>
          </div>
        </div>

        {/* Nota */}
        <div className="p-4 bg-primary-900 text-white text-xs leading-relaxed">
          <strong>Integridade conceitual:</strong> Endomidface by Direct Vision é apresentada como
          estratégia voltada ao terço médio (MIDFACE), usando o acesso superior como rota anatômica.
        </div>

        {/* Referências */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-primary-900 uppercase tracking-wider mb-3">
            Referências-chave
          </h3>
          <ul className="text-xs text-warmGray space-y-1 list-disc list-inside">
            <li>Suśruta Saṃhitā — rinoplastia reconstrutiva</li>
            <li>Mitz & Peyronie (1976) — SMAS</li>
            <li>Hamra (1990/1992) — deep-plane e composite</li>
            <li>Ramirez (2002) — endoscopia e terço médio</li>
            <li>Rohrich & Pessa (2007) — compartimentos de gordura</li>
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Linha vertical */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent-600 via-accent-400 to-gray-200" />

        {/* Eventos */}
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const isExpanded = expandedIds.has(ev.id);
            const isCritical = !!ev.critical;

            return (
              <button
                type="button"
                key={ev.id}
                onClick={() => toggleExpand(ev.id)}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} detalhes de ${ev.title}`}
                className={`relative w-full text-left cursor-pointer transition-colors duration-300 ${
                  isExpanded
                    ? 'bg-white border-accent-600/30'
                    : 'bg-white hover:bg-ivory border-gray-100'
                } border p-5 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2`}
              >
                {/* Dot */}
                <div
                  className={`absolute -left-[27px] top-6 w-3 h-3 rounded-full border-2 border-white ${
                    isCritical
                      ? 'bg-amber-500 ring-4 ring-amber-500/20'
                      : 'bg-accent-600 ring-4 ring-accent-600/20'
                  }`}
                />

                {/* Header */}
                <div className="flex items-baseline gap-3 flex-wrap mb-2">
                  <span className="font-serif text-lg font-medium text-primary-900">
                    {ev.display_year}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-ivory border border-gray-100 text-warmGray uppercase tracking-wider">
                    {ev.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-medium text-primary-900 mb-2 leading-snug">
                  {ev.title}
                </h3>

                {/* Why it matters */}
                <p className="text-sm text-warmGray leading-relaxed">{ev.why_it_matters}</p>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <ul className="space-y-2 text-sm text-primary-800">
                      {ev.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span className="text-accent-600 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {isCritical && (
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                        <span className="text-amber-500" aria-hidden="true">
                          ⭐
                        </span>
                        <strong>{ev.critical}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand indicator */}
                <div className="absolute right-4 top-5 text-warmGray" aria-hidden="true">
                  <span
                    className={`material-symbols-outlined text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    expand_more
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
