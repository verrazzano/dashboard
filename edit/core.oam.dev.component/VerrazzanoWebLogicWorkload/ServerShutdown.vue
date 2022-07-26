<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ServerShutdown',
  components: {
    Checkbox,
    LabeledInput,
    LabeledSelect,
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
  },
  computed: {
    shutdownTypes() {
      return [
        {
          value: 'Graceful',
          label: this.t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.shutdown.graceful')
        },
        {
          value: 'Forced',
          label: this.t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.shutdown.forced')
        },
      ];
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <Checkbox
        :value="getField('ignoreSessions')"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.shutdown.ignoreSession')"
        @input="setBooleanField('ignoreSessions', $event)"
      />
      <div class="spacer-tiny" />
      <Checkbox
        :value="getField('waitForAllSessions')"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.shutdown.waitForAllSessions')"
        @input="setBooleanField('waitForAllSessions', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledSelect
        :value="getField('shutdownType')"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.shutdown.shutdownType')"
        :options="shutdownTypes"
        @input="setField('shutdownType', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('timeoutSeconds')"
        :mode="mode"
        type="Number"
        min="0"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.shutdown.timeoutSeconds')"
        @input="setNumberField('timeoutSeconds', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import '../verrazzano-styles.css';
</style>
