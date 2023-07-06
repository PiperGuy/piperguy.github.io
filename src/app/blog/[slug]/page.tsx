import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';

import Post from '~/components/Post';
import PostList from '~/components/PostList';
import Section from '~/components/Section';
import type { Post as PostType, PostFrontmatter } from '~/types/post';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '~/utils/posts';

type PostPageProps = {
	post: PostType;
	relatedPosts: PostFrontmatter[];
};

const PostPage: FC<PostPageProps> = ({ post, relatedPosts }) => {
	return (
		<div className='flex flex-col gap-y-28'>
			<Post post={post} />

			<Section title='related posts'>
				<PostList posts={relatedPosts} />
			</Section>
		</div>
	);
};

const getStaticProps: GetStaticProps = async (context) => {
	const slug = context?.params?.slug as PostFrontmatter['slug'];
	const post = await getPostBySlug(slug);
	const relatedPosts = getRelatedPosts(post.frontmatter);

	return {
		props: {
			post,
			relatedPosts
		}
	};
};

const getStaticPaths: GetStaticPaths = () => {
	const posts = getAllPosts();

	const paths = posts.map((post) => {
		return {
			params: {
				slug: post.slug
			}
		};
	});

	return {
		paths,
		fallback: false
	};
};

export default PostPage;
export { getStaticPaths, getStaticProps };