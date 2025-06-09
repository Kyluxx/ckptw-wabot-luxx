FROM node:21

# Set working directory
WORKDIR /usr/src/app

# Copy the rest of the application files
COPY . .

## Enable This if you use non-default AuthAdapter
# npm run install:adapter

# Install PM2
# RUN npm install pm2 -g

# Command to run the application
CMD ["node", "index.js"]
