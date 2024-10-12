# Use a Node.js base image
FROM node:20.13.1 AS builder

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Use a lighter image for production
FROM node:20.13.1 AS runner
WORKDIR /src
COPY --from=builder /src ./

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
