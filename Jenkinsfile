// Build, test and deploy https://thehot.vn (thehot.k2-tech.dev and nokto.qkenn.cloud redirect there).
//
// Runs on the qkenn-ci Jenkins (infra-qkenn/ci/jenkins). The `docker` agent talks to its own
// Docker daemon, images go to the Harbor registry on the same machine (a commit whose image is already there pulls and
// smoke-tests that image instead of building it again), and the deploy is one SSH
// call to a forced command on the VPS (deploy.sh) that pulls the image by commit SHA,
// waits for its healthcheck and rolls back to the previous image if it fails.
// A failure before the Deploy stage never touches the VPS. After a deploy, search engines are told which pages changed
// (ci/notify-search.sh); that last stage can only turn yellow, never fail the build.

import org.jenkinsci.plugins.credentialsbinding.impl.CredentialNotFoundException

def notifyDiscord(String title, int color) {
  withCredentials([string(credentialsId: 'discord-webhook', variable: 'WEBHOOK')]) {
    withEnv(["TITLE=${title}", "COLOR=${color}"]) {
      sh '''
        if [ -z "$WEBHOOK" ]; then echo "No Discord webhook configured, skipping notification"; exit 0; fi
        MSG=$(git log -1 --format=%s "$GIT_COMMIT" 2>/dev/null || true)
        jq -n --arg title "$TITLE" --argjson color "$COLOR" --arg url "$BUILD_URL" \
              --arg msg "${MSG:-(no commit message)}" --arg sha "$(printf %.7s "$GIT_COMMIT")" \
              --arg build "#$BUILD_NUMBER" --arg ci "${QKENN_CI_NAME:-qkenn-ci}" \
          '{embeds: [{title: $title, url: $url, color: $color, description: $msg,
             fields: [{name: "Repo", value: "qkenn04/thehot", inline: true},
                      {name: "Commit", value: $sha, inline: true},
                      {name: "Build", value: $build, inline: true}],
             footer: {text: ("thehot.vn · Jenkins " + $ci + " · Harbor")},
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
    // Harbor on the machine running this Jenkins: qkenn-ci, or the standby CI while qkenn-ci is down (set by JCasC).
    REGISTRY = "${env.QKENN_HARBOR_REGISTRY}"
    IMAGE = "${REGISTRY}/thehot/web"
    SITE_URL = 'https://thehot.vn'
    // Umami analytics (docs/specs/004-analytics). Public values that end up in every page's HTML, not secrets;
    // changing one needs a new build. Empty ID = no tracker and no Umami section on /privacy.
    UMAMI_WEBSITE_ID = '8834d3ef-90e0-40e5-b6ca-2932a0fea7d8'
    UMAMI_SRC = 'https://stats.thehot.vn/ht.js'
    VPS = "${env.QKENN_DEPLOY_HOST}" // set by JCasC; the deploy key only works from the private network
  }

  stages {
    stage('Existing image') {
      steps {
        script {
          if (!env.QKENN_HARBOR_REGISTRY?.trim() || !env.QKENN_DEPLOY_HOST?.trim()) {
            error('Jenkins is missing QKENN_HARBOR_REGISTRY or QKENN_DEPLOY_HOST (JCasC globalNodeProperties)')
          }
        }
        withCredentials([usernamePassword(credentialsId: 'thehot-harbor-robot-push',
                                          usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_TOKEN')]) {
          script {
            def pulled = sh(returnStatus: true, script: '''
              echo "$HARBOR_TOKEN" | docker login "$REGISTRY" --username "$HARBOR_USER" --password-stdin >/dev/null || exit 1
              status=0
              docker pull -q "$IMAGE:$GIT_COMMIT" >/dev/null || status=$?
              docker logout "$REGISTRY" >/dev/null || true
              exit $status
            ''')
            env.IMAGE_EXISTS = pulled == 0 ? 'true' : 'false'
          }
        }
        script {
          if (env.IMAGE_EXISTS == 'true') {
            echo "${env.IMAGE}:${env.GIT_COMMIT} đã có trên Harbor: bỏ qua sitemap dates, check, build, push; smoke test image này"
            currentBuild.description = "${env.GIT_COMMIT.substring(0, 7)} · image có sẵn trên Harbor"
          }
        }
      }
    }

    // The Docker build has no .git, so the sitemap <lastmod> dates are computed here from the full
    // history into src/generated/sitemap-lastmod.json, which goes into the build context.
    stage('Sitemap dates') {
      when { expression { env.IMAGE_EXISTS != 'true' } }
      steps {
        sh 'bash ci/sitemap-lastmod.sh'
      }
    }

    stage('Check') {
      when { expression { env.IMAGE_EXISTS != 'true' } }
      steps {
        sh 'docker build --target check --progress=plain .'
      }
    }

    stage('Build') {
      when { expression { env.IMAGE_EXISTS != 'true' } }
      steps {
        sh '''
          docker build --target runner --pull --progress=plain \
            --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
            --build-arg NEXT_PUBLIC_UMAMI_WEBSITE_ID="$UMAMI_WEBSITE_ID" \
            --build-arg NEXT_PUBLIC_UMAMI_SRC="$UMAMI_SRC" \
            --label org.opencontainers.image.revision="$GIT_COMMIT" \
            --label org.opencontainers.image.source=https://github.com/qkenn04/thehot \
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
      when { expression { env.IMAGE_EXISTS != 'true' } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'thehot-harbor-robot-push',
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

    // The live sitemap's pages and <lastmod> dates before this deploy, for the "Notify search engines" stage. Never
    // fails: without a snapshot, every page counts as changed.
    stage('Sitemap snapshot') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          script {
            env.SITEMAP_BEFORE = sh(script: 'bash ci/notify-search.sh snapshot "$SITE_URL" || true', returnStdout: true).trim()
          }
        }
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

    // Pages whose <lastmod> changed: re-submit the sitemap to Google (Search Console API) and send the URLs to
    // IndexNow (Bing and others). docs/adr/0009-notify-search-engines-after-deploy.md. The site is already live here, so
    // any problem (no key, API error, timeout) only marks this stage UNSTABLE; the build stays green and the Discord
    // message says the search engines were not told.
    stage('Notify search engines') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          script {
            env.SEARCH_NOTIFY_FAILED = 'true'
            try {
              withCredentials([file(credentialsId: 'gsc-service-account', variable: 'GSC_KEY_FILE')]) {
                sh 'timeout 5m bash ci/notify-search.sh notify "$SITE_URL"'
              }
            } catch (CredentialNotFoundException e) {
              echo "No 'gsc-service-account' credential in Jenkins: Google is skipped, IndexNow still runs."
              sh 'timeout 5m bash ci/notify-search.sh notify "$SITE_URL"'
            }
            env.SEARCH_NOTIFY_FAILED = 'false'
          }
        }
      }
    }
  }

  post {
    success {
      script {
        if (env.SEARCH_NOTIFY_FAILED == 'true') {
          notifyDiscord('✅ Deploy thành công — thehot.vn (⚠️ chưa báo được công cụ tìm kiếm, xem log stage Notify)', 15105570)
        } else {
          notifyDiscord('✅ Deploy thành công — thehot.vn', 3066993)
        }
      }
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
