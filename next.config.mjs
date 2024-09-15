/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NODE_ENV === 'production' ? '/nom-utilisateur.github.io' : '',
};

export default nextConfig;
