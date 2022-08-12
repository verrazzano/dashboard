<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabelsTab from '@/components/verrazzano/LabelsTab';
import OwnerReferencesTab from '@/components/verrazzano/ObjectMetadataTab/OwnerReferencesTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { NAMESPACE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ObjectMetadataTab',
  components: {
    LabeledInput,
    LabeledSelect,
    LabelsTab,
    OwnerReferencesTab,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
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
      fetchInProgress: true,
      allNamespaces:   [],
      treeTabName:     this.tabName,
      treeTabLabel:    this.tabLabel,
    };
  },
  async fetch() {
    const requests = { namespaces: this.$store.dispatch('cluster/findAll', { type: NAMESPACE }) };

    const hash = await allHash(requests);

    if (hash.namespaces) {
      this.allNamespaces = hash.namespaces;
    }
    this.fetchInProgress = false;
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.metadata');
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
      <div class="spacer" />
      <div class="row">
        <div class="col span-6">
          <LabeledSelect
            :value="getField('namespace')"
            :mode="mode"
            :options="allNamespaces"
            option-label="metadata.name"
            :reduce="ns => ns.metadata.name"
            :placeholder="getNotSetPlaceholder(value, 'namespace')"
            :label="t('verrazzano.common.fields.namespace')"
            @input="setFieldIfNotEmpty('namespace', $event)"
          />
        </div>
        <div class="col span-6">
          <LabeledInput
            :value="getField('name')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'name')"
            :label="t('verrazzano.common.fields.name')"
            @input="setFieldIfNotEmpty('name', $event)"
          />
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <LabelsTab
        :value="value"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'labels')"
        @input="$emit('input', value)"
      />
      <OwnerReferencesTab
        :value="getListField('ownerReferences')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'ownerReferences')"
        @input="setFieldIfNotEmpty('ownerReferences', $event)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
