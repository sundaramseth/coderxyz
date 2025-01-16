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

    //    console.log(response.data); // Log the full response to inspect its structure
       const posts = response.data.posts; // Modify this based on the actual structure
    // Adjust based on the response structure

       console.log(posts)

       // Add each blog post dynamically
       posts.forEach(post => {
           smStream.write({
               url: `/post/${post.slug}`, // Adjust based on your API response
               changefreq: 'daily',
               priority: 0.9,
           });
       });


        smStream.end();

        // Save sitemap to public folder
        const sitemap = await streamToPromise(smStream);
        writeFileSync('./sitemap.xml', sitemap.toString());

        console.log('Sitemap generated successfully.');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
};

generateSitemap();
