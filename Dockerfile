FROM node:18-alpine

# Install libc6-compat and set the working directory
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package.json and lock files to the container
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies based on the lock file
RUN npm ci

# Copy the entire project (including public directory) to the container
COPY . . 

# Build the Next.js application
RUN npm run build


# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=80

# Expose the port that the app will run on
EXPOSE 80


# Copy the necessary files from the build
COPY /.next/static ./.next/static
COPY /public ./public

CMD ["npm", "run", "start"]
