<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ManagedServerTab',
  components: {
    LabeledInput,
    LabeledSelect,
    ServerPodTab,
    ServerService,
    TabDeleteButton,
    TreeTab,
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
    tabName: {
      type:     String,
      required: true
    }
  },
};
</script>

<template>
  <TreeTab
    :label="value['serverName']"
    :name="tabName"
    :title="t('verrazzano.weblogic.tabs.managedServer')"
  >
    <template #default>
      <div class="row">
        <div class="col span-3">
          <LabeledInput
            :value="getField('serverName')"
            :disabled="true"
            :label="t('verrazzano.weblogic.fields.managedServers.serverName')"
            @input="setField('clusterName', $event)"
          />
        </div>
        <div class="col span-3">
          <LabeledInput
            :value="getField('restartVersion')"
            :mode="mode"
            :label="t('verrazzano.weblogic.fields.restartVersion')"
            @input="setField('restartVersion', $event)"
          />
        </div>
        <div class="col span-3">
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
        <div class="col span-3">
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
      <div class="spacer-small" />
    </template>
    <template #beside-header>
      <TabDeleteButton
        :mode="mode"
        :element-name="t('verrazzano.weblogic.tabs.managedServer')"
        @click="$emit('delete', value)"
      />
    </template>
    <template #nestedTabs>
      <ServerPodTab
        :value="getField('serverPod')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="tabName"
        @input="setFieldIfNotEmpty('serverPod', $event)"
      />
    </template>
  </TreeTab>
</template>
