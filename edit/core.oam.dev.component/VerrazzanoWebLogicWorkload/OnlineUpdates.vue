<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledSelect from '@/components/form/LabeledSelect';
import WDTTimeouts from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/WDTTimeouts';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'OnlineUpdates',
  components: {
    Checkbox,
    LabeledSelect,
    WDTTimeouts,
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
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('enabled')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.enabled')"
          @input="setField('enabled', $event)"
        />
      </div>
    </div>
    <div v-if="!!getField('enabled')" class="spacer-small">
      <div class="row">
        <div class="col span-4">
          <LabeledSelect
            :value="getField('onNonDynamicChanges')"
            :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.onlineUpdates.onNonDynamicChanges')"
            :placeholder="getNotSetPlaceholder(value, 'onNonDynamicChanges')"
            :options="[
              {
                value: 'CommitUpdateOnly',
                label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.onNonDynamicChanges.commitUpdateOnly')
              },
              {
                value: 'CommitUpdateAndRoll',
                label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.onNonDynamicChanges.commitUpdateAndRoll')
              },
            ]"
            :mode="mode"
            option-label="label"
            option-key="value"
            @input="setField('onNonDynamicChanges', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div>
        <h4>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.wdtTimeouts') }}</h4>
        <WDTTimeouts
          :value="getField('wdtTimeouts')"
          :mode="mode"
          @input="setFieldIfNotEmpty('wdtTimeouts', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
