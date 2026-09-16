import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.brazilmei.com";

  // Static guides (same as used in the app)
  const staticGuides = [
    { slug: 'o-que-e-das-mei-como-pagar', updatedAt: '2026-01-15' },
    { slug: 'limite-faturamento-mei-2026', updatedAt: '2026-01-10' },
    { slug: 'dasn-simei-2026-passo-a-passo', updatedAt: '2026-01-05' },
    { slug: 'nota-fiscal-mei-obrigatoriedade-como-emitir', updatedAt: '2026-01-01' },
    { slug: 'obrigacoes-mensais-mei-checklist', updatedAt: '2025-12-28' },
    { slug: 'como-abrir-mei-2026-passo-a-passo', updatedAt: '2025-12-20' },
    { slug: 'mei-pode-contratar-funcionario-regras-2026', updatedAt: '2025-12-15' },
    { slug: 'calculadora-das-mei-2026', updatedAt: '2025-12-10' },

    // New articles from batch01.md
    { slug: 'como-pagar-das-mei-2026', updatedAt: '2026-01-20' },
    { slug: 'das-mei-atrasado-multa-juros-parcelamento', updatedAt: '2026-01-20' },
    { slug: 'dasn-simei-declaracao-anual-mei', updatedAt: '2026-01-20' },
    { slug: 'limite-faturamento-mei-2026-desenquadramento', updatedAt: '2026-01-20' },
    { slug: 'nota-fiscal-mei-quando-obrigatoria-como-emitir', updatedAt: '2026-01-20' },
    { slug: 'mei-pode-contratar-funcionario-esocial', updatedAt: '2026-01-20' },
    { slug: 'abrir-alterar-encerrar-mei-portal-empreendedor', updatedAt: '2026-01-20' },
    { slug: 'beneficios-inss-mei-aposentadoria-auxilio', updatedAt: '2026-01-20' },
  ];

  // 1. Define static routes
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/guias`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ferramentas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/mei-das`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mei-faturamento`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dasn-simei`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/nota-fiscal-mei`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mei-obrigacoes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mei-cadastro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // 2. Convert static guides to sitemap links
  const postUrls = staticGuides.map((post) => ({
    url: `${baseUrl}/guias/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...postUrls];
}