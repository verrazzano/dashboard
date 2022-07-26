<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ManagedServer',
  components: {
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
      <div class="col span-3">
        <LabeledInput
          :value="getField('serverName')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverName')"
          @input="setFieldIfNotEmpty('serverName', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('restartVersion')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.restartVersion')"
          @input="setFieldIfNotEmpty('restartVersion', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('serverStartPolicy')"
          :mode="mode"
          :options="serverStartPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartPolicy')"
          @input="setFieldIfNotEmpty('serverStartPolicy', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('serverStartState')"
          :mode="mode"
          :options="serverStartStateOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartState')"
          @input="setFieldIfNotEmpty('serverStartState', $event)"
        />
      </div>
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
