/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
