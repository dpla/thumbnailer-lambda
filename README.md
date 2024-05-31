# thumbnailer-lambda

1. Install [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
2. Make sure you're using the right version of Node with [nvm](https://github.com/nvm-sh/nvm) (run the command `nvm use`).
3. Build the container with `sam build`. Note that this builds an image, so you need a working Docker install.
4. Make sure the container works with `sam local invoke -e events/event.json`
5. Deploy to production with `sam deploy`.
