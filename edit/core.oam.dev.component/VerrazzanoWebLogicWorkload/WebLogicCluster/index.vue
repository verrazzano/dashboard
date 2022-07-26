<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ClusterService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/WebLogicCluster/ClusterService';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'WebLogicCluster',
  components: {
    Checkbox,
    ClusterService,
    LabeledInput,
    LabeledSelect,
    ServerService,
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
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
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('clusterName')"
          :mode="mode"
          required
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.clusterName')"
          @input="setField('clusterName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('replicas')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.replicas')"
          @input="setNumberField('replicas', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('serverStartPolicy')"
          :mode="mode"
          :options="serverStartPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartPolicy')"
          @input="setField('serverStartPolicy', $event)"
        />
      </div>
    </div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('maxConcurrentStartup')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.maxConcurrentStartup')"
          @input="setNumberField('maxConcurrentStartup', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('maxConcurrentShutdown')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.maxConcurrentShutdown')"
          @input="setNumberField('maxConcurrentShutdown', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('maxUnavailable')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.maxUnavailable')"
          @input="setNumberField('maxUnavailable', $event)"
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
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.restartVersion')"
          @input="setNumberField('restartVersion', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('serverStartState')"
          :mode="mode"
          :options="serverStartStateOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartState')"
          @input="setField('serverStartState', $event)"
        />
      </div>
      <div class="col span-1" />
      <div class="col span-3">
        <div class="spacer-small" />
        <Checkbox
          :value="getField('allowReplicasBelowMinDynClusterSize')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.clusters.allowReplicasBelowMinDynClusterSize')"
          @input="setBooleanField('allowReplicasBelowMinDynClusterSize', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.clusterService') }}</h3>
      <ClusterService
        :value="getField('clusterService')"
        :mode="mode"
        @input="setFieldIfNotEmpty('clusterService', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverService') }}</h3>
      <ServerService
        :value="getField('serverService')"
        :mode="mode"
        @input="setFieldIfNotEmpty('serverService', $event)"
      />
    </div>
    <div class="spacer-small" />
    <!-- TODO: this should use the serverPod tabbed component, as part of multiple navigation
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.title') }}</h3>
      <ServerPod
        :value="getField('serverPod')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('serverPod', $event)"
      />
    </div>
    -->
  </div>
</template>

<style scoped>

</style>
