FROM node:22.12.0

WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'installation
COPY package*.json ./

# 🧹 Nettoie le cache npm et installe sans les binaires natifs Rollup
RUN npm cache clean --force && \
    npm install --no-optional && \
    npm install rollup@4.24.0 --force

# Copie le reste du projet
COPY . .

EXPOSE 5000

# ⚙️ Force Vite/Rollup à utiliser la version JS (non native)
ENV ROLLUP_SKIP_NODE_REQUIRE=1

# Lance le serveur de dev
CMD ["npm", "run", "dev"]
