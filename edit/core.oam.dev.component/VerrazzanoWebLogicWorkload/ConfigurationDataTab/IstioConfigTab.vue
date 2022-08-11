<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'IstioConfig',
  components: {
    Checkbox,
    LabeledInput,
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
      type:     String,
      default: 'create'
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
    };
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.weblogic.tabs.istio');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="treeTabLabel"
        :mode="mode"
        @click="$emit('delete', value)"
      />
    </template>
    <template #default>
      <div class="row">
        <div class="col span-4">
          <Checkbox
            :value="getField('enabled')"
            :mode="mode"
            :label="t('verrazzano.weblogic.fields.istio.enabled')"
            @input="setBooleanField('enabled', $event)"
          />
          <div class="spacer-tiny" />
          <Checkbox
            :value="getField('localhostBindingEnabled')"
            :mode="mode"
            :label="t('verrazzano.weblogic.fields.istio.localhostBindingsEnabled')"
            @input="setBooleanField('localhostBindingEnabled', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('readinessPort')"
            :mode="mode"
            type="Number"
            :min="minPortNumber"
            :max="maxPortNumber"
            :placeholder="getNotSetPlaceholder(value, 'readinessPort')"
            :label="t('verrazzano.weblogic.fields.istio.readinessPort')"
            @input="setNumberField('readinessPort', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('replicationChannelPort')"
            :mode="mode"
            type="Number"
            :min="minPortNumber"
            :max="maxPortNumber"
            :placeholder="getNotSetPlaceholder(value, 'replicationChannelPort')"
            :label="t('verrazzano.weblogic.fields.istio.replicationChannelPort')"
            @input="setNumberField('replicationChannelPort', $event)"
          />
        </div>
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>
  .spacer-tiny {
    padding: 10px 0 0 0;
  }
</style>
