<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import OAMEnvironmentVariable
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainersTab/OAMEnvironmentVariablesTab/OAMEnvironmentVariable';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'OAMEnvironmentVariablesTab',
  components: {
    ArrayListGrouped,
    OAMEnvironmentVariable,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [ContainerizedWorkloadHelper, DynamicListHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create',
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
  computed: {
    showEnvVarRemoveButton() {
      return !this.isView && this.dynamicListChildren.length > 0;
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.environmentVariables');
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
        @click="dynamicListClearChildrenList"
      />
    </template>
    <template #default>
      <ArrayListGrouped
        :value="dynamicListChildren"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.common.buttons.addEnvVar')"
        @add="dynamicListAddChild()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showEnvVarRemoveButton"
            type="button"
            class="btn role-link close btn-sm"
            @click="dynamicListDeleteChildByIndex(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <div class="spacer-small" />
          <OAMEnvironmentVariable
            :value="props.row.value"
            :mode="mode"
            @input="dynamicListUpdate"
          />
        </template>
      </ArrayListGrouped>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
