<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ClusterService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ClustersTab/ClusterService';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';
import { _VIEW } from '@/config/query-params';

export default {
  name:       'ClusterTab',
  components: {
    Checkbox,
    ClusterService,
    LabeledInput,
    LabeledSelect,
    ServerPodTab,
    ServerService,
    TabDeleteButton,
    TreeTab
  },
  mixins: [WeblogicWorkloadHelper, DynamicListHelper],
  props:  {
    // the cluster object
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

  methods: {
    getRootFieldName() {
      return 'clusters';
    },
    clusterKey(cluster) {
      return this.createTabKey('cluster', cluster.clusterName);
    },
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
    :name="createTabKey(navPrefix, clusterKey(value))"
    :label="value.clusterName"
    :title="t('verrazzano.weblogic.tabs.cluster')"
  >
    <template #default>
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('clusterName')"
            :disabled="true"
            required
            :label="t('verrazzano.weblogic.fields.clusters.clusterName')"
            @input="setField('clusterName', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('replicas')"
            :mode="mode"
            type="Number"
            min="0"
            :label="t('verrazzano.weblogic.fields.clusters.replicas')"
            @input="setField('replicas', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getField('serverStartPolicy')"
            :mode="mode"
            :options="serverStartPolicyOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.weblogic.fields.serverStartPolicy')"
            @input="setField('serverStartPolicy', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('maxConcurrentStartup')"
            :mode="mode"
            type="Number"
            min="0"
            :label="t('verrazzano.weblogic.fields.clusters.maxConcurrentStartup')"
            @input="setField('maxConcurrentStartup', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('maxConcurrentShutdown')"
            :mode="mode"
            type="Number"
            min="0"
            :label="t('verrazzano.weblogic.fields.clusters.maxConcurrentShutdown')"
            @input="setField('maxConcurrentShutdown', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('maxUnavailable')"
            :mode="mode"
            type="Number"
            min="0"
            :label="t('verrazzano.weblogic.fields.clusters.maxUnavailable')"
            @input="setField('maxUnavailable', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('restartVersion')"
            :mode="mode"
            type="Number"
            min="0"
            :label="t('verrazzano.weblogic.fields.restartVersion')"
            @input="setField('restartVersion', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getField('serverStartState')"
            :mode="mode"
            :options="serverStartStateOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.weblogic.fields.serverStartState')"
            @input="setField('serverStartState', $event)"
          />
        </div>
        <div class="col span-1" />
        <div class="col span-3">
          <div class="spacer-small" />
          <Checkbox
            :value="getField('allowReplicasBelowMinDynClusterSize')"
            :mode="mode"
            :label="t('verrazzano.weblogic.fields.clusters.allowReplicasBelowMinDynClusterSize')"
            @input="setField('allowReplicasBelowMinDynClusterSize', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div>
        <h3>{{ t('verrazzano.weblogic.titles.clusters.clusterService') }}</h3>
        <ClusterService
          :value="getField('clusterService')"
          :mode="mode"
          @input="setFieldIfNotEmpty('clusterService', $event)"
        />
      </div>
      <div class="spacer-small" />
      <div>
        <h3>{{ t('verrazzano.weblogic.tabs.serverService') }}</h3>
        <ServerService
          :value="getField('serverService')"
          :mode="mode"
          @input="setFieldIfNotEmpty('serverService', $event)"
        />
      </div>
    </template>
    <template #beside-header>
      <TabDeleteButton
        :mode="mode"
        :element-name="t('verrazzano.weblogic.tabs.cluster')"
        @click="$emit('delete', value)"
      />
    </template>
    <template #nestedTabs>
      <ServerPodTab
        :value="getField('serverPod')"
        :mode="mode"
        :namespaced-object="value"
        :nav-prefix="createTabKey(navPrefix, clusterKey(value))"
        @input="setFieldIfNotEmpty('serverPod', $event)"
      />
    </template>
  </TreeTab>
</template>
