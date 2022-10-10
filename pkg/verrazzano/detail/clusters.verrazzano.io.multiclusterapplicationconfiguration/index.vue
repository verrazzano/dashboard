<script>
// Added by Verrazzano

import CountGauge from '@shell/components/CountGauge';
import DashboardMetrics from '@shell/components/DashboardMetrics';
import Loading from '@shell/components/Loading';
import ResourceTabs from '@shell/components/form/ResourceTabs';
import SortableTable from '@shell/components/SortableTable';
import Tab from '@shell/components/Tabbed/Tab';
import VerrazzanoHelper from '@pkg/mixins/verrazzano-helper';
import V1WorkloadMetrics from '@shell/mixins/v1-workload-metrics';

import { STATE, NAME, POD_IMAGES } from '@shell/config/table-headers';
import { MANAGEMENT, POD, WORKLOAD_TYPES } from '@shell/config/types';
import { allHash } from '@shell/utils/promise';
import { mapGetters } from 'vuex';
import { allDashboardsExist } from '@shell/utils/grafana';

import ClusteredPod from '@pkg/models/clustered-pod';

const WORKLOAD_METRICS_DETAIL_URL = '/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/rancher-workload-pods-1/rancher-workload-pods?orgId=1';
const WORKLOAD_METRICS_SUMMARY_URL = '/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/rancher-workload-1/rancher-workload?orgId=1';

export const WORKLOAD_TYPE_TO_KIND_MAPPING = {
  // Each deployment creates a replicaset and the metrics are published for a replicaset.
  [WORKLOAD_TYPES.DEPLOYMENT]:             'ReplicaSet',
  [WORKLOAD_TYPES.CRON_JOB]:               'CronJob',
  [WORKLOAD_TYPES.DAEMON_SET]:             'DaemonSet',
  [WORKLOAD_TYPES.JOB]:                    'Job',
  [WORKLOAD_TYPES.STATEFUL_SET]:           'StatefulSet',
  [WORKLOAD_TYPES.REPLICA_SET]:            'ReplicaSet',
  [WORKLOAD_TYPES.REPLICATION_CONTROLLER]: 'ReplicationController',
};

const METRICS_SUPPORTED_KINDS = [
  WORKLOAD_TYPES.DAEMON_SET,
  WORKLOAD_TYPES.REPLICA_SET,
  WORKLOAD_TYPES.STATEFUL_SET,
  WORKLOAD_TYPES.DEPLOYMENT
];

export default {
  name:       'VerrazzanoMultiClusterApplicationDetail',
  components: {
    CountGauge,
    DashboardMetrics,
    Loading,
    ResourceTabs,
    SortableTable,
    Tab,
  },
  mixins: [VerrazzanoHelper, V1WorkloadMetrics],
  data() {
    return {
      actionMenuTargetElement:  null,
      actionMenuTargetEvent:    null,
      actionMenuIsOpen:        false,
      fetchInProgress:         true,
      namespace:               this.value.metadata?.namespace,
      allPods:                 {},
      allJobs:                 [],
      showMetrics:             false,
      WORKLOAD_METRICS_DETAIL_URL,
      WORKLOAD_METRICS_SUMMARY_URL,
    };
  },

  async fetch() {
    const hash = {
      allClusters: this.$store.dispatch('management/findAll', {
        type: MANAGEMENT.CLUSTER,
        opt:  { url: MANAGEMENT.CLUSTER }
      })
    };

    if (this.value.type === WORKLOAD_TYPES.CRON_JOB) {
      hash.allJobs = this.$store.dispatch('management/findAll', { type: WORKLOAD_TYPES.JOB });
    }

    const res = await allHash(hash);

    if (res.allJobs) {
      this.allJobs = res.allJobs;
    }

    const pods = [];

    if (res.allClusters) {
      const inStore = this.$store.getters['currentProduct'].inStore;

      for (const cluster of res.allClusters) {
        const clusterRes = await this.$store.dispatch('management/request', { url: `/k8s/clusters/${ cluster?.id }/v1/pods` });

        const appName = this.value.metadata.name;

        const podsResult = clusterRes?.data?.filter(pod => pod.metadata.labels['app.oam.dev/name'] === appName);

        podsResult.forEach((pod) => {
          const p = new ClusteredPod(pod, {
            dispatch: (c, payload) => {
              return this.$store.dispatch(c.includes('/') ? c : `${ inStore }/${ c }`, payload);
            },
            getters:
            {
              schemaFor: (type) => {
                this.$store.getters[`${ inStore }/schemaFor`](type);
              }
            },
            rootGetters: this.$store.getters
          });

          p.cluster = cluster.id;
          p.clusterDisplay = cluster.nameDisplay;

          pods.push(p);
        });
      }
    }

    this.sortObjectsByNamespace(pods, this.allPods);

    const isMetricsSupportedKind = METRICS_SUPPORTED_KINDS.includes(this.value.type);

    this.showMetrics = isMetricsSupportedKind && await allDashboardsExist(this.$store, this.currentCluster.id, [WORKLOAD_METRICS_DETAIL_URL, WORKLOAD_METRICS_SUMMARY_URL]);
    this.fetchInProgress = false;
  },
  computed:   {
    ...mapGetters(['currentCluster']),
    ...mapGetters({ t: 'i18n/t' }),

    isJob() {
      return this.value.type === WORKLOAD_TYPES.JOB;
    },
    isCronJob() {
      return this.value.type === WORKLOAD_TYPES.CRON_JOB;
    },
    podSchema() {
      return this.$store.getters['cluster/schemaFor'](POD);
    },
    podTemplateSpec() {
      const isCronJob = this.value.type === WORKLOAD_TYPES.CRON_JOB;

      if ( isCronJob ) {
        return this.value.spec.jobTemplate.spec.template.spec;
      } else {
        return this.value.spec?.template?.spec;
      }
    },
    container() {
      return this.podTemplateSpec?.containers[0];
    },
    jobSchema() {
      return this.$store.getters['cluster/schemaFor'](WORKLOAD_TYPES.JOB);
    },
    jobHeaders() {
      return this.$store.getters['type-map/headersFor'](this.jobSchema);
    },
    totalRuns() {
      if (!this.value.jobs) {
        return;
      }

      return this.value.jobs.reduce((total, job) => {
        const { status = {} } = job;

        total += (status.active || 0);
        total += (status.succeeded || 0);
        total += (status.failed || 0);

        return total;
      }, 0);
    },
    podRestarts() {
      return this.value.pods.reduce((total, pod) => {
        const { status:{ containerStatuses = [] } } = pod;

        if (containerStatuses.length) {
          total += containerStatuses.reduce((tot, container) => {
            tot += container.restartCount;

            return tot;
          }, 0);
        }

        return total;
      }, 0);
    },
    podHeaders() {
      return [
        STATE,
        {
          ...NAME,
          value:            row => row.metadata?.name,
          formatter:     'ClusterLinkName',
          formatterOpts: {
            type:      POD,
            namespace: this.value.namespace,
          },
        },
        {
          name:          'cluster',
          labelKey:      'verrazzano.common.headers.cluster',
          value:         'clusterDisplay',
          sort:          ['nameSort'],
        },
        POD_IMAGES
      ];
    },
    graphVarsWorkload() {
      return this.value.type === WORKLOAD_TYPES.DEPLOYMENT ? this.value.replicaSetId : this.value.shortId;
    },
    graphVars() {
      return {
        namespace: this.value.namespace,
        kind:      WORKLOAD_TYPE_TO_KIND_MAPPING[this.value.type],
        workload:  this.graphVarsWorkload
      };
    },
    showPodGaugeCircles() {
      const podGauges = Object.values(this.value.podGauges);
      const total = this.value.pods.length;

      return !podGauges.find(pg => pg.count === total);
    },
    showJobGaugeCircles() {
      const jobGauges = Object.values(this.value.jobGauges);
      const total = this.isCronJob ? this.totalRuns : this.value.pods.length;

      return !jobGauges.find(jg => jg.count === total);
    }
  },
  methods: {
    resetPods() {
      this.value.pods = this.allPods[this.namespace] || [];
    }
  },
  watch: {
    fetchInProgress() {
      this.resetPods();
    },
    'value.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetPods();
    }
  },
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <h3>
      {{ isJob || isCronJob ? t('workload.detailTop.runs') :t('workload.detailTop.pods') }}
    </h3>
    <div v-if="value.pods || value.jobGauges" class="gauges mb-20" :class="{'gauges__pods': !!value.pods}">
      <template v-if="value.jobGauges">
        <CountGauge
          v-for="(group, key) in value.jobGauges"
          :key="key"
          :total="isCronJob? totalRuns : value.pods.length"
          :useful="group.count || 0"
          :graphical="showJobGaugeCircles"
          :primary-color-var="`--sizzle-${group.color}`"
          :name="t(`workload.gaugeStates.${key}`)"
        />
      </template>
      <template v-else>
        <CountGauge
          v-for="(group, key) in value.podGauges"
          :key="key"
          :total="value.pods.length"
          :useful="group.count || 0"
          :graphical="showPodGaugeCircles"
          :primary-color-var="`--sizzle-${group.color}`"
          :name="key"
        />
      </template>
    </div>
    <ResourceTabs :value="value">
      <Tab v-if="isCronJob" name="jobs" :label="t('tableHeaders.jobs')" :weight="4">
        <SortableTable
          :rows="value.jobs"
          :headers="jobHeaders"
          key-field="id"
          :schema="jobSchema"
          :show-groups="false"
          :search="false"
        />
      </Tab>
      <Tab v-else name="pods" :label="t('tableHeaders.pods')" :weight="4">
        <div>
          <SortableTable
            :rows="value.pods"
            :headers="podHeaders"
            key-field="id"
            :schema="podSchema"
            :search="false"
            :row-actions="true"
            :show-groups="false"
          />
        </div>
      </Tab>
      <Tab v-if="showMetrics" :label="t('workload.container.titles.metrics')" name="workload-metrics" :weight="3">
        <template #default="props">
          <DashboardMetrics
            v-if="props.active"
            :detail-url="WORKLOAD_METRICS_DETAIL_URL"
            :summary-url="WORKLOAD_METRICS_SUMMARY_URL"
            :vars="graphVars"
            graph-height="550px"
          />
        </template>
      </Tab>
      <Tab v-if="v1MonitoringUrl" name="v1Metrics" :label="t('node.detail.tab.metrics')" :weight="10">
        <div id="ember-anchor">
          <EmberPage inline="ember-anchor" :src="v1MonitoringUrl" />
        </div>
      </Tab>
    </ResourceTabs>
  </div>
</template>

<style lang='scss' scoped src="@pkg/assets/styles/verrazzano.scss">
</style>
