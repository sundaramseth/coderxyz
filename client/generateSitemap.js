import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFileSync } from 'fs';
import axios from 'axios';

const generateSitemap = async () => {
    const smStream = new SitemapStream({ hostname: 'https://coderxyz.com' });

    // Add static URLs
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/privacy', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/signup', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/signin', changefreq: 'daily', priority: 0.8 });

    try {
        // Fetch blog posts from API
        const response = await axios.get('https://coderxyz.onrender.com/api/post/getposts?limit=1000');

        // Log the response to verify its structure
        console.log(response.data); // Uncomment to inspect the API response

        // Check if posts exist in the response
        const posts = response.data.posts || []; // Ensure there's a fallback if posts are not present

        // Add each blog post dynamically if posts are available
        posts.forEach(post => {
            if (post.slug) { // Ensure the slug exists for each post
                smStream.write({
                    url: `/post/${post.slug}`, // Adjust based on your API response structure
                    changefreq: 'daily',
                    priority: 0.9,
                });
            }
        });

        smStream.end(); // Ensure this is called after all posts are added

        // Convert the stream to a string and write to the sitemap file
        const sitemap = await streamToPromise(smStream);
        writeFileSync('./public/sitemap.xml', sitemap.toString()); // Adjust the path if necessary

        console.log('Sitemap generated successfully.');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
};

generateSitemap();
