<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import KeyValue from '@/components/form/KeyValue';
import WebLogicChannel from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AdminServerTab/WebLogicChannel';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'AdminService',
  components: {
    ArrayListGrouped,
    KeyValue,
    WebLogicChannel,
  },
  mixins: [WeblogicWorkloadHelper],
  props:      {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
};
</script>

<template>
  <div>
    <div>
      <h4>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.channels') }}</h4>
      <ArrayListGrouped
        v-model="value.channels"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.weblogic.buttons.addChannel')"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showListRemoveButton('channels')"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <WebLogicChannel
            v-model="props.row.value"
            :mode="mode"
          />
        </template>
      </ArrayListGrouped>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <KeyValue
          :value="getField('labels')"
          :mode="mode"
          :title="t('verrazzano.common.titles.labels')"
          :add-label="t('verrazzano.common.buttons.addLabel')"
          @input="setFieldIfNotEmpty('labels', $event)"
        />
      </div>
      <div class="col span-6">
        <KeyValue
          :value="getField('annotations')"
          :mode="mode"
          :title="t('verrazzano.common.titles.annotations')"
          :add-label="t('verrazzano.common.buttons.addAnnotation')"
          @input="setFieldIfNotEmpty('annotations', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
