<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'WDTTimeouts',
  components: { LabeledInput },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          :value="getField('activateTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.activateTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'activateTimeoutMillis')"
          @input="setField('activateTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('connectTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.connectTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'connectTimeoutMillis')"
          @input="setField('connectTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('deployTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.deployTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'deployTimeoutMillis')"
          @input="setField('deployTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('redeployTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.redeployTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'redeployTimeoutMillis')"
          @input="setField('redeployTimeoutMillis', $event)"
        />
      </div>
    </div>
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          :value="get(value, 'spec.workload.spec.template.spec.configuration.model.onlineUpdates.wdtTimeouts.setServerGroupsTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.setServerGroupsTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'spec.workload.spec.template.spec.configuration.model.onlineUpdates.wdtTimeouts.setServerGroupsTimeoutMillis')"
          @input="set(value, 'spec.workload.spec.template.spec.configuration.model.onlineUpdates.wdtTimeouts.setServerGroupsTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('startApplicationTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.startApplicationTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'startApplicationTimeoutMillis')"
          @input="setField('startApplicationTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('stopApplicationTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.stopApplicationTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'stopApplicationTimeoutMillis')"
          @input="setField('stopApplicationTimeoutMillis', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('undeployTimeoutMillis')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.wdtTimeouts.undeployTimeoutMillis')"
          :placeholder="getNotSetPlaceholder(value, 'undeployTimeoutMillis')"
          @input="setField('undeployTimeoutMillis', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
