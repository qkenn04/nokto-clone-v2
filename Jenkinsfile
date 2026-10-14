// Build, test and deploy https://thehot.vn (thehot.k2-tech.dev and nokto.qkenn.cloud redirect there).
//
// Runs on the qkenn-ci Jenkins (infra-qkenn/ci/jenkins). The `docker` agent talks to its own
// Docker daemon, images go to the Harbor registry on the same machine, and the deploy is one SSH
// call to a forced command on the VPS (/srv/nokto/deploy.sh) that pulls the image by commit SHA,
// waits for its healthcheck and rolls back to the previous image if it fails.
// A failure before the Deploy stage never touches the VPS.

def notifyDiscord(String title, int color) {
  withCredentials([string(credentialsId: 'discord-webhook', variable: 'WEBHOOK')]) {
    withEnv(["TITLE=${title}", "COLOR=${color}"]) {
      sh '''
        if [ -z "$WEBHOOK" ]; then echo "No Discord webhook configured, skipping notification"; exit 0; fi
        MSG=$(git log -1 --format=%s "$GIT_COMMIT" 2>/dev/null || true)
        jq -n --arg title "$TITLE" --argjson color "$COLOR" --arg url "$BUILD_URL" \
              --arg msg "${MSG:-(no commit message)}" --arg sha "$(printf %.7s "$GIT_COMMIT")" \
              --arg build "#$BUILD_NUMBER" \
          '{embeds: [{title: $title, url: $url, color: $color, description: $msg,
             fields: [{name: "Repo", value: "qkenn04/nokto-clone-v2", inline: true},
                      {name: "Commit", value: $sha, inline: true},
                      {name: "Build", value: $build, inline: true}],
             footer: {text: "thehot.vn · Jenkins qkenn-ci · Harbor"},
             timestamp: (now | todate)}]}' > discord.json
        curl -sS --fail-with-body -H 'Content-Type: application/json' -d @discord.json "$WEBHOOK" >/dev/null
      '''
    }
  }
}

pipeline {
  agent { label 'docker' }

  options {
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  // The job is also created with this trigger (JCasC), so polling works before the first build.
  triggers { pollSCM('H/5 * * * *') }

  environment {
    REGISTRY = 'qkenn-ci.tailb41a82.ts.net'
    IMAGE = "${REGISTRY}/nokto/web"
    SITE_URL = 'https://thehot.vn'
    // Umami analytics (docs/specs/004-analytics). Public values that end up in every page's HTML, not secrets;
    // changing one needs a new build. Empty ID = no tracker and no Umami section on /privacy.
    UMAMI_WEBSITE_ID = '8834d3ef-90e0-40e5-b6ca-2932a0fea7d8'
    UMAMI_SRC = 'https://stats.thehot.vn/ht.js'
    VPS = '100.93.222.27' // qkenn-server on the tailnet; the deploy key only works from 100.64.0.0/10
  }

  stages {
    // The Docker build has no .git, so the sitemap <lastmod> dates are computed here from the full
    // history into src/generated/sitemap-lastmod.json, which goes into the build context.
    stage('Sitemap dates') {
      steps {
        sh 'bash ci/sitemap-lastmod.sh'
      }
    }

    stage('Check') {
      steps {
        sh 'docker build --target check --progress=plain .'
      }
    }

    stage('Build') {
      steps {
        sh '''
          docker build --target runner --pull --progress=plain \
            --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
            --build-arg NEXT_PUBLIC_UMAMI_WEBSITE_ID="$UMAMI_WEBSITE_ID" \
            --build-arg NEXT_PUBLIC_UMAMI_SRC="$UMAMI_SRC" \
            --label org.opencontainers.image.revision="$GIT_COMMIT" \
            --label org.opencontainers.image.source=https://github.com/qkenn04/nokto-clone-v2 \
            --tag "$IMAGE:$GIT_COMMIT" .
        '''
      }
    }

    stage('Smoke test') {
      steps {
        sh 'bash ci/smoke-test.sh "$IMAGE:$GIT_COMMIT" "$SITE_URL" "$UMAMI_WEBSITE_ID"'
      }
    }

    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'harbor-robot-push',
                                          usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_TOKEN')]) {
          sh '''
            echo "$HARBOR_TOKEN" | docker login "$REGISTRY" --username "$HARBOR_USER" --password-stdin
            docker push "$IMAGE:$GIT_COMMIT"
          '''
        }
      }
      post {
        always { sh 'docker logout "$REGISTRY" >/dev/null || true' }
      }
    }

    stage('Deploy') {
      steps {
        script { env.DEPLOY_STARTED = 'true' }
        withCredentials([sshUserPrivateKey(credentialsId: 'vps-deploy-ssh', keyFileVariable: 'SSH_KEY'),
                         file(credentialsId: 'vps-known-hosts', variable: 'KNOWN_HOSTS')]) {
          // Host key is pinned; never fall back to StrictHostKeyChecking=no.
          sh '''
            ssh -i "$SSH_KEY" -o IdentitiesOnly=yes \
                -o StrictHostKeyChecking=yes -o UserKnownHostsFile="$KNOWN_HOSTS" -o GlobalKnownHostsFile=/dev/null \
                -o ConnectTimeout=20 \
                root@"$VPS" "deploy $GIT_COMMIT"
          '''
        }
      }
    }
  }

  post {
    success {
      notifyDiscord('✅ Deploy thành công — thehot.vn', 3066993)
    }
    failure {
      script {
        if (env.DEPLOY_STARTED == 'true') {
          notifyDiscord('❌ Deploy THẤT BẠI — VPS đã tự quay về bản cũ (xem log)', 15158332)
        } else {
          notifyDiscord('❌ Build THẤT BẠI — VPS không bị đụng', 15158332)
        }
      }
    }
    cleanup {
      // The tag is in Harbor now; keep the dind disk bounded (build cache stays for fast rebuilds).
      sh '''
        docker rmi "$IMAGE:$GIT_COMMIT" >/dev/null 2>&1 || true
        docker builder prune -f --filter until=168h >/dev/null 2>&1 || true
      '''
    }
  }
}
