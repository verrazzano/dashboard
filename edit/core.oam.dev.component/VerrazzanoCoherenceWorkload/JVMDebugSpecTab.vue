<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'JVMDebugSpecTab',
  components: {
    Checkbox,
    LabeledInput,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
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
      this.treeTabLabel = this.value.name || this.t('verrazzano.coherence.tabs.jvmDebug');
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
          <div class="spacer-tiny" />
          <Checkbox
            :value="getField('enabled')"
            :mode="mode"
            :label="t('verrazzano.coherence.fields.jvmDebugEnabled')"
            @input="setBooleanField('enabled', $event)"
          />
          <div class="spacer-tiny" />
          <Checkbox
            :value="getField('suspend')"
            :mode="mode"
            :label="t('verrazzano.coherence.fields.jvmDebugSuspended')"
            @input="setBooleanField('suspend', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('attach')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'attach')"
            :label="t('verrazzano.coherence.fields.jvmDebugAttach')"
            @input="setFieldIfNotEmpty('attach', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('port')"
            :mode="mode"
            type="Number"
            :min="minPortNumber"
            :max="maxPortNumber"
            :placeholder="getNotSetPlaceholder(value, 'port')"
            :label="t('verrazzano.coherence.fields.jvmDebugPort')"
            @input="setNumberField('port', $event)"
          />
        </div>
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
