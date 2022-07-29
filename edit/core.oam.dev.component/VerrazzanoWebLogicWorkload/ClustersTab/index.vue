<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ClusterService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ClustersTab/ClusterService';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';
import { _VIEW } from '@/config/query-params';

export default {
  name:       'ClustersTab',
  components: {
    Checkbox,
    ClusterService,
    LabeledInput,
    LabeledSelect,
    ServerPodTab,
    ServerService,
    TreeTab
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
    // the parent node of clusters
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
    navPrefix: {
      type:    String,
      default: undefined
    }
  },

  data() {
    return { newName: undefined };
  },

  methods: {
    addCluster() {
      const unusedName = this.getNextName(this.value['clusters'], 'clusterName', 'new');
      const newName = this.newName ? this.newName : unusedName;

      this.addConfigNode(this.value, 'clusters', { clusterName: newName });
    },
    deleteCluster(cluster) {
      this.deleteConfigNode(this.value, 'clusters', cluster);
    },
    componentKey(cluster) {
      return this.createTabKey('cluster', cluster.clusterName);
    }
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },
  },
};
</script>

<template>
  <TreeTab
    :label="t('verrazzano.weblogic.tabs.clusters')"
    :name="createTabKey(navPrefix, 'clusters')"
  >
    <template #default>
      <LabeledInput
        v-model="newName"
        :mode="mode"
        label="New Cluster Name"
      />
      <br />
      <button
        type="button"
        class="btn role-tertiary add"
        data-testid="add-item"
        :disabled="isView"
        @click="addCluster()"
      >
        {{ t('verrazzano.weblogic.buttons.addCluster') }}
      </button>
    </template>
    <template #nestedTabs>
      <TreeTab
        v-for="cluster in value.clusters"
        :key="createTabKey(navPrefix, componentKey(cluster))"
        :label="cluster.clusterName"
        :name="createTabKey(navPrefix, componentKey(cluster))"
        :title="t('verrazzano.weblogic.tabs.cluster')"
      >
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledInput
                v-model="cluster.clusterName"
                :mode="mode"
                required
                :label="t('verrazzano.weblogic.fields.clusters.clusterName')"
              />
            </div>
            <div class="col span-4">
              <LabeledInput
                v-model="cluster.replicas"
                :mode="mode"
                type="Number"
                min="0"
                :label="t('verrazzano.weblogic.fields.clusters.replicas')"
              />
            </div>
            <div class="col span-4">
              <LabeledSelect
                v-model="cluster['serverStartPolicy']"
                :mode="mode"
                :options="serverStartPolicyOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.weblogic.fields.serverStartPolicy')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <LabeledInput
                v-model="cluster['maxConcurrentStartup']"
                :mode="mode"
                type="Number"
                min="0"
                :label="t('verrazzano.weblogic.fields.clusters.maxConcurrentStartup')"
              />
            </div>
            <div class="col span-4">
              <LabeledInput
                v-model="cluster['maxConcurrentShutdown']"
                :mode="mode"
                type="Number"
                min="0"
                :label="t('verrazzano.weblogic.fields.clusters.maxConcurrentShutdown')"
              />
            </div>
            <div class="col span-4">
              <LabeledInput
                v-model="cluster.maxUnavailable"
                :mode="mode"
                type="Number"
                min="0"
                :label="t('verrazzano.weblogic.fields.clusters.maxUnavailable')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <LabeledInput
                v-model="cluster['restartVersion']"
                :mode="mode"
                type="Number"
                min="0"
                :label="t('verrazzano.weblogic.fields.clusters.restartVersion')"
              />
            </div>
            <div class="col span-4">
              <LabeledSelect
                v-model="cluster['serverStartState']"
                :mode="mode"
                :options="serverStartStateOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.weblogic.fields.clusters.serverStartState')"
              />
            </div>
            <div class="col span-1" />
            <div class="col span-3">
              <div class="spacer-small" />
              <Checkbox
                v-model="cluster['allowReplicasBelowMinDynClusterSize']"
                :mode="mode"
                :label="t('verrazzano.weblogic.fields.clusters.allowReplicasBelowMinDynClusterSize')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div>
            <h3>{{ t('verrazzano.weblogic.titles.clusters.clusterService') }}</h3>
            <ClusterService
              v-model="cluster['clusterService']"
              :mode="mode"
            />
          </div>
          <div class="spacer-small" />
          <div>
            <h3>{{ t('verrazzano.weblogic.tabs.serverService') }}</h3>
            <ServerService
              v-model="cluster['serverService']"
              :mode="mode"
            />
          </div>
        </template>
        <template #besideHeader>
          <button
            v-if="!isView"
            v-tooltip="t('verrazzano.weblogic.buttons.deleteCluster')"
            type="button"
            class="btn role-link close btn-sm"
            @click="deleteCluster(cluster)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #nestedTabs>
          <ServerPodTab
            v-model="cluster['serverPod']"
            :mode="mode"
            :namespaced-object="value"
            :nav-prefix="createTabKey(navPrefix, componentKey(cluster))"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
