/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login',
          permanent: false, // Set to true if you want a permanent redirect
        },
      ];
    },
    
  };
  
  export default nextConfig;