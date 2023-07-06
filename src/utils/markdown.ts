import { rehypeCloudinaryImageSize } from '~/utils/RehypeCloudinaryImageSize';
import { rehypeImageLinks } from '~/utils/RehypeImageLinks';
// import remarkEmbedder from '@remark-embedder/core';
// import {remarkPlugin as remarkVscode} from "gatsby-remark-vscode"
import matter from 'gray-matter';
import path from 'path';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkInlineLinks from 'remark-inline-links';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkUnwrapImages from 'remark-unwrap-images';
import { unified } from 'unified';

// import {codesandboxTransformer} from "~/transformers/codesandbox"
// import {twitchTransformer} from "~/transformers/twitch"
// import {twitterTransformer} from "~/transformers/twitter"
// import {youtubeTransformer} from "~/transformers/youtube"
import type { Markdown } from '~/types/markdown';

const getMarkdownBySlug = async (slug: string): Promise<Markdown> => {
	const nowPath = path.join(process.cwd(), `content/pages/${slug}.md`);

	const file = matter.read(nowPath);
	const html = await transformMarkdown(file.content);

	const markdown: Markdown = {
		html,
		frontmatter: file.data
	};

	return markdown;
};

const transformMarkdown = async (markdown: string): Promise<string> => {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkUnwrapImages)
		.use(remarkInlineLinks)

		// @ts-ignore
		// .use(remarkEmbedder, {
		// 	transformers: [codesandboxTransformer, twitchTransformer, twitterTransformer, youtubeTransformer]
		// })
		// .use(remarkVscode, {
		// 	theme: 'Shades of Purple',
		// 	extensions: ['shades-of-purple'],
		// 	inlineCode: {
		// 		marker: '|',
		// 		theme: {
		// 			default: 'Shades of Purple'
		// 		}
		// 	}
		// })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeExternalLinks, {
			target: '_blank',
			rel: ['noopener', 'noreferrer']
		})
		.use(rehypeCloudinaryImageSize)

		.use(rehypeImageLinks)
		.use(rehypeRaw)
		.use(rehypeStringify);

	const file = await processor.process(markdown);
	const html = file.toString();

	return html;
};

export { getMarkdownBySlug, transformMarkdown };