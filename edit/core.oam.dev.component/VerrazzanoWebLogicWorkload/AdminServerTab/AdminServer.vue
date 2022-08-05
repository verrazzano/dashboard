<script>
// Added by Verrazzano
import AdminService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AdminServerTab/AdminService';
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'AdminServer',
  components: {
    AdminService,
    Checkbox,
    LabeledInput,
    LabeledSelect,
    ServerService,
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
      <div class="col span-6">
        <Checkbox
          :value="getField('adminChannelPortForwardingEnabled')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.adminChannelPortForwardingEnabled')"
          @input="setBooleanField('adminChannelPortForwardingEnabled', $event)"
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
          :value="getField('serverStartPolicy')"
          :mode="mode"
          :options="serverStartPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartPolicy')"
          @input="setField('serverStartPolicy', $event)"
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
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.adminService') }}</h3>
      <AdminService
        :value="getField('adminService')"
        :mode="mode"
        @input="setFieldIfNotEmpty('adminService', $event)"
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
  </div>
</template>

<style scoped>

</style>
