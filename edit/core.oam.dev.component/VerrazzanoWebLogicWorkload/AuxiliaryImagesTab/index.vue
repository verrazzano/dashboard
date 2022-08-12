<script>
// Added by Verrazzano
import AuxiliaryImage from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImagesTab/AuxiliaryImage';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'AuxiliaryImages',
  components: {
    ArrayListGrouped,
    AuxiliaryImage,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [WeblogicWorkloadHelper, DynamicListHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
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
      this.treeTabLabel = this.t('verrazzano.weblogic.tabs.auxiliaryImages');
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
      <div>
        <ArrayListGrouped
          v-model="dynamicListChildren"
          :mode="mode"
          :default-add-value="{ }"
          :add-label="t('verrazzano.weblogic.buttons.addAuxiliaryImage')"
          @add="dynamicListAddChild({})"
        >
          <template #remove-button="removeProps">
            <button
              v-if="dynamicListShowRemoveButton"
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
            <AuxiliaryImage
              :value="props.row.value"
              :mode="mode"
              :namespaced-object="namespacedObject"
              @input="dynamicListUpdate"
            />
          </template>
        </ArrayListGrouped>
        <div v-if="dynamicListShowEmptyListMessage()">
          {{ t('verrazzano.weblogic.messages.noAuxiliaryImages') }}
        </div>
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../../verrazzano-styles.css";
</style>
