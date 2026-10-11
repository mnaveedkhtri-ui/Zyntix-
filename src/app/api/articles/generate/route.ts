import { NextResponse } from 'next/server';
import { fetchGoogleSerpSuggestions, generateDeepHumanArticle } from '@/lib/seo-engine';
import { getSiteById, saveOrUpdateSite } from '@/lib/sites';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || 'craftsmanship';
    const suggestions = await fetchGoogleSerpSuggestions(query);
    return NextResponse.json({ success: true, suggestions });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteId, topic } = body;

    if (!siteId || !topic) {
      return NextResponse.json({ success: false, error: 'siteId and topic are required' }, { status: 400 });
    }

    const site = getSiteById(siteId);
    if (!site) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
    }

    // Generate high-authority in-depth human article
    const generated = await generateDeepHumanArticle(topic, site.author.name);

    // Format for site posts list
    const newPost = {
      slug: generated.slug,
      title: generated.title,
      excerpt: generated.excerpt,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: generated.readTime,
      category: generated.category,
      author: {
        name: site.author.name,
        avatar: site.author.avatar,
        role: 'Author'
      },
      coverImage: generated.coverImage,
      content: [
        // AEO Direct answer box
        `[AEO_ANSWER]: ${generated.aeoAnswer}`,
        ...generated.sections.flatMap(s => [
          `### ${s.heading}`,
          ...(s.subheading ? [`*${s.subheading}*`] : []),
          ...s.paragraphs,
          ...(s.quote ? [`> ${s.quote}`] : [])
        ])
      ]
    };

    const updatedPosts = [newPost, ...site.posts];
    const updatedSite = saveOrUpdateSite({
      ...site,
      posts: updatedPosts
    });

    return NextResponse.json({
      success: true,
      site: updatedSite,
      article: generated
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
