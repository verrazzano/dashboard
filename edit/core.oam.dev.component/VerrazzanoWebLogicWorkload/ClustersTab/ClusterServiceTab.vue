<script>
// Added by Verrazzano
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/verrazzano/LabelsTab/Labels';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ClusterService',
  components: {
    LabeledSelect,
    Labels,
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
      this.treeTabLabel = this.value.clusterName || this.t('verrazzano.weblogic.tabs.clusterService');
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
          <LabeledSelect
            :value="getField('sessionAffinity')"
            :mode="mode"
            :options="sessionAffinityOptions"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(value, 'sessionAffinity')"
            :label="t('verrazzano.common.fields.sessionAffinity')"
            @input="setFieldIfNotEmpty('sessionAffinity', $event)"
          />
        </div>
      </div>
      <div class="spacer" />
      <div>
        <Labels
          :value="value"
          :mode="mode"
          @input="$emit('input', value)"
        />
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
