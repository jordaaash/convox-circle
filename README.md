# convox-circleci

Demo of using Convox on CircleCI: https://circleci.com/gh/jordansexton/convox-circle

Originally inspired by [Continuous Deployment with CircleCI and Convox](https://medium.com/@matthewcford/continuous-deployment-with-circleci-and-convox-cb24139f1419).

## Explanation

This demo project is a set of shell scripts and CircleCI configuration that enables running `convox start` as a background process on CircleCI, and executing tests inside the `app` Docker container it brings up.

This is useful for allowing your test environment to closely model your deployment environment. The demo tests a simple Node HTTP server with linked Postgres and Redis containers.

## Notes
  - This was tested on CircleCI's [Ubuntu 14.04 environment](https://circleci.com/docs/build-image-trusty/), which may have MongoDB, MySQL, PostgreSQL, and/or Redis running. [`stop-services.sh`](circle/stop-services.sh) is run to kill them because of port conflicts.
  - CircleCI has a [special convention](https://circleci.com/docs/background-process/) for background processes. [`start.sh`](circle/start.sh) is run in the background in this fashion, and [`wait-for-start.sh`](circle/wait-for-start.sh) echos its output until the `app` Docker container is up.
  - `docker exec` [doesn't work](https://circleci.com/docs/docker/#docker-exec) on CircleCI. [`lint.sh`](circle/lint.sh) and [`test.sh`](circle/test.sh) have to use `lxc-attach` to run in the `app` Docker container.
  - Since environment variables don't seem to be preserved by `lxc-attach` in the same way as `docker exec`, [`export-docker-env.sh`](circle/export-docker-env.sh) is used to pull them into the Docker host's environment so they can be propagated.
  - There is also [`deploy.sh`](circle/deploy.sh) for automating the deployment after your tests pass based on [@matthewford](https://github.com/matthewford)'s article. This is configured to only run on the `deploy` branch.
  - [`circle.yml`](circle.yml) is configured to export the logs for all meaningful steps as artifacts.

## Caveats

This involved some shell scripting and some manipulation of Docker containers and I'm not very good at either.

There are probably smarter, more performant, and more idiomatic ways to do everything I'm doing.

Please tell me what they are or submit a pull request!

## Local setup

```shell
git clone https://github.com/jordansexton/convox-circleci.git
cd convox-circleci
cp .env.example .env
chmod +x convox-test.sh
./convox-test.sh
```

## CircleCI setup

  1. Go to https://console.convox.com/grid/user/profile
  1. Copy your Convox account API key
  1. Go to `https://circleci.com/gh/<GITHUB_ORG>/<GITHUB_REPO>/edit#env-vars`
  1. Create some environment variables:
    - `CONVOX_APP=<YOUR CONVOX APP NAME>` (e.g. `api`)
    - `CONVOX_ORG=<YOUR CONVOX ORG NAME>` (e.g. `acme`)
    - `CONVOX_PASSWORD=<YOUR CONVOX API KEY>` (e.g. `45f2cb79-a941-4758-ab53-056574d75216`)
    - `CONVOX_RACK=<YOUR CONVOX RACK NAME>` (e.g. `production`)
