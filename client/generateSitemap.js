import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFileSync } from 'fs';
import axios from 'axios';

const generateSitemap = async () => {
    const smStream = new SitemapStream({ hostname: 'https://coderxyz.com' });

    // Add static URLs
    const staticUrls = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/about', changefreq: 'weekly', priority: 0.8 },
        { url: '/privacy', changefreq: 'monthly', priority: 0.6 },
        { url: '/signup', changefreq: 'yearly', priority: 0.5 },
        { url: '/signin', changefreq: 'yearly', priority: 0.5 },
    ];

    staticUrls.forEach((page) => smStream.write(page));

    try {
        // Fetch blog posts from API
        const response = await axios.get('https://coderxyz.onrender.com/api/post/getposts?limit=1000');

        if (!response.data || !Array.isArray(response.data.posts)) {
            console.error('Invalid API response structure:', response.data);
            return;
        }

        // Add each blog post dynamically
        response.data.posts.forEach(post => {
            if (post.slug) { // Ensure the slug exists
                smStream.write({
                    url: `/post/${post.slug}`,
                    changefreq: 'daily',
                    priority: 0.8,
                });
            } else {
                console.warn('Skipping post due to missing slug:', post);
            }
        });

        smStream.end(); // End the stream after adding all URLs

        // Convert the stream to a string and write to the sitemap file
        const sitemap = await streamToPromise(smStream);
        writeFileSync('./public/sitemap.xml', sitemap.toString()); // Ensure the path exists

        console.log('✅ Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error.message || error);
    }
};

generateSitemap();
