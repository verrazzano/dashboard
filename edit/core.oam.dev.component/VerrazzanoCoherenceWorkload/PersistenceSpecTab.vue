<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledSelect from '@/components/form/LabeledSelect';
import PersistenceStorageSpecTab
  from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PersistenceStorageSpecTab';
import PersistentVolumeClaimTab from '@/components/verrazzano/PersistentVolumeClaimTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VolumeTab from '@/components/verrazzano/VolumesTab/VolumeTab';

export default {
  name:       'PersistenceSpecTab',
  components: {
    LabeledSelect,
    PersistenceStorageSpecTab,
    PersistentVolumeClaimTab,
    TabDeleteButton,
    TreeTab,
    VolumeTab,
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
  computed: {
    persistenceModes() {
      return [
        { value: 'on-demand', label: this.t('verrazzano.coherence.types.persistenceModes.onDemand') },
        { value: 'active', label: this.t('verrazzano.coherence.types.persistenceModes.active') },
        { value: 'active-async', label: this.t('verrazzano.coherence.types.persistenceModes.activeAsync') },
      ];
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.coherence.tabs.persistence');
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
            :value="getField('mode')"
            :mode="mode"
            :options="persistenceModes"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(value, 'mode')"
            :label="t('verrazzano.coherence.fields.persistenceMode')"
            @input="setFieldIfNotEmpty('mode', $event)"
          />
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <PersistentVolumeClaimTab
        :value="getField('persistentVolumeClaim')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'persistentVolumeClaim')"
        @input="setFieldIfNotEmpty('persistentVolumeClaim', $event)"
        @delete="setField('persistentVolumeClaim', undefined)"
      />
      <VolumeTab
        :value="getField('volume')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        name-is-editable
        :tab-name="createTabName(treeTabName, 'volume')"
        @input="setFieldIfNotEmpty('volume', $event)"
        @delete="setField('volume', undefined)"
      />
      <PersistenceStorageSpecTab
        :value="getField('snapshots')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'snapshots')"
        @input="setFieldIfNotEmpty('snapshots', $event)"
        @delete="setField('snapshots', undefined)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
