FROM node:20-bookworm-slim

ENV NODE_ENV=production
ENV PYTHON_PATH=/opt/venv/bin/python
ENV PATH=/opt/venv/bin:$PATH

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY ml/requirements.txt ./ml/requirements.txt

RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r ml/requirements.txt
COPY ml ./ml
COPY backend ./backend
COPY frontend ./frontend

EXPOSE 5000

CMD ["npm", "start"]
