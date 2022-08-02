// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

pipeline {
    agent {
       docker {
            image "${RUNNER_DOCKER_IMAGE_1_3}"
            args "${RUNNER_DOCKER_ARGS_1_3}"
            registryUrl "${RUNNER_DOCKER_REGISTRY_URL}"
            registryCredentialsId 'ocir-pull-and-push-account'
        }
    }

    environment {
        DASHBOARD_VERSION = "v2.6.5"
        OCI_CLI_AUTH = "instance_principal"
        OCI_OS_NAMESPACE = credentials('oci-os-namespace')
        OCI_OS_BUCKET = "verrazzano-builds"
        GITHUB_ACCESS_TOKEN = credentials('github-api-token-release-process')
    }

    stages {
        stage('set version') {
            steps {
                script {
                    env.VERSION = get_dashboard_version()
                    env.GIT_TAG =  "rancher-dashboard-" + "${env.VERSION}"
                    env.DRONE_TAG = "${env.GIT_TAG}"
                    env.TAR_FILE_NAME = "${env.DRONE_TAG}" + ".tar.gz"
                }
            }
        }

        stage('build') {
            steps {
                sh """
                    ./scripts/build-embedded
                """
            }
        }

        stage('publish') {
            steps {
                sh """
                    oci --region us-phoenix-1 os object put --force --namespace ${OCI_OS_NAMESPACE} -bn ${OCI_OS_BUCKET} --name  rancher-dashboard/${env.TAR_FILE_NAME} --file dist/${env.TAR_FILE_NAME}
                """
            }
        }

         stage('release') {
            when { buildingTag() }
            steps {
                sh """
                    echo "${env.GITHUB_ACCESS_TOKEN}" | gh auth login --with-token
                    gh release upload ${TAG_NAME} dist/${env.TAR_FILE_NAME} --clobber --repo https://github.com/verrazzano/rancher-dashboard
                """
            }
        }
    }
}

def get_dashboard_version() {
    dashboard_version = "${env.DASHBOARD_VERSION}"

    if (env.TAG_NAME == null) {
        dashboard_version = dashboard_version + "-SNAPSHOT"
    }

    println("dashboard version: " + dashboard_version)
    return dashboard_version
}
