FROM public.ecr.aws/lambda/nodejs:20

COPY app.mjs package.json package-lock.json ./
RUN npm ci --omit=dev
CMD ["app.lambdaHandler"]
